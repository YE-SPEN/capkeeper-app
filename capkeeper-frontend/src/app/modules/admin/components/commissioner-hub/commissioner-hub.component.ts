import { Component, TemplateRef } from '@angular/core';
import { GlobalService } from '@app/services/global.service';
import { PlayerService } from '@app/services/player.service';
import { CommissionerService } from '@app/services/commissioner.service';
import { SortingService } from '@app/services/sorting.service';
import { UploadService } from '@app/services/upload.service';
import { ToastService } from '@app/services/toast-service.service';
import { PaginationService } from '@app/services/pagination.service';
import { TeamService } from '@app/services/team.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Team, Player, FA_Pick, Season, User, League, Draft_Pick, Draft, Pick_History } from '../../../../types';


@Component({
  selector: 'app-commissioner-hub',
  templateUrl: './commissioner-hub.component.html',
  styleUrl: './commissioner-hub.component.css',
  standalone: false
})

export class CommissionerHubComponent {
  modalRef!: BsModalRef;
  league_id!: string;
  allUsers: User[] = [];
  allTeams: Team[] = [];
  allTeamSeasons!: Season[];
  allDraftPicks: Draft_Pick[] = [];
  allFAs: FA_Pick[] = [];
  allPlayers: Player[] = [];
  allDrafts: Draft[] = [];
  nextDrafts: Draft[] = [];
  draftOrder: Team[] = [];
  searchKey: string = '';
  searchResults: Player[] = [];
  filteredDraftPicks: Draft_Pick[] = [];
  filteredFAPicks: FA_Pick[] = [];
  selected!: Draft_Pick | FA_Pick;
  assetToEdit!: Draft_Pick | FA_Pick;
  inEditMode: boolean = false;
  displaying: 'teams' | 'users' | 'draft' | 'fa' = 'teams';
  toastMessage: string = '';
  yearFilter: string = 'any';
  pickTypeFilter: 'any' | 'general' | 'rookie' = 'any';
  teamFilter: string = 'any';
  leagueSettings!: League;
  draftToEdit: Draft | null = null;
  leagueDetails = {
    league_name: '',
    picture: '',
  };
  fasToGenerate: {
    year: number;
    weeks: number;
    expiry_dates: (string | null)[];
  } = { year: 0, weeks: 0, expiry_dates: [] };

  constructor(
    public globalService: GlobalService,
    private playerService: PlayerService,
    private commisisonerService: CommissionerService,
    private teamService: TeamService,
    public sortingService: SortingService,
    private toastService: ToastService,
    public uploadService: UploadService,
    public paginationService: PaginationService,
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
          this.allDrafts = response.drafts;
          this.allDraftPicks = response.draft_picks;
          this.filteredDraftPicks = this.allDraftPicks;
          this.allFAs = response.fa_picks;
          this.filteredFAPicks = this.allFAs;
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
      try {
          const response = await firstValueFrom(this.playerService.getAllPlayers(this.league_id));
          this.allPlayers = response.players;
      } catch (error) {
          console.error('Failed to fetch players:', error);
      }
  }
  
  setDisplay(display: 'users' | 'teams' | 'draft' | 'fa'): void {
    this.displaying = display;
    this.clearFilters();
  }

  toggleEditMode(): void {
    this.inEditMode = !this.inEditMode;
  }

