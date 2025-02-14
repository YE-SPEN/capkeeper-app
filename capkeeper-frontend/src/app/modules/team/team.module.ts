import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';

import { TeamRosterComponent } from './components/team-roster/team-roster.component';
import { TradeProposalComponent } from './components/trade-proposal/trade-proposal.component';
import { TradeReviewComponent } from './components/trade-review/trade-review.component';
import { TradeAssetPipe } from './pipes/trade-assets.pipe';

const routes: Routes = [
  { path: ':team_id', component: TeamRosterComponent },
  { path: 'trade', component: TradeProposalComponent },
  { path: 'trade/:trade_id', component: TradeReviewComponent },
];

@NgModule({
  declarations: [
    TeamRosterComponent,
    TradeProposalComponent,
    TradeReviewComponent,
    TradeAssetPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ModalModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    TeamRosterComponent,
    TradeProposalComponent,
    TradeReviewComponent,
    TradeAssetPipe
  ]
})
export class TeamModule { }