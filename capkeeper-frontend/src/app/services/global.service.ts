import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Team, League, NHL_Team, User, Activity, Asset, Trade, FA_Pick } from '../types';
import { HttpParams, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root', 
})
export class GlobalService {
  userMenuIsOpen: boolean = false;
  teamsMenuIsOpen: boolean = false;
  toolsMenuIsOpen: boolean = false;
  inboxMenuIsOpen: boolean = false;
  notifications: number = 0;
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

  initializeTeam(team: Team): Observable<{ teamInfo: Team, inbox: Trade[] }> {;
    const url = 'api/login'
    const params = new HttpParams().set('team', team.team_id ).set('league', team.league_id)
    return this.http.get<{ teamInfo: Team, inbox: Trade[] }>(url, { params });
  }

  updateTeamCap(team: Team): void {
    this.initializeTeam(team)
    .subscribe(response => {
      let temp = response.teamInfo[0];
      if (this.loggedInTeam) {
        this.loggedInTeam.roster_size = temp.roster_size;
        this.loggedInTeam.total_cap = temp.total_cap + temp.salary_retained;
        this.loggedInTeam.inbox = response.inbox;
        console.log('logged in team inbox: ', this.loggedInTeam.inbox)
        
        if (this.league?.salary_cap) {
          this.loggedInTeam.cap_space = this.league.salary_cap - temp.total_cap;
        }
      }
    });
  }

  toggleUserMenu(isOpen: boolean): void {
    this.userMenuIsOpen = isOpen;
  }  

  toggleTeamsMenu(): void {
    this.teamsMenuIsOpen = !this.teamsMenuIsOpen;
  }

  toggleToolsMenu(): void {
    this.toolsMenuIsOpen = !this.toolsMenuIsOpen;
  }

  toggleInbox(isOpen: boolean): void {
    this.inboxMenuIsOpen = ! this.inboxMenuIsOpen;
  }

  getDate(date?: Date): string {
    let newDate;
    if (date) {
      newDate = new Date(date);
    }
    else {
      newDate = new Date();
    }
    newDate.setDate(newDate.getDate() + 1);
    const formattedDate = `${newDate.getFullYear()}-${(newDate.getMonth() + 1).toString().padStart(2, '0')}-${newDate.getDate().toString().padStart(2, '0')}`;
    return formattedDate;    
  }

  getTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  formatDateTime(dateString: string, timeString: string): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);

    const [hours, minutes] = timeString.split(':').map(Number);
    date.setHours(hours, minutes);
  
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'America/New_York'
    };
  
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  getTeamName(team_id: string): string {
    for (let team of this.teams) {
      if (team.team_id === team_id) {
        return team.team_name;
      }
    }
    return '';
  }

  getTeamID(team_name: string): string {
    for (let team of this.teams) {
      if (team.team_name === team_name) {
        return team.team_id;
      }
    }
    return '';
  }

  getUserInitials(user: User): string {
    return user.first_name.slice(0, 1) + user.last_name.slice(0, 1);
  }

  capitalizeFirstLetter(value: string | undefined | null): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  getLeagueHomeData(league_id: string): Observable<{ recentActivity: Activity[], teamPoints: Team[], faPicks: FA_Pick[] }> {
    const url = `api/${league_id}/home`;
    return this.http.get<{ recentActivity: Activity[], teamPoints: Team[], faPicks: FA_Pick[] }>(url);
  }

  getActivitiesByLeague(league_id: string, start: string, end: string): Observable<{ action_log: Activity[], users: User[], tradeItems: Asset[] }> {
    const url = `api/${league_id}/activity-log`;
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<{ action_log: Activity[], users: User[], tradeItems: Asset[] }>(url, { params });
  }

  faIsExpired(pick: FA_Pick): boolean {
    const currentDate = new Date();
    const expiryDate = new Date(pick.expiry_date);
    return expiryDate < currentDate;
  }

  recordAction(league_id: string, uid: string, action: string, message: string, trade_id?: string) {
    const actionData = {
      league_id: league_id,
      message: message,
      date: this.getDate(),
      time: this.getTime(),
      user_id: uid,
      action_type: action,
      trade_id: trade_id ? trade_id : null 
    }
  
    this.http.post('api/record-action', actionData)
      .subscribe({
        next: (response) => {
          console.log('Action recorded successfully:', response);
          this.notifications++;
        },
        error: (error) => {
          console.error('Error recording action:', error);
        }
      });
  }

  recordSession(uid: string, action: 'login' | 'logout'): void {
    const sessionData = {
      user_id: uid, 
      date: this.getDate(),
      time: this.getTime(),
      action: action
    }

    this.http.post('api/record-session', sessionData)
    .subscribe({
      next: (response) => {
        console.log('Session recorded successfully:', response);
      },
      error: (error) => {
        console.error('Error recording action:', error);
      }
    });
  }

}
