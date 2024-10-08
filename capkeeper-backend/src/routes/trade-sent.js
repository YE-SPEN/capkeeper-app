import Boom from '@hapi/boom';
import { db } from '../database.js';

export const sendTradeRoute = {
    method: 'POST',
    path: '/api/send-trade',
    handler: async (req, h) => {
        try {
            const { league_id, requested_by, sent_to, assets } = req.payload;

            const insertTradeQuery = `
                INSERT INTO trades (league_id, requested_by, sent_to, status)
                VALUES (?, ?, ?, 'Pending');
            `;
            
            const tradeResult = await db.query(insertTradeQuery, [league_id, requested_by, sent_to]);
            const trade_id = tradeResult.results.insertId;

            if (assets && assets.length > 0) {
                const insertAssetQuery = `
                    INSERT INTO trade_items (trade_id, draft_pick_id, fa_id, player_id, traded_to, asset_type)
                    VALUES (?, ?, ?, ?, ?, ?);
                `;

                for (const asset of assets) {
                    console.log('Asset object: ', asset)
                    await db.query(insertAssetQuery, [trade_id, asset.draft_pick_id, asset.fa_id, asset.player_id, asset.traded_to, asset.asset_type]);
                }
            }

            return h.response({ trade_id }).code(201);
        } catch (error) {
            console.error('Error handling trade request:', error);
            return h.response(error.message).code(500);
        }
    }
};
