import Boom from '@hapi/boom';
import { db } from '../database.js';

export const commisssionerHubRoute = {
    method: 'GET',
    path: '/api/{league_id}/commissioner-hub',
    handler: async (req, h) => {
        const league_id = req.params.league_id;

        try {

            const { results: users } = await db.query(
                `SELECT u.user_name, u.first_name, u.last_name, u.picture, u.email, u.log_in_date, u.log_in_time, t.team_name AS team_managed, tmb.isAdmin 
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

            const { results: draft_picks } = await db.query(
                `SELECT d.asset_id, d.year, d.round, d.position, d.pick_number, d.type, d.assigned_to, d.owned_by, 
                    CASE 
                        WHEN d.player_taken = 'none' THEN 'Burned'
                        ELSE CONCAT(p.first_name, ' ', p.last_name) 
                    END AS player_taken
                FROM draft_picks d 
                LEFT JOIN players p
                    ON d.player_taken = p.player_id
                WHERE league_id = ?
                ORDER BY d.type, d.year, d.round, d.position`,
                [league_id]
            )

            return { users, teams, league, draft_picks };

        } catch (err) {
            console.error(err);
            throw Boom.internal('Internal Server Error');
        }
    }
};