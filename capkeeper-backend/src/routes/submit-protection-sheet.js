import Boom from '@hapi/boom';
import { db } from '../database.js';

export const submitProtectionsRoute = {
    method: 'POST',
    path: '/api/{league_id}/{team_id}/protection-sheet',
    handler: async (req, h) => {
        const team_id = req.params.team_id;
        const league_id = req.params.league_id;

        try {
            const { players } = req.payload;

            const deleteQuery = `
                DELETE FROM protection_sheets 
                WHERE league_id = ? AND team_id = ?;
            `;
            await db.query(deleteQuery, [league_id, team_id]);

            if (players && players.length > 0) {
                const insertAssetQuery = `
                    INSERT INTO protection_sheets (player_id, league_id, team_id, onBench, isFranchise)
                    VALUES (?, ?, ?, ?, ?);
                `;

                for (const player of players) {
                    await db.query(insertAssetQuery, [
                        player.player_id,
                        league_id,
                        team_id,
                        player.onBench,
                        player.isFranchise || false,
                    ]);
                }
            }

            return h.response({ message: 'Protection sheet submitted successfully.' }).code(201);

        } catch (error) {
            console.error('Error submitting protection sheet:', error);
            return h.response(error.message).code(500);
        }
    }
};
