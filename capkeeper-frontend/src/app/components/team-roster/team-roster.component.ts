import { Component, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { TeamService } from '../../services/team.service';
import { SortingService } from '../../services/sorting.service';
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
  currentSeason: string = '2023-24'; 
  sortColumn: string | null = 'points';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(
    private teamService: TeamService,
    public globalService: GlobalService,
    private modalService: BsModalService,
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

  getMaxContractLength(array: Player[]): number {
    let max = 0;
    for (let player of array) {
      let sum  = player.years_left_current + player.years_left_next;
      if (sum > max) { max = sum }; 
    }
    return max;
  }

  getContractSeasons(array: Player[]): string[] {
    const maxContractLength = this.getMaxContractLength(array);
    let seasons: string[] = [];
    let next = this.currentSeason;
  
    for (let i = 0; i < maxContractLength; i++) {
      seasons.push(next);
      console.log('Before increment', next);
      next = this.incrementSeason(next);
      console.log('After increment', next);
      console.log('Array:', seasons);
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

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
  }


}
