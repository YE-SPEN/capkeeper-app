import Boom from '@hapi/boom';
import { db } from '../database.js';

export const tradeReviewRoute = {
    method: 'GET',
    path: '/api/{league_id}/trade/{trade_id}',
    handler: async (req, h) => {
        const trade_id = req.params.trade_id;

        try {
            const { results: tradeInfo } = await db.query( 
                `SELECT *
                FROM trades 
                WHERE trade_id = ?`,
                 [trade_id]
            );

            const trade = tradeInfo[0];

            const { results: tradeItems } = await db.query( 
                `SELECT 
                    ti.*, 
                    p.first_name, 
                    p.last_name, 
                    p.aav_current, 
                    p.years_left_current,
                    p.position,
                    p.short_code,
                    pob.isRookie, 
                    pob.onIR, 
                    nl.logo,
                    CASE 
                        WHEN ti.asset_type = 'draft_pick' THEN d.year
                        WHEN ti.asset_type = 'fa' THEN fa.year
                        ELSE NULL
                    END AS year,
                    CASE 
                        WHEN ti.asset_type = 'draft_pick' THEN dp.assigned_to
                        WHEN ti.asset_type = 'fa' THEN fa.assigned_to
                        ELSE NULL
                    END AS assigned_to,
                    CASE 
                        WHEN ti.asset_type = 'draft_pick' THEN dp.owned_by
                        WHEN ti.asset_type = 'fa' THEN fa.owned_by
                        ELSE NULL
                    END AS owned_by,
                    dp.round, 
                    dp.pick_number, 
                    d.type, 
                    fa.week
                FROM trade_items ti
                    LEFT JOIN players p ON ti.asset_type = 'player' AND ti.player_id = p.player_id
                    LEFT JOIN player_owned_by pob ON p.player_id = pob.player_id
                    LEFT JOIN nhl_logos nl ON p.short_code = nl.short_code 
                    LEFT JOIN draft_picks dp ON ti.asset_type = 'draft_pick' AND ti.draft_pick_id = dp.asset_id
                    LEFT JOIN drafts d ON dp.draft_id = d.draft_id
                    LEFT JOIN fa_picks fa ON ti.asset_type = 'fa' AND ti.fa_id = fa.asset_id
                WHERE ti.trade_id = ?
                `,
                 [trade_id]
            );

            const { results: tradeConditions } = await db.query( 
                `SELECT description
                FROM trade_conditions
                WHERE trade_id = ?`,
                 [trade_id]
            );

            return { trade, tradeItems, tradeConditions };

        } catch (err) {
            console.error(err);
            throw Boom.internal('Internal Server Error');
        }
    }
};