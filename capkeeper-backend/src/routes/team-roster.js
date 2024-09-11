import Boom from '@hapi/boom';
import { db } from '../database.js';

export const teamRosterRoute = {
    method: 'GET',
    path: '/api/{league_id}/teams/{team_id}',
    handler: async (req, h) => {
        const team_id = req.params.team_id;
        const league_id = req.params.league_id;

        try {
            const { results: roster} = await db.query( 
                `SELECT p.*, pob.isRookie, nl.logo 
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
                `SELECT * FROM teams
                WHERE league_id = ?
                AND team_id = ?`,
                [league_id, team_id]
            );

            const team = teamInfo[0];

            return { roster, team };

        } catch (err) {
            console.error(err);
            throw Boom.internal('Internal Server Error');
        }
    }
};