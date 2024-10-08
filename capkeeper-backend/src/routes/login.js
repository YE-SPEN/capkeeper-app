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
                `SELECT 
                    u.*, 
                    tmb.league_id, 
                    tmb.team_id AS team_managed,
                    (SELECT COUNT(*)
                    FROM recent_activity ra
                    WHERE TIMESTAMP(ra.DATE, ra.TIME) >= TIMESTAMP(u.log_out_date, u.log_out_time)) AS notification_count
                FROM 
                    users u 
                JOIN 
                    team_managed_by tmb ON u.user_name = tmb.user_name
                WHERE 
                    u.email = ?`,
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