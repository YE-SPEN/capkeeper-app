import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Player, Team, League, NHL_Team, Draft_Pick, FA_Pick, Trade, Asset } from '../types';


@Injectable({
  providedIn: 'root'
})

export class TeamService {

  constructor(
    private http: HttpClient,
  ) { }

  getTeamsByLeague(league_id: string): Observable<{ league: League, teams: Team[], nhl_teams: NHL_Team[] }> {
    const url = `api/${league_id}`;
    return this.http.get<{ league: League, teams: Team[], nhl_teams: NHL_Team[] }>(url);
  }
  
  getRosterByTeam(league_id: string, team_id: string): Observable<{ team: Team, roster: Player[], draft_picks: Draft_Pick[], fa_picks: FA_Pick[], trades: Trade[] }> {
    const url = `api/${league_id}/teams/${team_id}`;
    return this.http.get<{ team: Team, roster: Player[], draft_picks: Draft_Pick[], fa_picks: FA_Pick[], trades: Trade[] }>(url);
  }

  getTradeByID(league_id: string, trade_id: string): Observable<{ trade: Trade, tradeItems: Asset[] }> {
    const url = `api/${league_id}/trade/${trade_id}`;
    return this.http.get<{ trade: Trade, tradeItems: Asset[] }>(url);
  }

}
