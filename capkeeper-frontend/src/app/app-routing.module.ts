import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TeamRosterComponent } from './components/team-roster/team-roster.component';
import { AppComponent } from './app.component';
import { PlayerDatabaseComponent } from './components/player-database/player-database.component';
import { LeagueActivityComponent } from './components/league-activity/league-activity.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: ':league_id', component: AppComponent, pathMatch: 'full' },
    { path: ':league_id/activity-log', component: LeagueActivityComponent },
    { path: ':league_id/teams/:team_id', component: TeamRosterComponent },
    { path: ':league_id/players', component: PlayerDatabaseComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' },
  ];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }