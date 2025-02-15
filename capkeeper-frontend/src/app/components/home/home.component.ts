import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { Team, Activity, FA_Pick, Season } from '../../types';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: false
})
export class HomeComponent {
  league_id!: string;
  allTeams: Team[] = [];
  recent_activity: Activity[] = [];
  displaying: 'points' | 'cap' = 'cap';
  allFAs: FA_Pick[] = [] 
  maxFAWeek!: number;
  rolling_seasons: string[] = ["2023-24", "2024-25", "2025-26"];
  allTeamSeasons!: Season[];

  constructor(
    public globalService: GlobalService,
    private router: Router,
    protected route: ActivatedRoute,
  ) { }

  async ngOnInit(): Promise<void> {
    const params = await firstValueFrom(this.route.paramMap);
    this.league_id = params.get('league_id')!;
  
    if (!this.globalService.league) {
      try {
        await this.globalService.initializeLeague(this.league_id, this.router.url);
      } catch (error) {
        console.error('Error during league initialization:', error);
      }
    }

    if (this.globalService.league) {
      this.globalService.getLeagueHomeData(this.globalService.league?.league_id)
        .subscribe(response => {
          this.recent_activity = response.recentActivity;
          this.allFAs = response.faPicks;
          this.allTeams = this.globalService.teams;
          this.maxFAWeek = this.allFAs.length / this.allTeams.length;
          this.allTeamSeasons = response.teamPoints;

          for (let team of this.allTeams) {
            this.globalService.initializeTeam(team)
            .subscribe(response => {
              let temp = response.teamInfo[0];
              if (temp) {
                team.roster_size = temp.roster_size;
                team.total_cap = Number(temp.total_cap) + Number(temp.salary_retained);
                team.ir_count = temp.ir_count;
                team.rookie_count = temp.rookie_count;
                team.fa_picks = this.allFAs.filter(fa => fa.assigned_to === team.team_id);
                team.total_points = this.getTotalPoints(team);
                
                if (this.globalService.league?.salary_cap) {
                  team.cap_space = this.globalService.league.salary_cap - team.total_cap;
                }
              }
            });
          }
        });
    }

  }

  setDisplay(display: 'points' | 'cap'): void {
    this.displaying = display;
  }

  getPlayerTaken(team: Team, week: number): string {
    const matchedTeam = this.allTeams.find(match => team.team_id === match.team_id);
    const matchedFA = matchedTeam?.fa_picks.find(pick => pick.week === week);
    if (matchedFA && matchedFA.player_taken) {
      if (matchedFA.player_taken === 'penalty') {
        return 'Penalty';
      }
      else {
        return matchedFA.player_taken;
      } 
    }
    return '-';
  }

  getTeamPointsBySeason(team: Team, seasonStr: string, isPlayoffs: boolean): number {
    for (let season of this.allTeamSeasons) {
      const playoffBool = Boolean(season.playoffs);
      if (season.team_id === team.team_id && season.season === seasonStr && playoffBool === isPlayoffs) {
        return season.points;
      }
    }
    return -1;
  }

  getTotalPoints(team: Team): number {
    let sum = 0;
    for (let season of this.allTeamSeasons) {
      if (season.team_id === team.team_id) {
        sum += season.points;
      }
    }
    return sum;
  }

  pickTraded(team: Team, week: number): boolean {
    if (!this.allTeams || !Array.isArray(this.allTeams)) {
        return false;
    }

    const matchedTeam = this.allTeams.find(match => team.team_id === match.team_id);
    if (!matchedTeam) {
        return false;
    }
    if (!Array.isArray(matchedTeam.fa_picks)) {
        return false;
    }

    const matchedFA = matchedTeam.fa_picks.find(pick => pick.week === week);
    if (matchedFA) {
        return matchedFA.assigned_to !== matchedFA.owned_by;
    }

    return false;
  }

  pickNotUsed(team: Team, week: number): boolean {
    const matchedTeam = this.allTeams.find(match => team.team_id === match.team_id);
    const matchedFA = matchedTeam?.fa_picks.find(pick => pick.week === week);
    if (matchedFA) {
      return this.globalService.faIsExpired(matchedFA) && !matchedFA.player_taken || matchedFA.player_taken === 'penalty'; 
    }
    return false;
  }

  getTeamPicture(team: Team, week: number): string {
    const assigned_to = this.allTeams.find(match => team.team_id === match.team_id);
    const fa_pick = assigned_to?.fa_picks.find(pick => pick.week === week);
    if (fa_pick) {
      const owned_by = this.allTeams.find(match => fa_pick.owned_by === match.team_id);
      if (owned_by) {
        return owned_by.picture;
      }
    }
    return '';
  }

}

