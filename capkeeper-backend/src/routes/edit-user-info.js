import Boom from '@hapi/boom';
import { db } from '../database.js';

export const editUserRoute = {
    method: 'POST',
    path: '/api/edit-user-info',
    handler: async (req, h) => {
        try {
            const { old_user_id, user_name, first_name, last_name, email, picture } = req.payload;
            
            const query = `
            UPDATE users
            SET
                user_name = ?,
                first_name = ?,
                last_name = ?,
                email = ?,
                picture = ?
            WHERE user_name = ?
            `;

            let result = await db.query(query, [user_name, first_name, last_name, email, picture, old_user_id]);
            return h.response(result).code(200);

        }
        catch (error) {
            console.error('Error handling new user request:', error);
            return h.response(error.message).code(500);
        }
    }
};