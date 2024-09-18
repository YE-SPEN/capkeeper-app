import { teamRosterRoute } from "./team-roster.js";
import { leagueRoute } from "./league.js";
import { playerDatabaseRoute } from "./player-db.js";
import { createPlayerRoute } from "./create-player.js";
import { recordActionRoute } from "./record-action.js";
import { recentActivityRoute } from "./recent-activity.js";

export default [
    leagueRoute,
    teamRosterRoute,
    playerDatabaseRoute,
    createPlayerRoute,
    recordActionRoute,
    recentActivityRoute
]