import Boom from '@hapi/boom';
import { db } from '../database.js';

export const addDropRoute = {
    method: 'POST',
    path: '/api/players/add-drop',
    handler: async (req, h) => {
        try {
            const { player_id, league_id, team_id, isRookie, last_updated, updated_by, action } = req.payload;
            let result;

            const updateQuery = `
            UPDATE players
            SET last_updated = ?,
                updated_by = ?
            WHERE player_id = ?
            `;
            await db.query(updateQuery, [last_updated, updated_by, player_id]);

            if (action === 'add') {
                const insertQuery = `
                INSERT INTO player_owned_by (player_id, league_id, team_id, isRookie)
                VALUES (?, ?, ?, ?)
                `;
                result = await db.query(insertQuery, [player_id, league_id, team_id, isRookie]);
                return h.response(result).code(201);  
            }
            
            if (action === 'drop') {
                const deleteQuery = `
                DELETE FROM player_owned_by
                WHERE player_id = ?
                    AND league_id = ?
                `;
                await db.query(deleteQuery, [player_id, league_id]);
                return h.response().code(204); 
            }
            
            return h.response('Invalid action specified').code(400);
        }
        catch (error) {
            console.error('Error handling new player request:', error);
            return h.response('An internal error occurred').code(500); 
        }
    }
};
