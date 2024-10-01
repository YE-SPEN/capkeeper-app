import Boom from '@hapi/boom';
import { db } from '../database.js';

export const editTeamRoute = {
    method: 'POST',
    path: '/api/teams/edit-team-info',
    handler: async (req, h) => {
        try {
            const { league_id, old_team_id, team_id, team_name, picture } = req.payload;
            
            const query = `
            UPDATE teams
            SET
                team_id = ?,
                team_name = ?,
                picture = ?
            WHERE league_id = ?
                AND team_id = ?
            `;

            let result = await db.query(query, [team_id, team_name, picture, league_id, old_team_id]);
            return h.response(result).code(200);

        }
        catch (error) {
            console.error('Error handling new player request:', error);
            return h.response(error.message).code(500);
        }
    }
};