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

            const { results: drafts } = await db.query(
                `SELECT * FROM drafts
                WHERE league_id = ?
                ORDER BY year, type`,
                [league_id]
            )

            const { results: draft_picks } = await db.query(
                `SELECT dp.draft_id, dp.asset_id, d.year, dp.round, dp.position, dp.pick_number, d.type, dp.assigned_to, dp.owned_by, dp.player_taken, CONCAT(p.first_name, ' ', p.last_name) AS player_full_name
                FROM drafts d
                JOIN draft_picks dp 
					ON d.draft_id = dp.draft_id
                LEFT JOIN players p
                    ON dp.player_taken = p.player_id
                WHERE d.league_id = ?
                ORDER BY d.type, d.year ASC, dp.round ASC, dp.position ASC`,
                [league_id]
            )

            const { results: fa_picks } = await db.query(
                `SELECT f.asset_id, f.year, f.week, f.expiry_date, f.assigned_to, f.owned_by, f.player_taken, CONCAT(p.first_name, ' ', p.last_name) AS player_full_name
                FROM fa_picks f 
                LEFT JOIN players p
                    ON f.player_taken = p.player_id
                WHERE league_id = ?
                ORDER BY year, week ASC, assigned_to`,
                [league_id]
            )

            return { users, teams, league, drafts, draft_picks, fa_picks };

        } catch (err) {
            console.error(err);
            throw Boom.internal('Internal Server Error');
        }
    }
};