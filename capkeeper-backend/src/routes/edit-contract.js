import Boom from '@hapi/boom';
import { db } from '../database.js';

export const editContractRoute = {
    method: 'POST',
    path: '/api/players/edit-contract',
    handler: async (req, h) => {
        try {
            const { player_id, aav_current, years_left_current, aav_next, years_left_next, expiry_status, last_updated, updated_by, } = req.payload;
            
            const query = `
            UPDATE players
            SET
                aav_current = ?,
                years_left_current = ?,
                aav_next = ?,
                years_left_next = ?,
                expiry_status = ?,
                last_updated = ?,
                updated_by = ?
            WHERE player_id = ?
            `;

            let result = await db.query(query, [aav_current, years_left_current, aav_next, years_left_next, expiry_status, last_updated, updated_by, player_id]);
            return h.response(result).code(200);

        }
        catch (error) {
            console.error('Error handling new player request:', error);
            return h.response(error.message).code(500);
        }
    }
};