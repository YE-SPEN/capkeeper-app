import { Component, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { TeamService } from '../../services/team.service';
import { SortingService } from '../../services/sorting.service';
import { HttpClient } from '@angular/common/http';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Team, League, Player } from '../../types';

@Component({
  selector: 'app-team-roster',
  templateUrl: './team-roster.component.html',
  styleUrl: './team-roster.component.css'
})
export class TeamRosterComponent {
  modalRef!: BsModalRef;
  league_id!: string;
  team_id!: string;
  team!: Team;
  selected!: Player;
  currentSeason: string = '2023-24'; 
  sortColumn: string | null = 'points';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(
    private teamService: TeamService,
    public globalService: GlobalService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
        this.league_id = params.get('league_id')!;
        this.team_id = params.get('team_id')!;

        this.teamService.getRosterByTeam(this.league_id, this.team_id)
          .subscribe(response => {
            this.team = response.team;
            this.team.rookie_bank = response.roster.filter(player => player.isRookie);
            this.team.forwards = response.roster.filter(player => player.position === 'F' && !player.isRookie);
            this.team.defense = response.roster.filter(player => player.position === 'D' && !player.isRookie);
            this.team.goalies = response.roster.filter(player => player.position === 'G' && !player.isRookie);
            
            this.team.roster_size = this.team.forwards.length + this.team.defense.length + this.team.goalies.length;

            this.team.forward_salary = this.getTotalSalary(this.team.forwards);
            this.team.defense_salary = this.getTotalSalary(this.team.defense);
            this.team.goalie_salary = this.getTotalSalary(this.team.goalies);

            this.team.total_cap = this.team.forward_salary + this.team.defense_salary + this.team.goalie_salary;
            if (this.globalService.league?.salary_cap) {
              this.team.cap_space = this.globalService.league?.salary_cap - this.team.total_cap;
            }
        });
      });
  }

  getManagers(): string {
    return '';
  }

  getMaxContractLength(array: Player[]): number {
    let max = 0;
    for (let player of array) {
      let sum  = player.years_left_current + player.years_left_next;
      if (sum > max) { max = sum }; 
    }
    return max;
  }

  getContractSeasons(array: Player[]): string[] {
    const maxContractLength = this.getMaxContractLength(array) + 1;
    let seasons: string[] = [];
    let next = this.currentSeason;
  
    for (let i = 0; i < maxContractLength; i++) {
      seasons.push(next);
      next = this.incrementSeason(next);
    }
    return seasons;
  }

  incrementSeason(season: string): string {
      const [startYear, endYear] = season.split('-').map(year => parseInt(year));
      const nextStartYear = startYear + 1;
      const nextEndYear = endYear + 1;
      const nextEndYearFormatted = nextEndYear.toString().slice(-2);
      return `${nextStartYear}-${nextEndYearFormatted}`; 
  }

  generateRange(count: number): number[] {
    return Array(count).fill(0).map((_, index) => index + 1);
  }

  getTotalSalary(array: Player[]): number {
    let sum = 0;
    for (let player of array) {
      sum += player.aav_current;
    }
    return sum;
  }

  dropPlayer(player: Player): void {
    const payload = {
      player_id: player.player_id,
      league_id: this.league_id,
      action: 'drop',
      last_updated: this.globalService.getDate(),
      updated_by: this.globalService.loggedInUser?.first_name + ' ' + this.globalService.loggedInUser?.last_name
    }

    this.http.post('api/players/add-drop', payload)
    .subscribe({
      next: (response) => {
        console.log('Action recorded successfully:', response);
        if (this.globalService.loggedInTeam && this.globalService.loggedInUser) {
          this.globalService.updateTeamCap(this.globalService.loggedInTeam); 

          let message = player.first_name + ' ' + player.last_name + ' dropped to waivers by ' + this.globalService.loggedInTeam.team_name;
          let action = 'drop-player';
          this.globalService.recordAction(this.league_id, this.globalService.loggedInUser?.user_name, action, message);

          this.ngOnInit();
        }
      },
      error: (error) => {
        console.error('Error recording action:', error);
      }
    });

  }

  openModal(template: TemplateRef<any>, player?: Player): void {
    if (player) {
      this.selected = player;
    }
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
  }


}
