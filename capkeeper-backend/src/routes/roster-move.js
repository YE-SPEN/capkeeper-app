import Boom from '@hapi/boom';
import { db } from '../database.js';

export const rosterMoveRoute = {
    method: 'POST',
    path: '/api/players/roster-move',
    handler: async (req, h) => {
        try {
            const { player_id, league_id, action } = req.payload;

            if (!player_id || !league_id || !action) {
                return h.response('Missing required fields').code(400);
            }

            let result;

            if (action === 'callup') {
                const callupQuery = `
                    UPDATE player_owned_by
                    SET isRookie = NOT isRookie
                    WHERE league_id = ?
                      AND player_id = ?
                `;
                result = await db.query(callupQuery, [league_id, player_id]);
                return h.response({ message: 'Rookie status updated', result }).code(200);  
            }
            
            if (action === 'ir') {
                const irQuery = `
                    UPDATE player_owned_by
                    SET onIR = NOT onIR
                    WHERE league_id = ?
                      AND player_id = ?
                `;
                result = await db.query(irQuery, [league_id, player_id]);
                return h.response({ message: 'IR status updated', result }).code(200);  
            }

            if (action === 'trade-block') {
                const tradeBlockQuery = `
                    UPDATE player_owned_by
                    SET onTradeBlock = NOT onTradeBlock
                    WHERE league_id = ?
                      AND player_id = ?
                `;
                result = await db.query(tradeBlockQuery, [league_id, player_id]);
                return h.response({ message: 'Trade block status updated', result }).code(200);  
            }
            
            return h.response('Invalid action specified').code(400);
        }
        catch (error) {
            console.error('Error handling roster move request:', error);
            return h.response('An internal error occurred').code(500); 
        }
    }
};
