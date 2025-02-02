import Boom from '@hapi/boom';
import { db } from '../database.js';

export const pickHistoryRoute = {
    method: 'GET',
    path: '/api/pick-history/{asset_id}',
    handler: async (req, h) => {
        const asset_id = req.params.asset_id;

        try {
            const { results: pickHistory } = await db.query( 
                `SELECT ti.traded_to, ra.date 
                FROM trade_items ti 
                    JOIN trades t ON t.trade_id = ti.trade_id
                    JOIN recent_activity ra ON t.trade_id = ra.trade_id
                WHERE ti.draft_pick_id = ? OR ti.fa_id = ?
                ORDER BY ra.date ASC`,
                [asset_id, asset_id]
            );

            return { pickHistory };

        } catch (err) {
            console.error(err);
            throw Boom.internal('Internal Server Error');
        }
    }
};