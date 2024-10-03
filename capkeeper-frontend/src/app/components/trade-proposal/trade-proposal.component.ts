import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { TeamService } from '../../services/team.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Team, Player, Draft_Pick, FA_Pick } from '../../types';
type Asset = Player | Draft_Pick | FA_Pick | null;

@Component({
  selector: 'app-trade-proposal',
  templateUrl: './trade-proposal.component.html',
  styleUrl: './trade-proposal.component.css'
})

export class TradeProposalComponent {
  league_id!: string;
  requestor!: Team;
  requestor_contracts!: number;
  requestor_rookies!: number;
  requestor_salary!: number;
  recipient!: Team;
  recipient_contracts!: number;
  recipient_rookies!: number;
  recipient_salary!: number;
  assets_given: Asset[] = Array(6).fill(null);
  assets_given_types: string[] = Array(6).fill('');
  assets_received: Asset[] = Array(6).fill(null);
  assets_received_types: string[] = Array(6).fill('');
  dropdownOpenReq: boolean[] = Array(6).fill(false);
  dropdownOpenRec: boolean[] = Array(6).fill(false);  


  constructor(
    private teamService: TeamService,
    public globalService: GlobalService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.league_id = params.get('league_id')!;
      console.log(this.assets_given_types);

  
      if (this.globalService.loggedInTeam) {
        this.setRequestor(this.globalService.loggedInTeam.team_id);
      }
      
      this.route.queryParamMap.subscribe(queryParams => {
        const recipient_id = queryParams.get('team');
        if (recipient_id) {
          this.setRecipient(recipient_id);
        }
      });
    });
  }
    
  setRequestor(team_id: string): void {
      this.teamService.getRosterByTeam(this.league_id, team_id)
      .subscribe(response => {
        this.requestor = response.team;
        this.requestor.roster = response.roster;
        this.requestor.draft_picks = response.draft_picks;
        this.requestor.fa_picks = response.fa_picks.filter(pick => pick.owned_by === this.requestor.team_id && !pick.player_taken);

        this.requestor.roster_size = this.requestor.roster.length;
        this.requestor.total_cap = this.getTotalCap(this.requestor.roster);

        if (this.globalService.league) {
          this.requestor.cap_space = this.globalService.league.salary_cap - this.requestor.total_cap;
        }
        
    });
  }

  setRecipient(team_id: string): void {
      this.teamService.getRosterByTeam(this.league_id, team_id)
      .subscribe(response => {
        console.log('Rec Response: ', response)
        this.recipient = response.team;
        this.recipient.roster = response.roster;
        this.recipient.draft_picks = response.draft_picks;
        this.recipient.fa_picks = response.fa_picks.filter(pick => pick.owned_by === this.recipient.team_id && !pick.player_taken);

        this.recipient.roster_size = this.recipient.roster.length;
        this.recipient.total_cap = this.getTotalCap(this.recipient.roster);

        if (this.globalService.league) {
          this.recipient.cap_space = this.globalService.league.salary_cap - this.recipient.total_cap;
        }

    });
  }

  getTotalCap(roster: Player[]): number {
    let sum = 0
    for (let player of roster) {
      if (!player.isRookie && !player.onIR) {
        sum += player.aav_current;
      }
    }
    return sum;
  }

  countRookies(roster: Player[]): number {
    let count = 0;
    for (let player of roster) {
      if (player.isRookie) {
        ++count;
      }
    }
    return count;
  }

  toggleReqDropdown(index: number): void {
    this.dropdownOpenReq[index] = !this.dropdownOpenReq[index];
  }

  toggleRecDropdown(index: number): void {
    this.dropdownOpenRec[index] = !this.dropdownOpenRec[index];
  }

  closeReqDropdown(index: number): void {
    this.dropdownOpenReq[index] = false;
  }

  closeRecDropdown(index: number): void {
    this.dropdownOpenRec[index] = false;
  }

  selectAsset(array: Asset[], asset: Asset, index: number) {
    array[index] = asset;
    this.dropdownOpenReq[index] = false;
    console.log(this.assets_given)
  }

  removeAsset(array: Asset[], index: number): void {
    array[index] = null
  }

  clearAssets(team: string): void {
    if (team === 'requestor') {
      this.assets_given = Array(6).fill(null);
      this.assets_given_types = Array(6).fill('');
    }
    if (team === 'recipient') {
      this.assets_received = Array(6).fill(null);
      this.assets_received_types = Array(6).fill('');
    }
    return;
  }

  /*getAssetType(asset: Asset): string {
    if ('player_id' in asset) {
      return 'player';
    }
    if ('type' in asset) {
      if (asset.type = 'general') { return 'general'}
      if (asset.type = 'rookie') { return 'rookie'}
    }
    if ('week' in asset) {
      return 'fa'
    }
    return '';
  }*/

  getPicksByType(team: Team, type: string): Draft_Pick[] {
    let pickArray = team.draft_picks.filter(pick => pick.type === type);

    pickArray.sort((a, b) => {
        if (a.year !== b.year) {
            return a.year - b.year;
        }
        if (a.round !== b.round) {
            return a.round - b.round;
        }
        if (a.pick_number && b.pick_number) {
            return a.pick_number - b.pick_number;
        }
        return 0;
    });

    return pickArray;
  }

  capitalizeFirstLetter(value: string | undefined | null): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  getAdjustedContracts(team: Team): number {
    if (team === this.requestor) {

    }
    return 0;
  }

}
