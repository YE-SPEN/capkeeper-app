import Boom from '@hapi/boom';
import { db } from '../database.js';

export const resolveTradeConditionRoute = {
    method: 'POST',
    path: '/api/resolve-condition/{condition_id}',
    handler: async (req, h) => {
        try {
            const condition_id = req.params.condition_id;

            const query = `
                UPDATE trade_conditions
                SET status = 'resolved'
                WHERE condition_id = ?
            `;
            let result = await db.query(query, [condition_id]);

            return h.response({ message: 'Condition Marked as Resolved', result }).code(200);  

        }
        catch (error) {
            console.error('Error Resolving Trqde Condition:', error);
            return h.response('An internal error occurred').code(500); 
        }
    }
};