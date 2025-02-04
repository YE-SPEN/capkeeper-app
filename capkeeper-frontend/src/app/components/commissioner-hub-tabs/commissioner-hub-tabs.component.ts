import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Team, User, FA_Pick, Draft_Pick, Draft, League, Player } from '../../types';
import { GlobalService } from '../../services/global.service';
import { SortingService } from '../../services/sorting.service';

@Component({
  selector: 'app-commissioner-hub-tabs',
  templateUrl: './commissioner-hub-tabs.component.html'
})
export class CommissionerHubTabsComponent {
  // Data Inputs
  @Input() allTeams: Team[] = [];
  @Input() allUsers: User[] = [];
  @Input() allDraftPicks: Draft_Pick[] = [];
  @Input() allFAs: FA_Pick[] = [];
  @Input() allDrafts: Draft[] = [];
  @Input() filteredDraftPicks: Draft_Pick[] = [];
  @Input() filteredFAPicks: FA_Pick[] = [];
  @Input() leagueSettings!: League;
  @Input() displaying: 'teams' | 'users' | 'draft' | 'fa' = 'teams';
  @Input() league_id!: string;
  @Input() yearFilter: string = 'any';
  @Input() pickTypeFilter: 'any' | 'general' | 'rookie' = 'any';
  @Input() teamFilter: string = 'any';
  @Input() searchKey: string = '';
  @Input() searchResults: Player[] = [];
  @Input() selected!: Draft_Pick | FA_Pick;
  @Input() assetToEdit!: Draft_Pick | FA_Pick;

  // Services (needed for template references)
  constructor(
    public globalService: GlobalService,
    public sortingService: SortingService
  ) {}

  // Event Outputs
  @Output() displayChange = new EventEmitter<'teams' | 'users' | 'draft' | 'fa'>();
  @Output() toggleAdminRightsEvent = new EventEmitter<User>();
  @Output() filterDraftPicksChange = new EventEmitter<void>();
  @Output() filterFAsChange = new EventEmitter<void>();
  @Output() clearFiltersEvent = new EventEmitter<void>();
  @Output() editAssetEvent = new EventEmitter<Draft_Pick | FA_Pick>();
  @Output() openModalEvent = new EventEmitter<{template: any, pick?: Draft_Pick | FA_Pick}>();
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() yearFilterChange = new EventEmitter<string>();
  @Output() teamFilterChange = new EventEmitter<string>();
  @Output() pickTypeFilterChange = new EventEmitter<'any' | 'general' | 'rookie'>();
  @Output() searchKeyChange = new EventEmitter<string>();
  @Output() playerTakenChange = new EventEmitter<Player>();
  @Output() revokeAssetEvent = new EventEmitter< Draft_Pick | FA_Pick>();
  @Output() restoreAssetEvent = new EventEmitter< Draft_Pick | FA_Pick>();  

  setDisplay(display: 'teams' | 'users' | 'draft' | 'fa'): void {
    this.displayChange.emit(display);
  }

  setPlayerTaken(player: Player): void {
    this.playerTakenChange.emit(player);
  }

  toggleAdminRights(user: User): void {
    this.toggleAdminRightsEvent.emit(user);
  }

  searchPlayers(searchKey: string): void {
    this.searchKeyChange.emit(searchKey);
  }

  filterDraftPicks(): void {
    this.filterDraftPicksChange.emit();
  }

  filterFAs(): void {
    this.filterFAsChange.emit();
  }

  clearFilters(): void {
    this.clearFiltersEvent.emit();
  }

  editAsset(asset: Draft_Pick | FA_Pick): void {
    this.editAssetEvent.emit(asset);
  }

  revokeAsset(asset: Draft_Pick | FA_Pick): void {
    this.revokeAssetEvent.emit(asset);
  }

  restoreAsset(asset: Draft_Pick | FA_Pick): void {
    this.restoreAssetEvent.emit(asset);
  }

  openModal(template: any, pick?: Draft_Pick | FA_Pick): void {
    this.openModalEvent.emit({ template, pick });
  }

  closeModal() {
    this.closeModalEvent.emit();
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

}