  getTeamPicture(team_id: string): string | null {
    if (!this.allTeams || this.allTeams.length === 0) {
      return null;
    }
    const team = this.allTeams.find(team => team.team_id === team_id);
    return team ? team.picture || null : null;
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

  getFAYears(): number[] {
    const yearSet = new Set<number>();
    this.allFAs.forEach(fa => {
      if (fa.year) {
        yearSet.add(fa.year);
      }
    });
    return Array.from(yearSet).sort((a, b) => a - b);
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

  async fetchPickHistory(asset: Draft_Pick | FA_Pick): Promise<void> {
    this.teamService.getPickHistory(asset.asset_id)
    .subscribe(response => {
        asset.pick_history = response.pickHistory;
    });
  }

  getScheduledDrafts(): Draft[] {
    return this.allDrafts.filter(draft => draft.status === 'scheduled');
  }

  getNextThreeYears(startYear: number): number[] {
    return [startYear + 1, startYear + 2, startYear + 3];
  }

  getNextThreeDrafts(): Draft[] {
    const rookieMaxYear = Math.max(
      ...this.allDrafts
        .filter(draft => draft.type === 'rookie')
        .map(draft => draft.year)
    ) || new Date().getFullYear();
  
    const generalMaxYear = Math.max(
      ...this.allDrafts
        .filter(draft => draft.type === 'general')
        .map(draft => draft.year)
    ) || new Date().getFullYear();
  
    const futureDrafts: Draft[] = [];
    
    for (let i = 1; i <= 3; i++) {
      futureDrafts.push({
        year: rookieMaxYear + i,
        type: 'rookie'
      } as Draft);
    }
  
    for (let i = 1; i <= 3; i++) {
      futureDrafts.push({
        year: generalMaxYear + i,
        type: 'general'
      } as Draft);
    }
  
    return futureDrafts;
  } 
   
  filterDraftPicks(): void {
    this.filteredDraftPicks = this.allDraftPicks
      .filter(pick => this.inYearFilter(pick) && this.inPickTypeFilter(pick) && this.inTeamFilter(pick));
    this.sortingService.sort(this.filteredDraftPicks, this.sortingService.sortColumn, this.sortingService.sortDirection);
    this.paginationService.calculateTotalPages(this.filteredDraftPicks);
    this.paginationService.setPage(1);
  }

  filterFAs(): void {
    this.filteredFAPicks = this.allFAs
      .filter(fa => this.inYearFilter(fa) && this.inTeamFilter(fa));
    this.sortingService.sort(this.filteredFAPicks, this.sortingService.sortColumn, this.sortingService.sortDirection);
    this.paginationService.calculateTotalPages(this.filteredFAPicks);
    this.paginationService.setPage(1);
  }

  inYearFilter(pick: Draft_Pick | FA_Pick): boolean {
    return pick.year === Number(this.yearFilter) || this.yearFilter === 'any';
  }
  
  inPickTypeFilter(pick: Draft_Pick): boolean {
    return pick.type === this.pickTypeFilter || this.pickTypeFilter === 'any';
  }

  inTeamFilter(pick: Draft_Pick | FA_Pick): boolean {
    if (this.teamFilter === 'any') {
      return true;
    }
    return pick.owned_by === this.teamFilter;
  }

  clearFilters(): void {
    this.yearFilter = 'any';
    this.pickTypeFilter = 'any';
    this.teamFilter = 'any';
    this.filterDraftPicks();
    this.filterFAs();
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
      protection_sheet_limit: this.leagueSettings.protection_sheet_limit,
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

  searchPlayers(searchKey: string): void {
    this.searchKey = searchKey;
    this.searchResults = this.allPlayers.filter(player =>
      player.first_name.toLowerCase().includes(searchKey.toLowerCase()) || player.last_name.toLowerCase().includes(searchKey.toLowerCase())
    );
  }

  setPlayerTaken(player: Player): void {
    this.assetToEdit.player_taken = player.player_id;
    this.assetToEdit.player_full_name = player.first_name + ' ' + player.last_name;
    this.searchKey = '';
  }

  editAsset(asset: Draft_Pick | FA_Pick): void {

    const payload = {
      type: asset.type ? 'draft-pick' : 'fa',
      action: 'edit',
      asset_id: asset.asset_id,
      owned_by: asset.owned_by ? asset.owned_by : this.selected.owned_by,
      player_taken: asset.player_taken ? asset.player_taken : this.selected.player_taken,
    };

    console.log('Payload: ', payload);
    
    this.http.post(`/api/edit-asset`, payload)
    .subscribe({
      next: (response) => {
        
        if (this.selected) {
          this.selected.owned_by = asset.owned_by;
          this.selected.player_taken = asset.player_taken;
          this.selected.player_full_name = asset.player_full_name;
        }

        this.closeModal();
        
        let message = 'Saved Changes to Asset #' + payload.asset_id;
        this.toastService.showToast(message, true);

      },
      error: (error) => {
        console.error('Error submitting form', error, payload);
      }
    });
  }

  revokeAsset(asset: Draft_Pick | FA_Pick): void {
    const payload = {
      type: asset.type ? 'draft-pick' : 'fa',
      action: 'revoke',
      asset_id: asset.asset_id,
    };
    
    this.http.post(`/api/edit-asset`, payload)
    .subscribe({
      next: (response) => {
        let message = 'Asset #' + payload.asset_id + ' revoked from ' + this.globalService.getTeamName(asset.owned_by);
        this.toastService.showToast(message, true);

        if (this.selected) {
          this.selected.player_taken = 'penalty';
        }

        this.closeModal();
      },
      error: (error) => {
        console.error('Error submitting form', error, payload);
      }
    });

  }

  restoreAsset(asset: Draft_Pick | FA_Pick): void {
    const payload = {
      type: asset.type ? 'draft-pick' : 'fa',
      action: 'restore',
      asset_id: asset.asset_id,
    };
    
    this.http.post(`/api/edit-asset`, payload)
    .subscribe({
      next: (response) => {
        let message = 'Asset #' + payload.asset_id + ' restored to ' + this.globalService.getTeamName(asset.owned_by);
        this.toastService.showToast(message, true);

        if (this.selected) {
          this.selected.player_taken = "";
        }

        this.closeModal();
      },
      error: (error) => {
        console.error('Error submitting form', error, payload);
      }
    });

  }

  async generateDraftPicks(): Promise<void> {
    if (this.draftToEdit) {
      const draftLength = this.draftToEdit.type === 'general' ? this.leagueSettings.general_draft_length : this.leagueSettings.rookie_draft_length;

      const payload = {
        year: this.draftToEdit.year,
        type: this.draftToEdit.type,
        league_id: this.league_id,
        draft_picks: [] as Array<{
          round: number;
          assigned_to: string;
        }>
      };

      for (let round = 1; round <= draftLength; round++) {
        this.allTeams.forEach(team => {
          payload.draft_picks.push({
            round: round,
            assigned_to: team.team_id
          });
        });
      }
      
      this.http.post('/api/create-draft', payload)
        .subscribe({
          next: (response) => {
            console.log('Draft picks generated successfully:', response);
            this.toastService.showToast('Draft picks generated successfully!', true);
            this.ngOnInit();
          },
          error: (error) => {
            console.error('Error generating draft:', error);
            this.toastService.showToast('Error generating draft picks', false);
          }
        }); 
    }
  }

  initializeExpiryDateArray(): void {
    if (this.fasToGenerate.weeks) {
        this.fasToGenerate.expiry_dates = new Array(this.fasToGenerate.weeks).fill(null);
    } else {
        this.fasToGenerate.expiry_dates = [];
    }
  }

  async generateFAs(): Promise<void> {
    if (this.fasToGenerate.year && this.fasToGenerate.weeks && this.fasToGenerate.expiry_dates.length === this.fasToGenerate.weeks) {
      
      const payload = {
        year: this.fasToGenerate.year,
        league_id: this.league_id,
        fa_picks: [] as Array<{
          week: number;
          assigned_to: string;
          expiry_date: string | null;
        }>
      };

      for (let i = 0; i < this.fasToGenerate.weeks; i++) {
        this.allTeams.forEach(team => {
          payload.fa_picks.push({
            week: i,
            assigned_to: team.team_id,
            expiry_date: this.fasToGenerate.expiry_dates[i]
          });
        });
      }

      console.log('Payload: ', payload);

      this.http.post('/api/generate-fas', payload)
      .subscribe({
        next: (response) => {
          console.log('FAs generated successfully:', response);
          this.toastService.showToast('FAs generated successfully!', true);
          this.ngOnInit();
        },
        error: (error) => {
          console.error('Error generating FAs:', error);
          this.toastService.showToast('Error generating FAs', false);
        }
      }); 
    }
  }

  addToDraftOrder(index: number, event: any): void {
    console.log('Event: ', event.target.value)
    const team = this.allTeams.find(team => team.team_name === event.target.value);
    if (team) {
      this.draftOrder[index] = team;
    }
    console.log(this.draftOrder)
  }

  orderIsSet(): boolean {
    if (!this.draftOrder || this.draftOrder.length !== this.allTeams.length) {
      return false;
    }
  
    return this.draftOrder.every(drafter => 
      drafter !== undefined && 
      drafter !== null && 
      this.allTeams.some(team => team.team_id === drafter.team_id)
    );
  }
  
  async setDraftOrder(): Promise<void> {
    if (this.draftToEdit) {
      const draftLength = this.draftToEdit.type === 'general' ? this.leagueSettings.general_draft_length : this.leagueSettings.rookie_draft_length;
      const draftPicks = this.allDraftPicks.filter(pick => pick.draft_id === this.draftToEdit?.draft_id);
  
      const payload = {
        draft_id: this.draftToEdit.draft_id,
        draft_picks: [] as Array<{
          asset_id: number;
          position: number;
          pick_number: number;
        }>
      };
  
      let pickNumber = 1;
      for (let round = 1; round <= draftLength; round++) {
        let position = 1;
        this.draftOrder.forEach((team, position) => {
          if (team) {
            const pick = this.getPickByRound(team, round, draftPicks);
            if (pick) {
              payload.draft_picks.push({
                asset_id: pick.asset_id,
                position: position + 1,
                pick_number: pickNumber
              });
              pickNumber++;
            }
          }
        });
      }
  
      console.log('Payload', payload);
      
      this.http.post('/api/set-draft-order', payload)
        .subscribe({
          next: (response) => {
            console.log('Draft order set successfully.', response);
            this.toastService.showToast(
              `Draft order set for your ${this.draftToEdit?.year} ${this.globalService.capitalizeFirstLetter(this.draftToEdit?.type)} draft.`, 
              true
            );
            this.ngOnInit();
          },
          error: (error) => {
            console.error('Error setting draft order:', error);
            this.toastService.showToast('Error setting draft order.', false);
          }
      });
      
    }
  }

  getPickByRound(team: Team, round: number, draftPicks: Draft_Pick[]): Draft_Pick | undefined {
    return draftPicks.find(pick => 
        pick.assigned_to === team.team_id && 
        pick.round === round
    );
  }

  async advanceSeason(): Promise<void> {
      await this.fetchPlayers();
      const beforeAdvance = JSON.parse(JSON.stringify(this.allPlayers));

      for (let player of this.allPlayers) {
          if (player.contract_status === 'Unsigned' || (player.years_left_current === 0 && player.aav_current === 0)) {
              continue;
          } else if (player.years_left_current === 1) {
              if (player.years_left_next && player.aav_next) {
                  player.years_left_current = player.years_left_next;
                  player.aav_current = player.aav_next;
                  player.years_left_next = 0;
                  player.aav_next = 0;
              } else {
                  player.years_left_current = 0;
                  player.aav_current = 0;
                  player.contract_status = 'Unsigned';
              }
          } else if (player.years_left_current > 1) {
              player.years_left_current--;
          }
          this.postPlayerContract(player);
      }

      const payload = { action: 'advance-season' };
      this.http.post(`/api/${this.league_id}/edit-league`, payload)
      .subscribe({
        next: (response) => {
          this.toastService.showToast('League Season Advanced', true);
        },
        error: (error) => {
          console.error('Error submitting form', error, payload);
        }
      });
  }

  postPlayerContract(player: Player): void {
      const payload = {
          player_id: player.player_id,
          aav_current: player.aav_current,
          years_left_current: player.years_left_current,
          aav_next: player.aav_next,
          years_left_next: player.years_left_next,
          expiry_status: player.expiry_status,
          last_updated: this.globalService.getToday(),
          updated_by: this.globalService.loggedInUser?.first_name + ' ' + this.globalService.loggedInUser?.last_name,
      };
          
      this.http.post('/api/players/edit-contract', payload)
          .subscribe({
          next: (response) => {
              console.log('Contract advanced for ' + player.first_name + ' ' + player.last_name);
          },
          error: (error) => {
              console.error('Error submitting form', error, payload);
          }
      });
  }

  deepCopyPick(pick: Draft_Pick | FA_Pick): Draft_Pick | FA_Pick {
    return {
      ...pick,
      asset_id: pick.asset_id,
      assigned_to: pick.assigned_to,
      owned_by: pick.owned_by,
      player_taken: pick.player_taken,
      type: pick.type
    };
  }

  openModal(template: TemplateRef<any>, pick?: Draft_Pick | FA_Pick): void {
      if (pick) {
          this.selected = pick;
          this.assetToEdit = this.deepCopyPick(pick);
          this.fetchPickHistory(this.selected);
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
    
    this.draftOrder = [];
    this.draftToEdit = null;

    this.fasToGenerate = {
      year: 0,
      weeks: 0,
      expiry_dates: [],
    };

  }

  closeModal() {
    this.modalRef.hide();
    this.clearForms();
  }

}