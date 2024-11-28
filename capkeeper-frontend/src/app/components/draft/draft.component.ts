import { Component } from '@angular/core';

import { GlobalService } from '../../services/global.service';
import { PlayerService } from '../../services/player.service';
import { Team, Player, Draft_Pick } from '../../types';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-draft',
  templateUrl: './draft.component.html',
  styleUrl: './draft.component.css'
})

export class DraftComponent {
  league_id!: string;
  year: number = 2024;
  teams!: Team[];
  rookie_order: Team[] = [];
  rookie_picks!: Draft_Pick[];
  general_order: Team[] = [];
  general_picks!: Draft_Pick[];


  constructor(
    private playerService: PlayerService,
    public globalService: GlobalService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }
  
  async ngOnInit(): Promise<void> {
    const params = await firstValueFrom(this.route.paramMap);
    this.league_id = params.get('league_id')!;

    if (this.globalService.teams.length === 0) {
      try {
        await this.globalService.initializeLeague(this.league_id, this.router.url);
      } catch (error) {
        console.error('Error during league initialization:', error);
        return; 
      }
    }
  
    this.teams = this.globalService.teams;
  
    this.playerService.getDraftByYear(this.league_id, this.year).subscribe((response) => {
      this.rookie_picks = response.draft.filter((pick) => pick.type === 'rookie');
      this.general_picks = response.draft.filter((pick) => pick.type === 'general');

      const rookie_first_round = this.rookie_picks.filter((pick) => pick.round === 1);
      for (let pick of rookie_first_round) {
        const team = this.matchTeamByID(pick.assigned_to);
        if (team) {
          this.rookie_order.push(team);
        }
      }

      const general_first_round = this.general_picks.filter((pick) => pick.round === 1);
      for (let pick of general_first_round) {
        const team = this.matchTeamByID(pick.assigned_to);
        if (team) {
          this.general_order.push(team);
        }
      }
    });

  }
  
  

  matchTeamByID(team_id: string): Team | null {
    for (let team of this.teams) {
      if (team.team_id === team_id) {
        return team
      }
    }
    return null;
  }

  getPickInfo(team_id: string, round: number, draft: string): Draft_Pick | undefined {
    if (draft === 'rookie') {
      return this.rookie_picks.find(pick => pick.round === round && pick.assigned_to === team_id);
    }
    return this.general_picks.find(pick => pick.round === round && pick.assigned_to === team_id);
  }

  getTeamImage(pick: Draft_Pick): string {
      for (let team of this.teams) {
        if (team.team_id === pick.owned_by) {
          return team.picture
        }
      }
      return '';
  }

}
