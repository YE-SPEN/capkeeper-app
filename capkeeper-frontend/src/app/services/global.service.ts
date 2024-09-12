import { Injectable } from '@angular/core';
import { Team, League } from '../types';

@Injectable({
  providedIn: 'root', 
})
export class GlobalService {
  userMenuIsOpen: boolean = false;
  teamsMenuIsOpen: boolean = false;
  league: League | null = null;
  teams: Team[] = [];

  toggleUserMenu(): void {
    this.userMenuIsOpen = !this.userMenuIsOpen;
  }

  toggleTeamsMenu(): void {
    this.teamsMenuIsOpen = !this.teamsMenuIsOpen;
  }

}
