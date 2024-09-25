import Boom from '@hapi/boom';
import { db } from '../database.js';

export const recentActivityRoute = {
    method: 'GET',
    path: '/api/{league_id}/activity-log',
    handler: async (req, h) => {
        const league_id = req.params.league_id;
        const { start, end } = req.query;

        if (!start || !end) {
            throw Boom.badRequest('Both start and end date parameters are required.');
        }

        try {
            const { results: action_log } = await db.query( 
                `SELECT * FROM recent_activity
                WHERE league_id = ?
                    AND date BETWEEN ? AND ?
                ORDER BY date DESC, time DESC`,
                 [league_id, start, end]
            );

            const { results: users } = await db.query( 
                `SELECT first_name, last_name, u.user_name 
                FROM users u JOIN team_managed_by tmb
                    ON u.user_name = tmb.user_name
                WHERE tmb.league_id = ?`,
                [league_id]
            );

            return { action_log, users };

        } catch (err) {
            console.error(err);
            throw Boom.internal('Internal Server Error');
        }
    }
};
