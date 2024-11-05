import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { Team, Activity, FA_Pick } from '../../types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  league_id!: string;
  allTeams: Team[] = [];
  recent_activity: Activity[] = [];
  displaying: 'points' | 'cap' = 'cap';
  allFAs: FA_Pick[] = [] 
  maxFAWeek!: number;

  constructor(
    public globalService: GlobalService,
  ) { }

  ngOnInit(): void {
    if (this.globalService.league) {
      this.globalService.getLeagueHomeData(this.globalService.league?.league_id)
        .subscribe(response => {
          this.recent_activity = response.recentActivity;
          this.allFAs = response.faPicks;
          this.allTeams = this.globalService.teams;
          this.maxFAWeek = this.allFAs.length / this.allTeams.length;

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
                console.log(team.team_name + ':', team.fa_picks)
                
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
      return matchedFA.player_taken;
    }
    return '-';
  }

  pickTraded(team: Team, week: number): boolean {
    const matchedTeam = this.allTeams.find(match => team.team_id === match.team_id);
    const matchedFA = matchedTeam?.fa_picks.find(pick => pick.week === week);
    if (matchedFA) {
      return matchedFA.assigned_to !== matchedFA.owned_by;
    }
    return false;
  }

  pickNotUsed(team: Team, week: number): boolean {
    const matchedTeam = this.allTeams.find(match => team.team_id === match.team_id);
    const matchedFA = matchedTeam?.fa_picks.find(pick => pick.week === week);
    if (matchedFA) {
      return this.globalService.faIsExpired(matchedFA) && !matchedFA.player_taken || matchedFA.player_taken === 'Penalty'; 
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

