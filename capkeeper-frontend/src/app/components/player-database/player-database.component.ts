import { Component, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../services/global.service';
import { PlayerService } from '../../services/player.service';
import { SortingService } from '../../services/sorting.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Team, Player } from '../../types';

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
  searchKey: string = '';
  currentPage = 1;
  totalPages!: number;
  pageSize = 25;
  statusFilter = 'all';
  positionFilter = 'all';
  teamFilter = 'all';
  warnings: Warning[] = [];
  formSubmitted: boolean = false;
  formData = {
    first_name: '',
    last_name: '',
    short_code: '',
    position: '',
    years_left_current: 0,
    aav_current: 0,
    years_left_next: 0,
    aav_next: 0,
    expiry_status: '',
  };

  constructor(
    private playerService: PlayerService,
    public globalService: GlobalService,
    public sortingService: SortingService,
    private modalService: BsModalService,
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
    });
  }

  searchPlayers(): void {
    if (this.searchKey === '') { this.resetSearch(); return; }
    this.filteredPlayers = this.filteredPlayers.filter(player =>
      player.first_name.toLowerCase().includes(this.searchKey.toLowerCase()) || player.last_name.toLowerCase().includes(this.searchKey.toLowerCase())
    );
    this.totalPages = Math.ceil(this.filteredPlayers.length / this.pageSize);
  }

  filterPlayers(): void {
    this.filteredPlayers = this.allPlayers.filter(player => this.inPosFilter(player) && this.inStatusFilter(player) && this.inTeamFilter(player));
    this.sortingService.sort(this.filteredPlayers, this.sortingService.sortColumn, this.sortingService.sortDirection);
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

  resetSearch(): void {
    this.searchKey = '';
    this.filterPlayers();
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
    if (this.currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    let numArray = [];
    if (this.currentPage <= this.totalPages - 2) {
      for (let i = this.currentPage - 2; i <= this.currentPage + 2; ++i) { numArray.push(i); }
      return numArray;
    }

    for (let i = this.totalPages - 4; i <= this.totalPages; ++i) { numArray.push(i) }
    return numArray;
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
      action: 'add',
      last_updated: this.globalService.getDate(),
      updated_by: this.globalService.loggedInUser?.first_name + ' ' + this.globalService.loggedInUser?.last_name
    }

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
        updated_by: 'Eric Spensieri',
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
            
            this.completeAction(message, true);
            console.log('Changes saved.', response);
  
            this.formSubmitted = true;
            setTimeout(() => {
              this.formSubmitted = false;
            }, 3000);
            this.resetForm();
          },
          error: (error) => {
            console.error('Error submitting form', error, submissionData);
            this.completeAction('Error Submitting Player Form', false);
          }
        });

        if (this.globalService.loggedInUser) {
          this.globalService.recordAction(this.league_id, this.globalService.loggedInUser?.user_name, action_type, message);
        }
        
       this.closeModal();
       this.ngOnInit();
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
  }

  resetForm() {
    this.formData.first_name = '';
    this.formData.last_name = '';
    this.formData.short_code = '';
    this.formData.position = '';
    this.formData.years_left_current = 0;
    this.formData.aav_current = 0;
    this.formData.years_left_next = 0;
    this.formData.aav_next = 0;
    this.formData.expiry_status = '';
  }

  completeAction(message: string, success: boolean): void {
    //this.actionCompleted.emit({ message, success });
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
  }

}
