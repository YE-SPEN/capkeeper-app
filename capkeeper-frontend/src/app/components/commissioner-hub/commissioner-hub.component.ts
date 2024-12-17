import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { CommissionerService } from '../../services/commissioner.service';
import { SortingService } from '../../services/sorting.service';
import { ToastService } from '../../services/toast-service.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Team, Activity, FA_Pick, Season, User, League } from '../../types';

@Component({
  selector: 'app-commissioner-hub',
  templateUrl: './commissioner-hub.component.html',
  styleUrl: './commissioner-hub.component.css'
})
export class CommissionerHubComponent {
  modalRef!: BsModalRef;
  league_id!: string;
  allUsers: User[] = [];
  allTeams: Team[] = [];
  allTeamSeasons!: Season[];
  inEditMode: boolean = false;
  displaying: 'teams' | 'users' = 'teams';
  toastMessage: string = '';
  leagueSettings!: League;


  constructor(
    public globalService: GlobalService,
    private commisisonerService: CommissionerService,
    public sortingService: SortingService,
    public toastService: ToastService,
    private modalService: BsModalService,
    private router: Router,
    protected route: ActivatedRoute,
    private http: HttpClient
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
      this.commisisonerService.getAllUsers(this.league_id)
        .subscribe(response => {
          this.allUsers = response.users;
        });

      this.commisisonerService.getLeagueSettings(this.league_id)
      .subscribe(response => {
        this.leagueSettings = response.league[0];
        console.log(this.leagueSettings)
      });
      
      this.globalService.getLeagueHomeData(this.globalService.league?.league_id)
      .subscribe(response => {
        this.allTeams = response.teams;
        this.allTeamSeasons = response.teamPoints;

        for (let team of this.allTeams) {
          this.globalService.initializeTeam(team)
          .subscribe(response => {
            let temp = response.teamInfo[0];
            if (temp) {
              team.roster_size = temp.roster_size;
              team.total_cap = Number(temp.total_cap) + Number(temp.salary_retained);
              team.rookie_count = temp.rookie_count;
              team.managers = this.getManagers(team);
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

  setDisplay(display: 'users' | 'teams'): void {
    this.displaying = display;
  }

  toggleEditMode(): void {
    this.inEditMode = !this.inEditMode;
  }

  getManagers(team: Team): User[] {
    let managers = [];
    for (let user of this.allUsers) {
      if (user.team_managed === team.team_name) {
        managers.push(user);
      }
    }

    return managers;
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

  saveSettings(): void {
    const payload = {
      max_roster_size: this.leagueSettings.max_roster_size,
      min_forwards: this.leagueSettings.min_forwards,
      min_defense: this.leagueSettings.min_defense,
      min_goalies: this.leagueSettings.min_goalies,
      ir_slots: this.leagueSettings.ir_slots,
      rookie_bank_size: this.leagueSettings.rookie_bank_size,
      salary_cap: this.leagueSettings.salary_cap,
      general_draft_length: this.leagueSettings.general_draft_length,
      rookie_draft_length: this.leagueSettings.rookie_draft_length,
      retention_slots: this.leagueSettings.retention_slots,
      max_retention_perc: this.leagueSettings.max_retention_perc,
    };
    
    this.http.post(`/api/${this.league_id}/edit-league`, payload)
    .subscribe({
      next: (response) => {
        this.globalService.league = this.leagueSettings;
        this.toastService.showToast('League settings saved.', true);
      },
      error: (error) => {
        console.error('Error submitting form', error, payload);
      }
    });
      
    this.ngOnInit();
  }

}
