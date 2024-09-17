import Boom from '@hapi/boom';
import { db } from '../database.js';

export const createPlayerRoute = {
    method: 'POST',
    path: '/api/players/create-player',
    handler: async (req, h) => {
        try {
            const { player_id, first_name, last_name, short_code, position, last_updated, updated_by, action } = req.payload;
            let result;
            
            if (action === 'add') {
                const query = `
                INSERT INTO players (player_id, first_name, last_name, short_code, position, contract_status, years_left_current, aav_current, last_updated, updated_by)
                VALUES (?, ?, ?, ?, ?, 'Unsigned', 0, 0, ?, ?)
                `;
                result = await db.query(query, [player_id, first_name, last_name, short_code, position, last_updated, updated_by]);
                return h.response(result).code(201);
            }
            if (action === 'edit') {
                const query = `
                UPDATE players
                SET
                    first_name = ?,
                    last_name = ?,
                    short_code = ?,
                    position = ?,
                    last_updated = ?,
                    updated_by = ?
                WHERE player_id = ?
                `;
                result = await db.query(query, [first_name, last_name, short_code, position, last_updated, updated_by, player_id]);
                return h.response(result).code(200);
            }
            else {
                return h.response('Invalid action specified').code(400);
            }
        }
        catch (error) {
            console.error('Error handling new player request:', error);
            return h.response(error.message).code(500);
        }
    }
};