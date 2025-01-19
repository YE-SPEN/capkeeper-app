import Boom from '@hapi/boom';
import { db } from '../database.js';

export const draftHistoryRoute = {
    method: 'GET',
    path: '/api/{league_id}/draft',
    handler: async (req, h) => {
        const league_id = req.params.league_id;
        const year = req.query.year;

        try {
            const { results: draft } = await db.query( 
                `SELECT d.*, dp.*, p.first_name AS player_first_name, p.last_name AS player_last_name, p.short_code AS player_short_code, p.position AS player_position 
                FROM drafts d 
                    JOIN draft_picks dp ON d.draft_id = dp.draft_id 
                    LEFT JOIN players p ON dp.player_taken = p.player_id
                WHERE d.league_id = ?
                AND d.year = ?
                ORDER BY d.type, dp.pick_number`,
                [league_id, year]
            );

            return { draft };

        } catch (err) {
            console.error(err);
            throw Boom.internal('Internal Server Error');
        }
    }
};