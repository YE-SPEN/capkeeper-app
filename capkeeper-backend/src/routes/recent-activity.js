import Boom from '@hapi/boom';
import { db } from '../database.js';

export const recentActivityRoute = {
    method: 'GET',
    path: '/api/{league_id}/activity-log',
    handler: async (req, h) => {
        const league_id = req.params.league_id;
        const date = req.query.date;

        try {
            const { results: action_log } = await db.query( 
                `SELECT * FROM recent_activity
                WHERE league_id = ?
                    AND date >= ?
                ORDER BY date DESC, time DESC`,
                 [league_id, date]
            );

            const { results: users } = await db.query( 
                `SELECT first_name, last_name, user_name 
                FROM users u
                    JOIN teams t ON FIND_IN_SET(u.user_name, t.managed_by) > 0
                WHERE t.league_id = ?`,
                [league_id]
            );

            return { action_log, users };

        } catch (err) {
            console.error(err);
            throw Boom.internal('Internal Server Error');
        }
    }
};