import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';

import { TeamRosterComponent } from './components/team-roster/team-roster.component';

const routes: Routes = [
  { path: ':team_id', component: TeamRosterComponent },
];

@NgModule({
  declarations: [
    TeamRosterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ModalModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    TeamRosterComponent
  ]
})
export class TeamModule { }