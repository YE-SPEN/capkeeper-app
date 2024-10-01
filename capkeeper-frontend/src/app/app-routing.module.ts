import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TeamRosterComponent } from './components/team-roster/team-roster.component';
import { AppComponent } from './app.component';
import { PlayerDatabaseComponent } from './components/player-database/player-database.component';
import { LeagueActivityComponent } from './components/league-activity/league-activity.component';
import { RulesComponent } from './components/rules/rules.component';
import { HomeComponent } from './components/home/home.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: ':league_id/home', component: HomeComponent },
    { path: ':league_id', component: AppComponent, pathMatch: 'full' },
    { path: ':league_id/activity-log', component: LeagueActivityComponent },
    { path: ':league_id/teams/:team_id', component: TeamRosterComponent },
    { path: ':league_id/players', component: PlayerDatabaseComponent },
    { path: ':league_id/rules', component: RulesComponent },
    { path: 'user/:user_name', component: UserProfileComponent },

    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' },
  ];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
