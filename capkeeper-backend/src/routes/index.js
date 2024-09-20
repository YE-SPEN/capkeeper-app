import { teamRosterRoute } from "./team-roster.js";
import { leagueRoute } from "./league.js";
import { playerDatabaseRoute } from "./player-db.js";
import { createPlayerRoute } from "./create-player.js";
import { recordActionRoute } from "./record-action.js";
import { recentActivityRoute } from "./recent-activity.js";
import { loginRoute } from "./login.js";
import { addDropRoute } from "./add-drop.js";

export default [
    leagueRoute,
    teamRosterRoute,
    playerDatabaseRoute,
    createPlayerRoute,
    recordActionRoute,
    recentActivityRoute,
    loginRoute,
    addDropRoute
]