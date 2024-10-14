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
                    LIMIT 10`,
                     [league_id]
                );

            const { results: teamPoints } = await db.query( 
                `SELECT *
                FROM team_points
                WHERE league_id = ?`,
                [league_id]
            );

            return { recentActivity, teamPoints };

        } catch (err) {
            console.error(err);
            throw Boom.internal('Internal Server Error');
        }
    }
};