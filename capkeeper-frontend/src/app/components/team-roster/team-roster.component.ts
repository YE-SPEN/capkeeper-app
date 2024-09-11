import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamService } from '../../services/team.service';
import { Team, League, Player } from '../../types';

@Component({
  selector: 'app-team-roster',
  templateUrl: './team-roster.component.html',
  styleUrl: './team-roster.component.css'
})
export class TeamRosterComponent {
  league_id!: string;
  team_id!: string;
  team!: Team;

  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
        this.league_id = params.get('league_id')!;
        this.team_id = params.get('team_id')!;
        console.log(this.league_id, this.team_id)

        this.teamService.getRosterByTeam(this.league_id, this.team_id)
          .subscribe(response => {
            this.team = response.team;
            this.team.rookie_bank = response.roster.filter(player => player.isRookie);
            this.team.forwards = response.roster.filter(player => player.position === 'F' && !player.isRookie);
            this.team.defense = response.roster.filter(player => player.position === 'D' && !player.isRookie);
            this.team.goalies = response.roster.filter(player => player.position === 'G' && !player.isRookie);
            console.log(this.team);
        });
      });
  }
}
