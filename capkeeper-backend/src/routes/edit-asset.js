import Boom from '@hapi/boom';
import { db } from '../database.js';

export const editAssetRoute = {
    method: 'POST',
    path: '/api/edit-asset',
    handler: async (req, h) => {
        try {
            const { type, asset_id, owned_by, player_taken } = req.payload;

            if (!type || !asset_id || !owned_by || !player_taken) {
                throw Boom.badRequest('Missing required fields in payload');
            }

            let result;
            if (type === 'draft-pick') {
                const draftPickQuery = `
                UPDATE draft_picks
                SET
                    owned_by = ?,
                    player_taken = ?
                WHERE asset_id = ?
                `;

                result = await db.query(draftPickQuery, [owned_by, player_taken, asset_id]);
                return h.response({ message: 'Draft pick updated successfully', result }).code(200);
            }

            if (type === 'fa') {
                const faQuery = `
                UPDATE fa_picks
                SET
                    owned_by = ?,
                    player_taken = ?
                WHERE asset_id = ?
                `;

                result = await db.query(faQuery, [owned_by, player_taken, asset_id]);
                return h.response({ message: 'FA pick updated successfully', result }).code(200);
            }

            throw Boom.badRequest(`Invalid asset type: ${type}`);
        } catch (error) {
            console.error('Error handling edit asset request:', error);
            if (Boom.isBoom(error)) {
                return error;
            }
            return Boom.internal('An unexpected error occurred');
        }
    },
};
