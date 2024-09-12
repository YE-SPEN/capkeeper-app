import { Component, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { PlayerService } from '../../services/player.service';
import { SortingService } from '../../services/sorting.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Team, League, Player } from '../../types';

@Component({
  selector: 'app-player-database',
  templateUrl: './player-database.component.html',
  styleUrl: './player-database.component.css'
})

export class PlayerDatabaseComponent {
  modalRef!: BsModalRef;
  league_id!: string;
  allPlayers!: Player[];
  filteredPlayers!: Player[];
  teams!: Team[];
  searchKey: string = '';
  currentPage = 1;
  totalPages!: number;
  pageSize = 25;
  statusFilter = 'all';
  positionFilter = 'all';
  teamFilter = 'all';


  constructor(
    private playerService: PlayerService,
    public globalService: GlobalService,
    private modalService: BsModalService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
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
    console.log('Pos filter', this.positionFilter)
    console.log('Status filter', this.statusFilter)
    console.log('Team filter', this.teamFilter)
    this.filteredPlayers = this.allPlayers.filter(player => this.inPosFilter(player) && this.inStatusFilter(player) && this.inTeamFilter(player));
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
    if (this.statusFilter === 'available' && player.owned_by === 'Unowned') { return true; }
    if (this.statusFilter === 'unsigned' && player.contract_status === 'Unsigned') { return true; }
    if (this.statusFilter === 'owned' && player.owned_by !== 'Unowned') { return true; }
    return true;
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

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
  }

}
