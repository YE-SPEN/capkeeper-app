import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Player, Team } from '../types';


@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(
    private http: HttpClient,
  ) { }

  getTeamRoster(league_id: string, team_id: string): Observable<{ team: Team, roster: Player[] }> {
    const url = `api/${league_id}/teams/${team_id}`;
    return this.http.get<{ team: Team, roster: Player[] }>(url);
  }

}
