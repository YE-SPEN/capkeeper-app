import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User, League } from '../types';

@Injectable({
  providedIn: 'root'
})
export class CommissionerService {

  constructor(
    private http: HttpClient
  ) { }

  getAllUsers(league_id: string): Observable<{ users: User[] }> {
    const url = `api/${league_id}/commissioner-hub`;
    return this.http.get<{ users: User[] }>(url);
  }

  getLeagueSettings(league_id: string): Observable<{ league: League }> {
    const url = `api/${league_id}/commissioner-hub`;
    return this.http.get<{ league: League }>(url);
  }

  

}
