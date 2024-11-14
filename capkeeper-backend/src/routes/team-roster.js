import Boom from '@hapi/boom';
import { db } from '../database.js';

export const teamRosterRoute = {
    method: 'GET',
    path: '/api/{league_id}/teams/{team_id}',
    handler: async (req, h) => {
        const team_id = req.params.team_id;
        const league_id = req.params.league_id;

        try {
            const { results: roster } = await db.query( 
                `SELECT p.*, pob.isRookie, pob.onIR, pob.onTradeBlock, pob.retention_perc, nl.logo 
                FROM nhl_logos nl
                    JOIN players p ON
                        p.short_code = nl.short_code 
                    JOIN player_owned_by pob ON
                        p.player_id = pob.player_id
                    JOIN teams t ON
                        pob.team_id = t.team_id
                    JOIN leagues l ON
                        t.league_id = l.league_id
                WHERE
                    l.league_id = ? AND
                    t.team_id = ?`,
                 [league_id, team_id]
            );

            const { results: teamInfo } = await db.query( 
                `SELECT t.team_id, t.team_name, t.picture, t.league_id, t.salary_retained, CONCAT(p.first_name, ' ', p.last_name) AS player_retained, GROUP_CONCAT(CONCAT(u.first_name, ' ', u.last_name) SEPARATOR ', ') AS managed_by
                FROM teams t JOIN team_managed_by tmb
                    ON t.team_id = tmb.team_id
                    JOIN users u ON
                    tmb.user_name = u.user_name
                    LEFT JOIN players p ON p.player_id = t.player_retained
                WHERE t.league_id = ?
                    AND t.team_id = ?`,
                [league_id, team_id]
            );

            const team = teamInfo[0];

            const { results: draft_picks } = await db.query(
                `SELECT * FROM draft_picks
                WHERE league_id = ?
                    AND owned_by = ?
                    AND player_taken IS NULL
                `,
                [league_id, team_id]
            )

            const { results: fa_picks } = await db.query(
                `SELECT fa.asset_id, fa.league_id, fa.assigned_to, fa.owned_by, fa.week, fa.year, fa.expiry_date, CONCAT(p.first_name, ' ', p.last_name) AS player_taken
                FROM fa_picks fa LEFT JOIN players p
                    ON fa.player_taken = p.player_id
                WHERE league_id = ?
                    AND (fa.assigned_to = ? OR fa.owned_by = ?)
                ORDER BY week
                `,
                [league_id, team_id, team_id]
            )

            const { results: trades } = await db.query(
                `SELECT * FROM trades
                WHERE sent_to = ?
                AND status = 'Pending'`,
                [team_id]
            )

            return { roster, team, draft_picks, fa_picks, trades };

        } catch (err) {
            console.error(err);
            throw Boom.internal('Internal Server Error');
        }
    }
};