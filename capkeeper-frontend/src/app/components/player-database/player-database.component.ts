import { Component, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../services/global.service';
import { PlayerService } from '../../services/player.service';
import { SortingService } from '../../services/sorting.service';
import { TeamService } from '../../services/team.service';
import { ToastService } from '../../services/toast-service.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Team, Player, FA_Pick } from '../../types';

interface Warning {
  header: string,
  message: string,
  isRed: boolean
}

@Component({
  selector: 'app-player-database',
  templateUrl: './player-database.component.html',
  styleUrl: './player-database.component.css'
})

export class PlayerDatabaseComponent {
  modalRef!: BsModalRef;
  league_id!: string;
  allPlayers!: Player[];
  filteredPlayers: Player[] = [];
  selected!: Player;
  teams: Team[] = [];
  fa_picks: FA_Pick[] = [];
  fa_to_use!: string;
  searchKey: string = '';
  currentPage = 1;
  totalPages!: number;
  pageSize = 25;
  statusFilter = 'all';
  positionFilter = 'all';
  teamFilter = 'all';
  maxSalary: number = 15000000;
  warnings: Warning[] = [];
  formSubmitted: boolean = false;
  addNextContract: boolean = false;
  toastMessage: string = '';
  formData = {
    first_name: '',
    last_name: '',
    short_code: '',
    position: '',
    years_left_current: null as number | null,
    aav_current: null as number | null,
    years_left_next: null as number | null,
    aav_next: null as number | null,
    expiry_status: '',
};

  constructor(
    private playerService: PlayerService,
    private teamService: TeamService,
    public globalService: GlobalService,
    public sortingService: SortingService,
    private modalService: BsModalService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.sortingService.sortColumn = 'last_name';
      this.sortingService.sortDirection = 'asc';
      this.league_id = params.get('league_id')!;

      this.playerService.getAllPlayers(this.league_id)
        .subscribe(response => {
          this.allPlayers = response.players;
          this.filterPlayers();

          this.totalPages = Math.ceil(this.filteredPlayers.length / this.pageSize);
      });

      if (this.globalService.loggedInTeam) {
        this.teamService.getFAsByTeam(this.league_id, this.globalService.loggedInTeam.team_id)
          .subscribe(response => {
            this.fa_picks = response.fa_picks.filter(pick => pick.owned_by === this.globalService.loggedInTeam?.team_id && !pick.player_taken);
            console.log('Picks: ', this.fa_picks)
          })
      }

    });
  }

  searchPlayers(): void {
    if (this.searchKey === '') { this.resetSearch(); return; }
    this.filterPlayers();
    this.totalPages = Math.ceil(this.filteredPlayers.length / this.pageSize);
    this.setPage(1);
  }

  filterPlayers(): void {
    this.filteredPlayers = this.allPlayers
      .filter(player => 
              this.inPosFilter(player) 
              && this.inStatusFilter(player) 
              && this.inTeamFilter(player) 
              && this.inSalaryFilter(player) 
              && (player.first_name.toLowerCase().includes(this.searchKey.toLowerCase()) || player.last_name.toLowerCase().includes(this.searchKey.toLowerCase()))
            );
    this.sortingService.sort(this.filteredPlayers, this.sortingService.sortColumn, this.sortingService.sortDirection);
  }

  clearFilter(): void {
    this.searchKey = '';
    this.statusFilter = 'all';
    this.positionFilter = 'all';
    this.teamFilter = 'all';
    this.maxSalary = 15000000;
    this.filterPlayers();
  }

  isSkater(player: Player): boolean {
    return player.position === 'F' || player.position === 'D';
  }

  inPosFilter(player: Player): boolean {
    if (this.positionFilter === 'all') { return true; }
    if (this.positionFilter === 'skater' && this.isSkater(player)) { return true; }
    return player.position === this.positionFilter;
  }

  inStatusFilter(player: Player): boolean {
    if (this.statusFilter === 'all') { return true; }
    if (this.statusFilter === 'available' && player.owned_by === null) { return true; }
    if (this.statusFilter === 'unsigned' && player.contract_status === 'Unsigned') { return true; }
    if (this.statusFilter === 'active' && player.contract_status === 'Active') { return true; }
    if (this.statusFilter === 'owned' && player.owned_by !== null) { return true; }
    if (this.globalService.loggedInTeam && player.owned_by === null && this.statusFilter === 'affordable' && player.aav_current <= this.globalService.loggedInTeam?.cap_space) { return true; }
    return false;
  }

  inTeamFilter(player: Player): boolean {
    return player.owned_by === this.teamFilter || this.teamFilter === 'all';
  }

  inSalaryFilter(player: Player): boolean {
    return player.aav_current < this.maxSalary || player.contract_status === 'Unsigned';
  }

  resetSearch(): void {
    this.searchKey = '';
    this.filterPlayers();
    this.totalPages = Math.ceil(this.filteredPlayers.length / this.pageSize);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  setPage(page: number): void {
    this.currentPage = page;
  }

  getPageStart(): number {
    return ((this.currentPage % this.pageSize) * this.pageSize) - (this.pageSize - 1);
  }

  getPageEnd(): number {
    if (!this.filteredPlayers) {
      return 0; 
    }
    return Math.min((this.currentPage % this.pageSize * this.pageSize), this.filteredPlayers.length);
  }
  
  generatePageArray(): number[] {
    let array = [];
  
    if (this.currentPage <= 3) {
      const maxPage = Math.min(5, this.totalPages);
      for (let i = 1; i <= maxPage; i++) {
        array.push(i);
      }
      return array;
    }
  
    if (this.currentPage >= this.totalPages - 2) {
      const startPage = Math.max(this.totalPages - 4, 1); 
      for (let i = startPage; i <= this.totalPages; i++) {
        array.push(i);
      }
      return array;
    }

    for (let i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
      array.push(i);
    }
  
    return array;
  }
  
  setPageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredPlayers.length / this.pageSize);
  }

  generateID(first_name: string, last_name: string): string {
    const id = first_name.toLowerCase().replace(/\s+/g, '') + '-' + last_name.toLowerCase().replace(/\s+/g, '');
    console.log(id)
    return id;
  }

  validatePickup(player: Player): boolean {
    return this.capIsValid(player) && this.contractIsValid();
  }

  capIsValid(player: Player): boolean {
    if (this.globalService.loggedInTeam?.cap_space && player.aav_current > this.globalService.loggedInTeam?.cap_space) {
      return false;
    }
    return true;
  }

  contractIsValid(): boolean {
    if (this.globalService.loggedInTeam?.roster_size && this.globalService.league?.max_roster_size) {
      if (this.globalService.league?.max_roster_size <= this.globalService.loggedInTeam?.roster_size ) {
        return false;
      }
    }
    return true;
  }

  addPlayer(player: Player, rookie: boolean): void {
    const payload = {
      player_id: player.player_id,
      league_id: this.league_id,
      team_id: this.globalService.loggedInTeam?.team_id,
      isRookie: rookie,
      fa_used: this.fa_to_use,
      action: 'add',
      last_updated: this.globalService.getDate(),
      updated_by: this.globalService.loggedInUser?.first_name + ' ' + this.globalService.loggedInUser?.last_name
    }

    console.log('sending add payload: ', payload)

    this.http.post('api/players/add-drop', payload)
    .subscribe({
      next: (response) => {
        console.log('Action recorded successfully:', response);
        if (this.globalService.loggedInTeam && this.globalService.loggedInUser) {
          this.globalService.updateTeamCap(this.globalService.loggedInTeam);

          let message = player.first_name + ' ' + player.last_name + ' added from free agency by ' + this.globalService.loggedInTeam.team_name;
          let action = 'add-player';
          this.globalService.recordAction(this.league_id, this.globalService.loggedInUser?.user_name, action, message);

          this.ngOnInit; 
          this.toastService.showToast(message, true);
        }
      },
      error: (error) => {
        console.error('Error recording action:', error);
      }
    });

  }

  playerFormSubmit(event: Event) {
      const formElement = event.target as HTMLFormElement;
      const action = formElement.getAttribute('data-action');

      const submissionData = {
        action: action,
        player_id: action === 'edit' ? this.selected.player_id : this.generateID(this.formData.first_name, this.formData.last_name),
        first_name: this.formData.first_name,
        last_name: this.formData.last_name,
        position: this.formData.position,
        short_code: this.formData.short_code,
        last_updated: this.globalService.getDate(),
        updated_by: this.globalService.loggedInUser?.first_name + ' ' + this.globalService.loggedInUser?.last_name,
      };

      let message;
      let action_type;
      if (submissionData.action === 'add') {
        message = submissionData.first_name + ' ' + submissionData.last_name + ' added to the player database.';
        action_type = 'create-player';
      }
      else {
        message = 'Saved changes to player profile for ' + submissionData.first_name + ' ' + submissionData.last_name + '.';
        action_type = 'edit-player';
      }
      
      this.http.post('/api/players/create-player', submissionData)
        .subscribe({
          next: (response) => {
            
            this.toastService.showToast(message, true);
            console.log('Changes saved.', response);
  
            this.formSubmitted = true;
            setTimeout(() => {
              this.formSubmitted = false;
            }, 3000);
            this.resetForm();
          },
          error: (error) => {
            console.error('Error submitting form', error, submissionData);
          }
        });

        if (this.globalService.loggedInUser) {
          this.globalService.recordAction(this.league_id, this.globalService.loggedInUser?.user_name, action_type, message);
        }
        
       this.closeModal();
       this.ngOnInit();
  }

  contractFormSubmit(event: Event) {
    const submissionData = {
      player_id: this.selected.player_id,
      aav_current: this.formData.aav_current,
      years_left_current: this.formData.years_left_current,
      aav_next: this.formData.aav_next,
      years_left_next: this.formData.years_left_next,
      expiry_status: this.formData.expiry_status,
      last_updated: this.globalService.getDate(),
      updated_by: this.globalService.loggedInUser?.first_name + ' ' + this.globalService.loggedInUser?.last_name,
    };

    console.log(submissionData);

    let message = '';
    if (this.selected) {
      message = 'Player contract information updated for ' + this.selected.first_name + ' ' + this.selected.last_name + '.';
    }
    
    let action_type = 'edit-contract';
    
    this.http.post('/api/players/edit-contract', submissionData)
      .subscribe({
        next: (response) => {
          
          this.toastService.showToast(message, true);
          console.log('Changes saved.', response);

          this.formSubmitted = true;
          setTimeout(() => {
            this.formSubmitted = false;
          }, 3000);
          this.resetForm();
        },
        error: (error) => {
          console.error('Error submitting form', error, submissionData);
        }
      });

      if (this.globalService.loggedInUser) {
        this.globalService.recordAction(this.league_id, this.globalService.loggedInUser?.user_name, action_type, message);
      }
      
     this.closeModal();
     this.ngOnInit();
  }

  addContract(): void {
    this.addNextContract = !this.addNextContract;
  }

  selectPlayer(player: Player) {
    this.selected = player;
    this.formData.first_name = this.selected.first_name;
    this.formData.last_name = this.selected.last_name;
    this.formData.short_code = this.selected.short_code;
    this.formData.position = this.selected.position;
    this.formData.years_left_current = this.selected.years_left_current;
    this.formData.aav_current = this.selected.aav_current;
    this.formData.years_left_next = this.selected.years_left_next;
    this.formData.aav_next = this.selected.aav_next;
    this.formData.expiry_status = this.selected.expiry_status;
    console.log(this.formData)
  }

  resetForm() {
    this.formData.first_name = '';
    this.formData.last_name = '';
    this.formData.short_code = '';
    this.formData.position = '';
    this.formData.years_left_current = null;
    this.formData.aav_current = null;
    this.formData.years_left_next = null;
    this.formData.aav_next = null;
    this.formData.expiry_status = '';
  }

  isButtonDisabled(): boolean {
    return this.formData.first_name === '' || this.formData.last_name === '' || this.formData.position === '' || this.formData.short_code === '';
  }

  openModal(template: TemplateRef<any>, player?: Player): void {
    if (player) {
      this.selectPlayer(player);
    }
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
    this.resetForm();
    this.resetSearch();
    this.addNextContract = false;
  }

}
