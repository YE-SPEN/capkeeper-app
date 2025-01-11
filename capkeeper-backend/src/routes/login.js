import Boom from '@hapi/boom';
import { db } from '../database.js';

export const loginRoute = {
    method: 'GET',
    path: '/api/login',
    handler: async (req, h) => {
        const email = req.query.email;
        const league = req.query.league;
        const team = req.query.team;

        try {
            const { results: userInfo } = await db.query( 
                `SELECT 
                    u.*, 
                    tmb.league_id, 
                    tmb.team_id AS team_managed,
                    tmb.isAdmin,
                    (SELECT COUNT(*)
                    FROM recent_activity ra
                    WHERE TIMESTAMP(ra.DATE, ra.TIME) >= TIMESTAMP(u.log_out_date, u.log_out_time)) AS notification_count
                FROM 
                    users u 
                JOIN 
                    team_managed_by tmb ON u.user_name = tmb.user_name
                WHERE 
                    u.email = ?`,
                 [email]
            );

            const { results: teamInfo } = await db.query( 
                `SELECT 
                    COUNT(CASE WHEN pob.onIR = 0 AND pob.isRookie = 0 THEN 1 END) AS roster_size,
                    ROUND(SUM(CASE 
                            WHEN pob.onIR = 0 AND pob.isRookie = 0 AND pob.retention_perc IS NOT NULL 
                                THEN aav_current * (1 - (pob.retention_perc / 100))
                            WHEN pob.onIR = 0 AND pob.isRookie = 0 
                                THEN aav_current
                            ELSE 0 
                        END)) AS total_cap,
                    t.salary_retained,
                    COUNT(CASE WHEN pob.onIR = 1 THEN 1 END) AS ir_count,
                    COUNT(CASE WHEN pob.isRookie = 1 THEN 1 END) AS rookie_count
                FROM 
                    player_owned_by pob 
                JOIN 
                    players p ON pob.player_id = p.player_id
                JOIN 
                    teams t ON t.team_id = pob.team_id
                WHERE 
                    pob.league_id = ?
                    AND pob.team_id = ?
                GROUP BY 
                    pob.team_id, t.salary_retained;`,
                 [league, team]
            );

            const { results: inbox } = await db.query(
                `SELECT * FROM trades
                WHERE sent_to = ?
                AND status = 'Pending'`,
                [team]
            )

            return { userInfo, teamInfo, inbox };

        } catch (err) {
            console.error(err);
            throw Boom.internal('Internal Server Error');
        }
    }
};