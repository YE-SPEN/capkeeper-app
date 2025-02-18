import Boom from '@hapi/boom';
import { db } from '../database.js';

export const leagueHomeRoute = {
    method: 'GET',
    path: '/api/{league_id}/home',
    handler: async (req, h) => {
        const league_id = req.params.league_id;

        try {
            const { results: recentActivity } = await db.query( 
                    `SELECT * FROM recent_activity
                    WHERE league_id = ?
                        AND action_type IN ('add-player', 'drop-player')
                    ORDER BY date DESC, time DESC
                    LIMIT 11`,
                     [league_id]
                );

            const { results: teams } = await db.query( 
                `SELECT *
                FROM teams
                WHERE league_id = ?`,
                [league_id]
            );
            
            const { results: teamPoints } = await db.query( 
                `SELECT *
                FROM team_points
                WHERE league_id = ?`,
                [league_id]
            );

            const { results: faPicks } = await db.query(
                `SELECT fa.asset_id, fa.assigned_to, fa.owned_by, fa.year, fa.week, fa.expiry_date, 
                    CASE 
                        WHEN fa.player_taken = 'Penalty' THEN fa.player_taken
                        ELSE CONCAT(UPPER(SUBSTRING(p.first_name, 1, 1)), '. ', p.last_name) 
                    END AS player_taken
                FROM fa_picks fa
                    LEFT JOIN players p ON fa.player_taken = p.player_id
                    JOIN leagues l on fa.league_id = l.league_id
                WHERE fa.league_id = ?
                AND fa.year = l.current_season`,
                [league_id]
            );

            const { results: generalPicks } = await db.query(
                `SELECT dp.asset_id, dp.round, dp.position, dp.pick_number, dp.assigned_to, dp.owned_by, dp.year, dp.type
                FROM leagues l 
                    JOIN drafts d ON l.league_id = d.league_id
                    JOIN draft_picks dp ON d.draft_id = dp.draft_id
                WHERE d.league_id = ?
                    AND d.type = 'general'
                    AND d.year = l.current_season + 1
                ORDER BY dp.round, dp.pick_number`,
                [league_id]
            );

            const { results: rookiePicks } = await db.query(
                `SELECT dp.asset_id, dp.round, dp.position, dp.pick_number, dp.assigned_to, dp.owned_by, dp.year, dp.type
                FROM leagues l 
                    JOIN drafts d ON l.league_id = d.league_id
                    JOIN draft_picks dp ON d.draft_id = dp.draft_id
                WHERE d.league_id = ?
                    AND d.type = 'rookie'
                    AND d.year = l.current_season + 1
                ORDER BY dp.round, dp.pick_number`,
                [league_id]
            );

            return { recentActivity, teams, teamPoints, faPicks, generalPicks, rookiePicks };

        } catch (err) {
            console.error(err);
            throw Boom.internal('Internal Server Error');
        }
    }
};