import { Component } from '@angular/core';
import { TradeProposalComponent } from '../components/trade-proposal/trade-proposal.component';
import { TeamService } from '../services/team.service';
import { GlobalService } from '../services/global.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Trade } from '../types';

@Component({
  selector: 'app-trade-review',
  templateUrl: './trade-review.component.html',
  styleUrls: ['./trade-review.component.css']
})
export class TradeReviewComponent extends TradeProposalComponent {
  trade!: Trade;

  constructor(
    teamService: TeamService,
    globalService: GlobalService,
    modalService: BsModalService,
    route: ActivatedRoute,
    http: HttpClient
  ) {
    super(teamService, globalService, modalService, route, http);
  }

  override async ngOnInit(): Promise<void> {
    const params = await firstValueFrom(this.route.paramMap);
    this.league_id = params.get('league_id')!;
    let trade_id = params.get('trade_id')!;
  
    const response = await firstValueFrom(this.teamService.getTradeByID(this.league_id, trade_id));
    this.trade = response.trade;
    console.log(this.trade);
    console.log(response.tradeItems);
  
    await this.setRequestor(this.trade.requested_by);
    await this.setRecipient(this.trade.sent_to);
  
    this.assets_given = response.tradeItems.filter(asset => asset?.traded_to === this.recipient.team_id);
    this.assets_received = response.tradeItems.filter(asset => asset?.traded_to === this.requestor.team_id);
  }
  
  acceptTrade(): void {
    const payload = {
      league_id: this.league_id,
      trade_id: this.trade.trade_id,
      action: 'accept'
    };

    this.http.post('api/confirm-trade', payload)
    .subscribe({
      next: (response) => {
        console.log('Post Response: ', response);
          this.showToast('Trade confirmed!')
      },
      error: (error) => {
        console.error('Error recording action:', error);
      }
    });
  }

  rejectTrade(): void {
    const payload = {
      league_id: this.league_id,
      trade_id: this.trade.trade_id,
      action: 'reject'
    };

    this.http.post('api/confirm-trade', payload)
    .subscribe({
      next: (response) => {
        console.log('Post Response: ', response);
          this.showToast('Trade confirmed!')
      },
      error: (error) => {
        console.error('Error recording action:', error);
      }
    });
  }
}
