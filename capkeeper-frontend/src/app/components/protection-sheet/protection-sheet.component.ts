import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { TeamService } from '../../services/team.service';
import { ToastService } from '../../services/toast-service.service';
import { SortingService } from '../../services/sorting.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Team, Player } from '../../types';

@Component({
  selector: 'app-protection-sheet',
  templateUrl: './protection-sheet.component.html',
  styleUrl: './protection-sheet.component.css'
})
export class ProtectionSheetComponent {
  league_id!: string;
  salary_cap: number = 0;
  team!: Team;
  sheet_cap: number = 45000000;
  sheet_total: number = 0;
  bench_cap: number = 5000000 + (45000000/2);
  bench_total: number = 0;
  max_f: number = 5;
  max_d: number = 3;
  max_g: number = 1;
  max_bench: number = 6;
  protected_count: number = 0;
  franchise_player: Player | null = null;
  protected_forwards: Player[] = [];
  f_protected: number = 0;
  protected_defense: Player[] = [];
  d_protected: number = 0;
  protected_goalies: Player[] = [];
  g_protected: number = 0;
  bench: Player[] = [];

  constructor(
    protected teamService: TeamService,
    public globalService: GlobalService,
    public sortingService: SortingService,
    protected modalService: BsModalService,
    protected toastService: ToastService,
    protected route: ActivatedRoute,
    protected http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.league_id = params.get('league_id')!;
  
      if (this.globalService.loggedInTeam) {
        this.setProtectionSheet(this.globalService.loggedInTeam.team_id);
      }
      
    });
  }
    
  setProtectionSheet(team_id: string): Promise<void> {
    this.clearSheet();
    return new Promise((resolve, reject) => {
      this.teamService.getRosterByTeam(this.league_id, team_id).subscribe(
        response => {
          this.team = response.team;
          this.team.roster = response.roster.filter(player => !player.isRookie);
          this.sortingService.sort(this.team.roster, 'aav_current', 'desc');
          resolve();
        },
        error => {
          reject(error);
        }
      );
    });
  }

  getForwards(): Player[] {
    return this.team.roster.filter(player => player.position === 'F');
  }

  getDefense(): Player[] {
    return this.team.roster.filter(player => player.position === 'D');
  }

  getGoalies(): Player[] {
    return this.team.roster.filter(player => player.position === 'G');
  }

  getBench(): Player[] {
    return this.bench;
  }

  getFranchise(): Player | null {
    return this.franchise_player;
  }

  toggleFranchise(player: Player): void {
    if (this.franchise_player && this.franchise_player === player) {
      this.decrementProtectionCount(player);
      this.franchise_player = null;
    }
    else {
      if (this.franchise_player) {
        this.decrementProtectionCount(this.franchise_player)
      }
      if (this.isProtected(player)) {
        this.removePlayer(player);
      }

      if (player.position === 'F' && this.protected_forwards.length >= this.max_f) {
          const removedForward = this.protected_forwards[this.max_f - 1];
          this.removePlayer(removedForward);
      }
      if (player.position === 'D' && this.protected_defense.length >= this.max_d) {
          const removedDefense = this.protected_defense[this.max_d - 1];
          this.removePlayer(removedDefense);
      }
      if (player.position === 'G' && this.protected_goalies.length >= this.max_g) {
          const removedGoalie = this.protected_goalies[this.max_g - 1];
          this.removePlayer(removedGoalie);
      }

      this.incrementProtectionCount(player);
      this.franchise_player = player;
    }
  }

  incrementProtectionCount(player: Player): void {
    this.protected_count++;
    if (player.position === 'F') { this.f_protected++; }
    if (player.position === 'D') { this.d_protected++; }
    if (player.position === 'G') { this.g_protected++; }  
  }

  decrementProtectionCount(player: Player): void {
    this.protected_count--;
    if (player.position === 'F') { this.f_protected--; }
    if (player.position === 'D') { this.d_protected--; }
    if (player.position === 'G') { this.g_protected--; }  
  }

  toggleProtection(player: Player): void {
    if (!this.isProtected(player)) {
      if (this.mainSheetIsValid(player)) {
        this.protectPlayer(player);
        return;
      }
      else if (this.benchIsValid(player)) {
        this.addToBench(player);
        return;
      } 
    }
    else {
      this.removePlayer(player);
    }
  }

  protectPlayer(player: Player): void {
    if (player.position === 'F') { this.protected_forwards.push(player); }
    if (player.position === 'D') { this.protected_defense.push(player); }
    if (player.position === 'G') { this.protected_goalies.push(player) }  
    this.incrementProtectionCount(player);
    this.sheet_total += player.aav_current;
    this.bench_cap = 5000000 + (this.sheet_cap - this.sheet_total) / 2; 
  }

  addToBench(player: Player): void {
    this.bench.push(player);
    this.bench_total += player.aav_current;
    this.protected_count++;
  }

  removePlayer(player: Player): void {
    const removeFromArray = (arr: Player[]): boolean => {
        const index = arr.findIndex(p => p === player);
        if (index !== -1) {
            arr.splice(index, 1);
            return true;
        }
        return false;
    };

    if (player === this.franchise_player) {
      this.toggleFranchise(player);
      return;
    }

    let removed = false;
    if (player.position === 'F') {
        removed = removeFromArray(this.protected_forwards);
    } else if (player.position === 'D') {
        removed = removeFromArray(this.protected_defense);
    } else if (player.position === 'G') {
        removed = removeFromArray(this.protected_goalies);
    }

    if (!removed) {
        removeFromArray(this.bench);
        this.bench_total -= player.aav_current;
        this.protected_count--;
    }

    if (removed) {
        this.decrementProtectionCount(player);
        this.sheet_total -= player.aav_current;
        this.bench_cap = 5000000 + (this.sheet_cap - this.sheet_total) / 2;
    }
  }

  mainSheetIsValid(player: Player): boolean {
    if (player.position === 'F') {
      if (this.f_protected < this.max_f && (this.sheet_total + player.aav_current) <= this.sheet_cap) {
        return true;
      }
    }
    if (player.position === 'D') {
      if (this.d_protected < this.max_d && (this.sheet_total + player.aav_current) <= this.sheet_cap) {
        return true;
      }
    }
    if (player.position === 'G') {
      if (this.g_protected < this.max_g && (this.sheet_total + player.aav_current) <= this.sheet_cap) {
        return true;
      }
    }
    return false;
  }

  benchIsValid(player: Player): boolean {
    if (this.bench.length < this.max_bench && (this.bench_total + player.aav_current <= this.bench_cap)) {
      return true;
    }
    return false;
  }

  isProtected(player: Player): boolean {
    if (player === this.getFranchise()) { return true; }
    if (player.position === 'F') {
      for (let forward of this.protected_forwards) {
        if (player === forward) { return true; }
      }
    }
    if (player.position === 'D') {
      for (let defensemen of this.protected_defense) {
        if (player === defensemen) { return true; }
      }
    }
    if (player.position === 'G') {
      for (let goalie of this.protected_goalies) {
        if (player === goalie) { return true; }
      }
    }

    for (let onBench of this.bench) {
      if (player === onBench) { return true; }
    }
    return false;
  }

  clearSheet(): void {
    this.protected_count = 0;
    this.franchise_player = null;
    this.protected_forwards = [];
    this.f_protected = 0;
    this.protected_defense = [];
    this.d_protected = 0;
    this.protected_goalies = [];
    this.g_protected = 0;
    this.bench = [];

    this.sheet_total = 0;
    this.bench_total = 0;
    this.bench_cap = 5000000 + ((this.sheet_cap - this.sheet_total) / 2);
  }


}
