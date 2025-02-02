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
                    const { asset_type, traded_to, traded_from, player_id, draft_pick_id, fa_id, retention_perc } = item;

                    if (asset_type === 'player') {
                        const updatePlayerQuery = `
                        UPDATE player_owned_by
                        SET team_id = ?,
                            onIR = 0,
                            onTradeBlock = 0,
                            retention_perc = ?
                        WHERE player_id = ?
                        AND league_id = ?
                        `;
                        await db.query(updatePlayerQuery, [traded_to, retention_perc, player_id, league_id]);

                        if (retention_perc > 0) {
                            const updateTeamQuery = `
                            UPDATE teams
                            SET player_retained = ?,
                                salary_retained = (SELECT ROUND(p.aav_current * (ti.retention_perc / 100)) AS salary_retained
                                                FROM players p 
                                                JOIN trade_items ti ON p.player_id = ti.player_id
                                                WHERE ti.trade_id = ?
                                                AND p.player_id = ?
                                                LIMIT 1)
                            WHERE team_id = ?`;
                            await db.query(updateTeamQuery, [player_id, trade_id, player_id, traded_from])
                        }

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
