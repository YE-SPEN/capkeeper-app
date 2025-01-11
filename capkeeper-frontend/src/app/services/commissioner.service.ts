import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User, League, Draft_Pick, FA_Pick } from '../types';

@Injectable({
  providedIn: 'root'
})
export class CommissionerService {

  constructor(
    private http: HttpClient
  ) { }

  loadCommissionerHub(league_id: string): Observable<{ users: User[], league: League, draft_picks: Draft_Pick[], fa_picks: FA_Pick[] }> {
    const url = `api/${league_id}/commissioner-hub`;
    return this.http.get<{ users: User[], league: League, draft_picks: Draft_Pick[], fa_picks: FA_Pick[] }>(url);
  }

  getAllUsers(league_id: string): Observable<{ users: User[] }> {
    const url = `api/${league_id}/commissioner-hub`;
    return this.http.get<{ users: User[] }>(url);
  }

  getLeagueSettings(league_id: string): Observable<{ league: League }> {
    const url = `api/${league_id}/commissioner-hub`;
    return this.http.get<{ league: League }>(url);
  }

}