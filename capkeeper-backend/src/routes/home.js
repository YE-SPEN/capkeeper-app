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
                WHERE fa.league_id = ?
                AND fa.year = 2024`,
                [league_id]
            )

            return { recentActivity, teams, teamPoints, faPicks };

        } catch (err) {
            console.error(err);
            throw Boom.internal('Internal Server Error');
        }
    }
};