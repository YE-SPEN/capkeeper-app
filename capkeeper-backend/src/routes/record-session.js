import Boom from '@hapi/boom';
import { db } from '../database.js';

export const recordSessionRoute = {
    method: 'POST',
    path: '/api/record-session',
    handler: async (req, h) => {
        try {
            const { date, time, user_id, action } = req.payload;
            let result;
            
            if (action === 'login') {
                const query = `
                UPDATE users
                SET log_in_date = ?,
                    log_in_time = ?
                WHERE user_name = ?
                `;
                result = await db.query(query, [ date, time, user_id]);
                return h.response(result).code(201);       
            }
            
            if (action === 'logout') {
                const query = `
                UPDATE users
                SET log_out_date = ?,
                    log_out_time = ?
                WHERE user_name = ?
                `;
                result = await db.query(query, [date, time, user_id]);
                return h.response(result).code(201);
            }

        }
        catch (error) {
            console.error('Error handling new player request:', error);
            return h.response(error.message).code(500);
        }
    }
};