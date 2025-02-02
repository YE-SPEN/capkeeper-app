import Boom from '@hapi/boom';
import { db } from '../database.js';

export const editAssetRoute = {
    method: 'POST',
    path: '/api/edit-asset',
    handler: async (req, h) => {
        try {
            const { type, action, asset_id, owned_by, player_taken } = req.payload;

            let result;
            if (action === 'edit') {

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
            }

            if (action === 'revoke') {
                
                if (type === 'draft-pick') {
                    const draftPickQuery = `
                    UPDATE draft_picks
                    SET player_taken = 'penalty'
                    WHERE asset_id = ?
                    `;
    
                    result = await db.query(draftPickQuery, [asset_id]);
                    return h.response({ message: 'Draft pick revoked successfully', result }).code(200);
                }
    
                if (type === 'fa') {
                    const faQuery = `
                    UPDATE fa_picks
                    SET player_taken = 'penalty'
                    WHERE asset_id = ?
                    `;
    
                    result = await db.query(faQuery, [asset_id]);
                    return h.response({ message: 'FA pick revoked successfully', result }).code(200);
                }
    
                throw Boom.badRequest(`Invalid asset type: ${type}`);
            }

            if (action === 'restore') {
                
                if (type === 'draft-pick') {
                    const draftPickQuery = `
                    UPDATE draft_picks
                    SET player_taken = NULL
                    WHERE asset_id = ?
                    `;
    
                    result = await db.query(draftPickQuery, [asset_id]);
                    return h.response({ message: 'Draft pick restored successfully', result }).code(200);
                }
    
                if (type === 'fa') {
                    const faQuery = `
                    UPDATE fa_picks
                    SET player_taken = NULL
                    WHERE asset_id = ?
                    `;
    
                    result = await db.query(faQuery, [asset_id]);
                    return h.response({ message: 'FA pick restored successfully', result }).code(200);
                }
    
                throw Boom.badRequest(`Invalid asset type: ${type}`);
            }
            
        } catch (error) {
            console.error('Error handling edit asset request:', error);
            if (Boom.isBoom(error)) {
                return error;
            }
            return Boom.internal('An unexpected error occurred');
        }
    },
};