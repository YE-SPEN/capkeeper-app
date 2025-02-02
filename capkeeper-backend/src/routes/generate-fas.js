import Boom from '@hapi/boom';
import { db } from '../database.js';

export const generateFARoute = {
    method: 'POST',
    path: '/api/generate-fas',
    handler: async (req, h) => {
        try {
            const { year, league_id, fa_picks } = req.payload;
           
            if (!fa_picks || fa_picks.length === 0) {
                throw Boom.badRequest('No FA picks provided');
            }

            for (const fa of fa_picks) {
                const { week, assigned_to, expiry_date } = fa;

                const query = `
                    INSERT INTO fa_picks (league_id, year, week, assigned_to, expiry_date)
                    VALUES (?, ?, ?, ?, ?)
                `;
                await db.query(query, [league_id, year, week, assigned_to, expiry_date]);
            }

            return h.response({ message: 'FAs generated successfully' }).code(201);

        } catch (error) {
            console.error('Error generating FAs:', error);

            if (error.isBoom) {
                throw error;
            }

            throw Boom.internal('Error generating FAs');
        }
    }
};