import { Component } from '@angular/core';
import { TeamService } from './services/team.service';
import { Team, League } from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  title = 'capkeeper-app';
  userMenuIsOpen: boolean = false;
  teamsMenuIsOpen: boolean = false;
  league: League | null = null;
  teams: Team[] = [];

  constructor(
    private teamService: TeamService,
  ) { }

  ngOnInit(): void {
    this.teamService.getTeamsByLeague('100')
      .subscribe(response => {
        this.teams = response.teams;
        this.league = response.league;
        console.log('Called get TeamsMethod')
        console.log(this.teams)
        console.log(this.league)
      })
  }

  toggleUserMenu(): void {
    this.userMenuIsOpen = !this.userMenuIsOpen;
  }

  toggleTeamsMenu(): void {
    this.teamsMenuIsOpen = !this.teamsMenuIsOpen;
  }
}
