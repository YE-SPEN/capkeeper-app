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
import { editTeamRoute } from "./edit-team-info.js";
import { editUserRoute } from "./edit-user-info.js";
import { sendTradeRoute } from "./trade-sent.js";
import { tradeReviewRoute } from "./trade-review.js";
import { confirmTradeRoute } from "./trade-response.js";
import { leagueHomeRoute } from "./home.js";
import { draftHistoryRoute } from "./draft-history.js";
import { submitProtectionsRoute } from "./submit-protection-sheet.js";
import { loadProtectionsRoute } from "./load-protection-sheet.js";

export default [
    leagueRoute,
    leagueHomeRoute,
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
    recordSessionRoute,
    editTeamRoute,
    editUserRoute,
    sendTradeRoute,
    tradeReviewRoute,
    confirmTradeRoute,
    draftHistoryRoute,
    submitProtectionsRoute,
    loadProtectionsRoute
]