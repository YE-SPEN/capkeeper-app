import { Component, TemplateRef } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { PlayerService } from '../../services/player.service';
import { CommissionerService } from '../../services/commissioner.service';
import { SortingService } from '../../services/sorting.service';
import { UploadService } from '../../services/upload.service';
import { ToastService } from '../../services/toast-service.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Team, Player, FA_Pick, Season, User, League, Draft_Pick } from '../../types';

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
  allDraftPicks: Draft_Pick[] = [];
  allPlayers: Player[] = [];
  draftOrder: Team[] = [];
  searchKey: string = '';
  searchResults: Player[] = [];
  filteredDraftPicks: Draft_Pick[] = [];
  selected!: Draft_Pick | FA_Pick;
  inEditMode: boolean = false;
  displaying: 'teams' | 'users' | 'draft' | 'fa' = 'teams';
  toastMessage: string = '';
  yearFilter: string = 'any';
  pickTypeFilter: 'any' | 'general' | 'rookie' = 'any';
  leagueSettings!: League;
  leagueDetails = {
    league_name: '',
    picture: '',
  };
  seasonToEdit = {
    year: '',
    type: '',
  };
  assetToEdit = {
    asset_id: 0,
    player_taken: '',
    owned_by: '',
    player_name: '',
  };

  constructor(
    public globalService: GlobalService,
    private playerService: PlayerService,
    private commisisonerService: CommissionerService,
    public sortingService: SortingService,
    private toastService: ToastService,
    public uploadService: UploadService,
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
      this.commisisonerService.loadCommissionerHub(this.league_id)
        .subscribe(response => {
          this.allUsers = response.users;
          this.leagueSettings = response.league[0];
          this.allDraftPicks = response.draft_picks;
          this.filteredDraftPicks = this.allDraftPicks;
        });
      
      this.globalService.getLeagueHomeData(this.globalService.league?.league_id)
      .subscribe(response => {
        this.allTeams = response.teams;
        this.allTeamSeasons = response.teamPoints;
        this.draftOrder = new Array(this.allTeams.length).fill(null);

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

  async fetchPlayers(): Promise<void> {
    this.playerService.getAllPlayers(this.league_id)
      .subscribe(response => {
        this.allPlayers = response.players;
    });
  }

  setDisplay(display: 'users' | 'teams' | 'draft' | 'fa'): void {
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

  getTeamPicture(team_id: string): string | null {
    if (!this.allTeams || this.allTeams.length === 0) {
      return null;
    }
  
    const team = this.allTeams.find(team => team.team_id === team_id);
    if (team) {
      return team.picture || null; 
    } else {
      return null; 
    }
  }

  getDraftYears(): number[] {
    const yearSet = new Set<number>();
    
    this.allDraftPicks.forEach(pick => {
        if (pick.year) {
            yearSet.add(pick.year);
        }
    });

    return Array.from(yearSet).sort((a, b) => a - b);
  }

  getNextThreeDraftYears(): number[] {
    const draftYears = this.getDraftYears();
    const maxYear = Math.max(...draftYears);
  
    return [maxYear, maxYear + 1, maxYear + 2, maxYear + 3];
  }  
   
  filterDraftPicks(): void {
    this.filteredDraftPicks = this.allDraftPicks
      .filter(pick => 
              this.inYearFilter(pick) 
              && this.inPickTypeFilter(pick) 
            );
    this.sortingService.sort(this.filteredDraftPicks, this.sortingService.sortColumn, this.sortingService.sortDirection);
  }

  inYearFilter(pick: Draft_Pick | FA_Pick): boolean {
    return pick.year === Number(this.yearFilter) || this.yearFilter === 'any';
  }
  
  inPickTypeFilter(pick: Draft_Pick): boolean {
    return pick.type === this.pickTypeFilter || this.pickTypeFilter === 'any';
  }

  clearFilters(): void {
    this.yearFilter = 'any';
    this.pickTypeFilter = 'any';
    this.filterDraftPicks();
  }

  toggleAdminRights(user: User): void {
    const payload = {
      user_name: user.user_name,
      league_id: this.league_id,
    }
    console.log('Payload: ', payload)
    this.http.post('api/toggle-admin', payload)
    .subscribe({
      next: (response) => {
        console.log('Done')
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error recording action:', error);
      }
    });
  }

  saveSettings(): void {
    const payload = {
      action: 'settings',
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

  saveLeagueDetails(event: Event): void {
    const payload = {
      action: 'details',
      league_name: this.leagueDetails.league_name ? this.leagueDetails.league_name : this.globalService.league?.league_name,
      picture: this.leagueDetails.picture ? this.leagueDetails.picture : this.globalService.league?.picture,
    };
    
    this.http.post(`/api/${this.league_id}/edit-league`, payload)
    .subscribe({
      next: (response) => {
        if (this.globalService.league && this.leagueDetails.league_name !== this.globalService.league.league_name) {
          this.globalService.league.league_name = this.leagueDetails.league_name;
        }
        if (this.globalService.league && this.leagueDetails.picture !== this.globalService.league.picture) {
          this.globalService.league.picture = this.leagueDetails.picture;
        }
        this.toastService.showToast('League details saved.', true);
      },
      error: (error) => {
        console.error('Error submitting form', error, payload);
      }
    });
      
    this.ngOnInit();
    
  }

  async saveLeaguePicture(event: Event): Promise<void> {
    const url = await this.uploadService.uploadFile(event);
    this.leagueDetails.picture = url;
  }

  searchPlayers(): void {
    console.log('Search key: ', this.searchKey)
    this.searchResults = this.allPlayers.filter(player =>
      player.first_name.toLowerCase().includes(this.searchKey.toLowerCase()) || player.last_name.toLowerCase().includes(this.searchKey.toLowerCase())
    );
  }

  setPlayerTaken(player: Player): void {
    this.assetToEdit.player_taken = player.player_id;
    this.assetToEdit.player_name = player.first_name + ' ' + player.last_name;
    this.searchKey = '';
  }

  editAsset(type: string): void {
    const payload = {
      type: type,
      asset_id: this.selected.asset_id,
      owned_by: this.assetToEdit.owned_by ? this.assetToEdit.owned_by : this.selected.owned_by,
      player_taken: this.assetToEdit.player_taken ? this.assetToEdit.player_taken : this.selected.player_taken,
    };
    
    this.http.post(`/api/edit-asset`, payload)
    .subscribe({
      next: (response) => {
        let message = 'Saved Changes to Asset #' + payload.asset_id;
        this.toastService.showToast(message, true);
      },
      error: (error) => {
        console.error('Error submitting form', error, payload);
      }
    });
    this.closeModal();
    this.ngOnInit();
  }

  generateDraftPicks(): void {
    const draftLength = this.seasonToEdit.type === 'general' ? this.leagueSettings.general_draft_length : this.leagueSettings.rookie_draft_length;
    const payload: { year: any; type: any; round: number, assigned_to: string; league_id: string }[] = [];
  
    for (let round = 1; round <= draftLength; round++) {
      this.allTeams.forEach(team => {
        payload.push({
          year: this.seasonToEdit.year,
          type: this.seasonToEdit.type,
          round: round,
          assigned_to: team.team_id,
          league_id: team.league_id,
        });
      });
    }

    console.log('Generated Picks:', payload)
  
    this.http.post('/api/generate-draft-picks', payload)
      .subscribe({
        next: response => {
          console.log('Draft picks generated successfully:', response);
          this.toastService.showToast('Draft picks generated successfully!', true);
        },
        error: err => {
          console.error('Error generating draft picks:', err);
        }
      });
    
    this.ngOnInit;
  }

  openModal(template: TemplateRef<any>, pick?: Draft_Pick | FA_Pick): void {
    if (pick) {
      this.selected = pick;
      this.assetToEdit.asset_id = this.selected.asset_id;
      this.assetToEdit.owned_by = this.selected.owned_by;
      if (this.selected.player_taken) {
        this.assetToEdit.player_name = this.selected.player_taken;
      }
      if (this.allPlayers.length === 0) {
        this.fetchPlayers();
      }
    }
    this.modalRef = this.modalService.show(template);
  }

  clearForms(): void {
    this.searchKey = '';

    this.leagueDetails = {
      league_name: '',
      picture: '',
    };
    
    this.seasonToEdit = {
      year: '',
      type: '',
    };
    
    this.assetToEdit = {
      asset_id: 0,
      player_taken: '',
      owned_by: '',
      player_name: '',
    };
  }

  closeModal() {
    this.modalRef.hide();
    this.clearForms();
    this.ngOnInit;
  }

  logDraftOrder(): void {
    console.log(this.draftOrder)
  }

}
