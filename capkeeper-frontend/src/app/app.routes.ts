import { Routes } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoginComponent } from './components/login/login.component';
import { TeamRosterComponent } from './components/team-roster/team-roster.component';

export const routes: Routes = [
    { path: '**', redirectTo: 'login' },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: ':league_id', component: SidebarComponent, pathMatch: 'full' },
    { path: ':league_id/teams/:team_id', component: TeamRosterComponent },

];
