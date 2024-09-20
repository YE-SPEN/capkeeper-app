import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Team, League, NHL_Team, User } from '../types';
import { HttpParams, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root', 
})
export class GlobalService {
  userMenuIsOpen: boolean = false;
  teamsMenuIsOpen: boolean = false;
  loggedInUser: User | null = null;
  loggedInTeam: Team | null = null;
  league: League | null = null;
  teams: Team[] = [];
  nhl_teams: NHL_Team[] = [];

  constructor(
    private http: HttpClient,
  ) { }

  openSession(email: string): Observable<{ userInfo: User }> {
    const url = 'api/login';
    const params = new HttpParams().set('email', email);
    return this.http.get<{ userInfo: User }>(url, { params });
  }

  initializeTeam(team: Team): Observable<{ teamInfo: Team }> {;
    const url = 'api/login'
    const params = new HttpParams().set('team', team.team_id ).set('league', team.league_id)
    return this.http.get<{ teamInfo: Team }>(url, { params });
  }

  updateTeamCap(team: Team): void {
    this.initializeTeam(team)
    .subscribe(response => {
      let temp = response.teamInfo[0];
      if (this.loggedInTeam) {
        this.loggedInTeam.roster_size = temp.roster_size;
        this.loggedInTeam.total_cap = temp.total_cap;
        
        if (this.league?.salary_cap) {
          this.loggedInTeam.cap_space = this.league.salary_cap - temp.total_cap;
        }
      }
    });
  }

  toggleUserMenu(): void {
    this.userMenuIsOpen = !this.userMenuIsOpen;
  }

  toggleTeamsMenu(): void {
    this.teamsMenuIsOpen = !this.teamsMenuIsOpen;
  }

  getDate(): string {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    return formattedDate;    
  }

  getTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  recordAction(league_id: string, uid: string, action: string, message: string,) {
    const actionData = {
      league_id: league_id,
      message: message,
      date: this.getDate(),
      time: this.getTime(),
      user_id: uid,
      action_type: action
    }
  
    this.http.post('api/record-action', actionData)
      .subscribe({
        next: (response) => {
          console.log('Action recorded successfully:', response);
        },
        error: (error) => {
          console.error('Error recording action:', error);
        }
      });
  }

}
