import Boom from '@hapi/boom';
import { db } from '../database.js';

export const sendTradeRoute = {
    method: 'POST',
    path: '/api/confirm-trade',
    handler: async (req, h) => {
        const connection = await db.getConnection();
        try {
            const { league_id, trade_id, action } = req.payload;

            if (action === 'reject') {
                const rejectQuery = `
                DELETE FROM trades
                WHERE trade_id = ?
                `;
                const result = await db.query(rejectQuery, [trade_id]);
                return h.response(result).code(201);
            }

            if (action === 'accept') {
                await connection.beginTransaction(); // Start transaction

                const acceptQuery = `
                UPDATE trades
                SET status = 'Accepted'
                WHERE trade_id = ?
                `;
                await connection.query(acceptQuery, [trade_id]);

                // Get trade items for the given trade
                const tradeItemsQuery = `
                SELECT ti.*
                FROM trade_items ti
                WHERE ti.trade_id = ?
                `;
                const [tradeItems] = await connection.query(tradeItemsQuery, [trade_id]);

                for (const item of tradeItems) {
                    const { asset_type, traded_to, player_id, draft_pick_id, fa_id } = item;

                    if (asset_type === 'player') {
                        const updatePlayerQuery = `
                        UPDATE player_owned_by
                        SET team_id = ?
                        WHERE player_id = ?
                        AND league_id = ?
                        `;
                        await connection.query(updatePlayerQuery, [traded_to, player_id, league_id]);

                    } else if (asset_type === 'draft_pick') {
                        const updateDraftPickQuery = `
                        UPDATE draft_picks
                        SET owned_by = ?
                        WHERE asset_id = ?
                        `;
                        await connection.query(updateDraftPickQuery, [traded_to, draft_pick_id]);

                    } else if (asset_type === 'fa') {
                        const updateFAQuery = `
                        UPDATE fa_picks
                        SET owned_by = ?
                        WHERE asset_id = ?
                        `;
                        await connection.query(updateFAQuery, [traded_to, fa_id]);
                    }
                }

                await connection.commit();
                return h.response({ message: 'Trade accepted and ownership updated.' }).code(201);
            }
        } catch (error) {
            await connection.rollback();
            console.error('Error handling trade request:', error);
            return h.response(error.message).code(500);
        } finally {
            connection.release(); // Release the connection back to the pool
        }
    }
};
