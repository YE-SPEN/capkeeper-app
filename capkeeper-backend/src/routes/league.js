import Boom from '@hapi/boom';
import { db } from '../database.js';

export const leagueRoute = {
    method: 'GET',
    path: '/api/{league_id}',
    handler: async (req, h) => {
        const league_id = req.params.league_id;

        try {
            const { rows } = await db.query( 
                `SELECT * from leagues
                WHERE
                    league_id = ?`,
                 [league_id]
            );

            const league = rows[0] || null;

            const { rows: teams } = await db.query( 
                `SELECT * FROM teams
                WHERE league_id = ?`,
                [league_id]
            );

            const team = rows[0] || null;

            return { league, teams };

        } catch (err) {
            console.error(err);
            throw Boom.internal('Internal Server Error');
        }
    }
};