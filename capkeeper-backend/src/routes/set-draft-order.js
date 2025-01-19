import Boom from '@hapi/boom';
import { db } from '../database.js';

export const setDraftOrderRoute = {
    method: 'POST',
    path: '/api/set-draft-order',
    handler: async (req, h) => {
        try {
            const { draft_id, draft_picks } = req.payload;

            const updateDraftQuery = `
                UPDATE drafts
                SET status = 'order-set'
                WHERE draft_id = ?
            `;
            await db.query(updateDraftQuery, [draft_id]);

            for (const pick of draft_picks) {
                const { asset_id, position, pick_number } = pick;

                const updatePickQuery = `
                    UPDATE draft_picks
                    SET position = ?,
                        pick_number = ?
                    WHERE asset_id = ?
                `;
                await db.query(updatePickQuery, [position, pick_number, asset_id]);
            }
            return h.response({ message: 'Draft order successfully set.' }).code(201);

        } catch (error) {
            console.error('Error setting draft order:', error);
            return Boom.internal('Error setting draft order');
        }
    }
};