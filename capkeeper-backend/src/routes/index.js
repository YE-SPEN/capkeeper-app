import { teamRosterRoute } from "./team-roster.js";
import { leagueRoute } from "./league.js";
import { playerDatabaseRoute } from "./player-db.js";
import { createPlayerRoute } from "./create-player.js";
import { recordActionRoute } from "./record-action.js";
import { recentActivityRoute } from "./recent-activity.js";
import { loginRoute } from "./login.js";
import { addDropRoute } from "./add-drop.js";
import { uploadFileRoute } from "./upload-file.js";
import { rosterMoveRoute } from "./roster-move.js";
import { editContractRoute } from "./edit-contract.js";
import { recordSessionRoute } from "./record-session.js";

export default [
    leagueRoute,
    teamRosterRoute,
    playerDatabaseRoute,
    createPlayerRoute,
    recordActionRoute,
    recentActivityRoute,
    loginRoute,
    addDropRoute, 
    uploadFileRoute,
    rosterMoveRoute,
    editContractRoute,
    recordSessionRoute
]