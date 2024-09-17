import { Component, OnInit } from '@angular/core';
import { TeamService } from './services/team.service';
import { GlobalService } from './services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'capkeeper-app';

  constructor(
    private teamService: TeamService,
    public globalService: GlobalService
  ) { }

  ngOnInit(): void {
    this.teamService.getTeamsByLeague('100')
      .subscribe(response => {
        this.globalService.teams = response.teams;
        this.globalService.league = response.league;
        this.globalService.nhl_teams = response.nhl_teams;
        console.log(this.globalService.teams);
        console.log(this.globalService.league);
      });
  }

}
