import Boom from '@hapi/boom';
import { db } from '../database.js';

export const loginRoute = {
    method: 'GET',
    path: '/api/login',
    handler: async (req, h) => {
        const email = req.query.email;
        const league = req.query.league;
        const team = req.query.team;

        try {
            const { results: userInfo } = await db.query( 
                `SELECT u.*, t.league_id
                FROM users u JOIN teams t
                    ON t.managed_by LIKE CONCAT('%', u.user_name, '%')
                WHERE u.email = ?`,
                 [email]
            );

            const { results: teamInfo } = await db.query( 
                `SELECT COUNT(*) AS roster_size, SUM(aav_current) as total_cap
                FROM player_owned_by pob JOIN players p 
                    ON pob.player_id = p.player_id
                WHERE pob.league_id = ?
                    AND pob.team_id = ?
                    AND pob.onIR = 0
                    AND pob.isRookie = 0`,
                 [league, team]
            );

            return { userInfo, teamInfo };

        } catch (err) {
            console.error(err);
            throw Boom.internal('Internal Server Error');
        }
    }
};