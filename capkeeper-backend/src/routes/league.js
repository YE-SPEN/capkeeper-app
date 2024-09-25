import Boom from '@hapi/boom';
import { db } from '../database.js';

export const leagueRoute = {
    method: 'GET',
    path: '/api/{league_id}',
    handler: async (req, h) => {
        const league_id = req.params.league_id;

        try {
            const { results: leagueInfo } = await db.query( 
                `SELECT l.*, CONCAT(u.first_name, ' ', u.last_name) AS commissioner
                FROM leagues l JOIN users u ON
                    l.commissioner_id = u.user_name
                WHERE league_id = ?`,
                 [league_id]
            );

            const league = leagueInfo[0];

            const { results: teams } = await db.query( 
                `SELECT * FROM teams
                WHERE league_id = ?`,
                [league_id]
            );

            const { results: nhl_teams } = await db.query(
                `SELECT * FROM nhl_logos`
            )

            return { league, teams, nhl_teams };

        } catch (err) {
            console.error(err);
            throw Boom.internal('Internal Server Error');
        }
    }
};