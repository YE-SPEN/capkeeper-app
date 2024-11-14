import Boom from '@hapi/boom';
import { db } from '../database.js';

export const loadProtectionsRoute = {
    method: 'GET',
    path: '/api/{league_id}/{team_id}/protection-sheet',
    handler: async (req, h) => {
        const team_id = req.params.team_id;
        const league_id = req.params.league_id;

        try {
            const { results: players } = await db.query( 
                `SELECT p.*, ps.onBench, ps.isFranchise
                FROM players p JOIN protection_sheets ps 
                    ON p.player_id = ps.player_id
                WHERE ps.league_id = ?
                    AND ps.team_id = ? `,
                 [league_id, team_id]
            );

            return { players };

        } catch (err) {
            console.error(err);
            throw Boom.internal('Internal Server Error');
        }
    }
};