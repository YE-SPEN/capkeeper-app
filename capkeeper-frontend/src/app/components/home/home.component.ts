import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { Team, Activity } from '../../types';

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

  constructor(
    public globalService: GlobalService,
  ) { }

  ngOnInit(): void {
      if (this.globalService.league) {
        this.globalService.getLeagueHomeData(this.globalService.league?.league_id)
          .subscribe(response => {
            this.recent_activity = response.recentActivity;
            console.log(this.recent_activity)
          });
      }

      this.allTeams = this.globalService.teams;
      for (let team of this.allTeams) {
        this.globalService.initializeTeam(team)
        .subscribe(response => {
          let temp = response.teamInfo[0];
          if (temp) {
            team.roster_size = temp.roster_size;
            team.total_cap = Number(temp.total_cap) + Number(temp.salary_retained);
            team.ir_count = temp.ir_count;
            team.rookie_count = temp.rookie_count;
            
            if (this.globalService.league?.salary_cap) {
              team.cap_space = this.globalService.league.salary_cap - team.total_cap;
            }
          }
        });
      }

    }

    setDisplay(display: 'points' | 'cap'): void {
      this.displaying = display;
    }
}

