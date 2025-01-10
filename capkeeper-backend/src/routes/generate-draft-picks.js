import Boom from '@hapi/boom';
import { db } from '../database.js';

export const generateDraftPicksRoute = {
    method: 'POST',
    path: '/api/generate-draft-picks',
    handler: async (req, h) => {
        try {
            const draft_picks = req.payload;
            console.log(draft_picks)

            for (const pick of draft_picks) {
                const { year, type, round, assigned_to, league_id } = pick;

                    const query = `
                    INSERT INTO draft_picks (year, type, round, assigned_to, league_id)
                    VALUES (?, ?, ?, ?, ?)
                    `;
                    await db.query(query, [year, type, round, assigned_to, league_id]);
            }
            return h.response({ message: 'Draft picks generated successfully' }).code(201);

        } catch (error) {
            console.error('Error generating draft picks:', error);
            return h.response(error.message).code(500);
        }
    }
};