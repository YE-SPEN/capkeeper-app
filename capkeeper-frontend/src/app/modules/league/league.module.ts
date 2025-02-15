import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';

import { DraftComponent } from './components/draft/draft.component';
import { LeagueActivityComponent } from './components/league-activity/league-activity.component';
import { PlayerDatabaseComponent } from './components/player-database/player-database.component';

const routes: Routes = [
  { path: 'draft', component: DraftComponent },
  { path: 'activity-log', component: LeagueActivityComponent },
  { path: 'players', component: PlayerDatabaseComponent },
];

@NgModule({
  declarations: [
    DraftComponent,
    LeagueActivityComponent,
    PlayerDatabaseComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ModalModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    DraftComponent,
    LeagueActivityComponent,
    PlayerDatabaseComponent,
  ]
})
export class LeagueModule { }