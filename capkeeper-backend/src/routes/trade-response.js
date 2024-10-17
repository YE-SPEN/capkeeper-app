import Boom from '@hapi/boom';
import { db } from '../database.js';

export const confirmTradeRoute = {
    method: 'POST',
    path: '/api/confirm-trade',
    handler: async (req, h) => {
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
                const acceptQuery = `
                UPDATE trades
                SET status = 'Accepted'
                WHERE trade_id = ?
                `;
                await db.query(acceptQuery, [trade_id]);

                const tradeItemsQuery = `
                SELECT ti.*
                FROM trade_items ti
                WHERE ti.trade_id = ?
                `;
                const tradeItems = await db.query(tradeItemsQuery, [trade_id]);

                for (const item of tradeItems.results) {
                    const { asset_type, traded_to, player_id, draft_pick_id, fa_id } = item;

                    if (asset_type === 'player') {
                        const updatePlayerQuery = `
                        UPDATE player_owned_by
                        SET team_id = ?
                        WHERE player_id = ?
                        AND league_id = ?
                        `;
                        await db.query(updatePlayerQuery, [traded_to, player_id, league_id]);

                    } else if (asset_type === 'draft_pick') {
                        const updateDraftPickQuery = `
                        UPDATE draft_picks
                        SET owned_by = ?
                        WHERE asset_id = ?
                        `;
                        await db.query(updateDraftPickQuery, [traded_to, draft_pick_id]);

                    } else if (asset_type === 'fa') {
                        const updateFAQuery = `
                        UPDATE fa_picks
                        SET owned_by = ?
                        WHERE asset_id = ?
                        `;
                        await db.query(updateFAQuery, [traded_to, fa_id]);
                    }
                }

                return h.response({ message: 'Trade accepted and ownership updated.' }).code(201);
            }
        } catch (error) {
            console.error('Error handling trade request:', error);
            return h.response(error.message).code(500);
        }
    }
};