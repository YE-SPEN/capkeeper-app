import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TeamService } from '../../services/team.service';
import { Team, League } from '../../types';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ]
})

export class SidebarComponent {
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