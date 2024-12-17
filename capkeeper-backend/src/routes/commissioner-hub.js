import Boom from '@hapi/boom';
import { db } from '../database.js';

export const commisssionerHubRoute = {
    method: 'GET',
    path: '/api/{league_id}/commissioner-hub',
    handler: async (req, h) => {
        const league_id = req.params.league_id;

        try {

            const { results: users } = await db.query(
                `SELECT u.first_name, u.last_name, u.picture, u.email, u.log_in_date, u.log_in_time, t.team_name AS team_managed, tmb.isAdmin 
                FROM users u JOIN team_managed_by tmb
                    ON u.user_name = tmb.user_name
                    JOIN teams t
                    ON tmb.team_id = t.team_id
                WHERE tmb.league_id = ?
                ORDER BY t.team_name, u.last_name`,
                [league_id]
            )

            const { results: teams } = await db.query(
                `SELECT u.first_name, u.last_name, u.picture, u.email, t.team_name 
                FROM users u JOIN team_managed_by tmb
                    ON u.user_name = tmb.user_name
                    JOIN teams t
                    ON tmb.team_id = t.team_id
                WHERE tmb.league_id = ?
                ORDER BY t.team_name, u.last_name`,
                [league_id]
            )

            const { results: league } = await db.query(
                `SELECT * FROM leagues
                WHERE league_id = ?`,
                [league_id]
            )

            return { users, teams, league };

        } catch (err) {
            console.error(err);
            throw Boom.internal('Internal Server Error');
        }
    }
};