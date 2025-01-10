import Boom from '@hapi/boom';
import { db } from '../database.js';

export const editLeagueRoute = {
    method: 'POST',
    path: '/api/{league_id}/edit-league',
    handler: async (req, h) => {
        try {
            const league_id = req.params.league_id;
            const {
                action,
                league_name,
                picture,
                max_roster_size,
                min_forwards,
                min_defense,
                min_goalies,
                ir_slots,
                rookie_bank_size,
                salary_cap,
                general_draft_length,
                rookie_draft_length,
                retention_slots,
                max_retention_perc
            } = req.payload;

            let result;

            if (action === 'settings') {
                const query = `
                UPDATE leagues
                SET
                    max_roster_size = ?,
                    min_forwards = ?,
                    min_defense = ?,
                    min_goalies = ?,
                    ir_slots = ?,
                    rookie_bank_size = ?,
                    salary_cap = ?,
                    general_draft_length = ?,
                    rookie_draft_length = ?,
                    retention_slots = ?,
                    max_retention_perc = ?
                WHERE league_id = ?
                `;

                result = await db.query(query, [max_roster_size, min_forwards, min_defense, min_goalies, ir_slots, rookie_bank_size, salary_cap, general_draft_length, rookie_draft_length, retention_slots, max_retention_perc, league_id]);
                return h.response({ success: true, message: 'League settings updated successfully' }).code(200);
            }

            if (action === 'details') {
                const query = `
                UPDATE leagues
                SET
                    league_name = ?,
                    picture = ?
                WHERE league_id = ?
                `;

                result = await db.query(query, [league_name, picture, league_id]);
                return h.response({ success: true, message: 'League details updated successfully' }).code(200);
            }

            return h.response({ success: false, message: 'Invalid action specified' }).code(400);

        } catch (error) {
            console.error('Error handling edit league request:', error);
            return h.response({ success: false, message: error.message }).code(500);
        }
    }
};