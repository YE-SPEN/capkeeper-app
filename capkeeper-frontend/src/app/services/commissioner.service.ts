import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User, League, Draft_Pick, FA_Pick, Draft, Trade_Condition } from '../types';

@Injectable({
  providedIn: 'root'
})
export class CommissionerService {

  constructor(
    private http: HttpClient
  ) { }

  loadCommissionerHub(league_id: string): Observable<{ users: User[], league: League, drafts: Draft[], draft_picks: Draft_Pick[], fa_picks: FA_Pick[], trade_conditions: Trade_Condition[] }> {
    const url = `api/${league_id}/commissioner-hub`;
    return this.http.get<{ users: User[], league: League, drafts: Draft[], draft_picks: Draft_Pick[], fa_picks: FA_Pick[], trade_conditions: Trade_Condition[] }>(url);
  }

  getAllUsers(league_id: string): Observable<{ users: User[] }> {
    const url = `api/${league_id}/commissioner-hub`;
    return this.http.get<{ users: User[] }>(url);
  }

  getLeagueSettings(league_id: string): Observable<{ league: League }> {
    const url = `api/${league_id}/commissioner-hub`;
    return this.http.get<{ league: League }>(url);
  }

  getTradeConditions(league_id: string): Observable<{ trade_conditions: Trade_Condition[] }> {
    const url = `api/${league_id}/commissioner-hub`;
    return this.http.get<{ trade_conditions: Trade_Condition[] }>(url);
  }

}