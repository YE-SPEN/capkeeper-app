import Boom from '@hapi/boom';
import { db } from '../database.js';

export const editLeagueRoute = {
    method: 'POST',
    path: '/api/{league_id}/edit-league',
    handler: async (req, h) => {
        try {
            const league_id = req.params.league_id;
            const { max_roster_size, min_forwards, min_defense, min_goalies, ir_slots, rookie_bank_size, salary_cap, general_draft_length, rookie_draft_length, retention_slots, max_retention_perc } = req.payload;
            
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

            let result = await db.query(query, [max_roster_size, min_forwards, min_defense, min_goalies, ir_slots, rookie_bank_size, salary_cap, general_draft_length, rookie_draft_length, retention_slots, max_retention_perc, league_id]);
            return h.response(result).code(200);

        }
        catch (error) {
            console.error('Error handling new player request:', error);
            return h.response(error.message).code(500);
        }
    }
};