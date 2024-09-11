import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TeamRosterComponent } from './components/team-roster/team-roster.component';
import { AppComponent } from './app.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: ':league_id', component: AppComponent, pathMatch: 'full' },
    { path: ':league_id/teams/:team_id', component: TeamRosterComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' },
  ];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
