import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Player, Team, League } from '../types';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(
    private http: HttpClient
  ) { }

  getAllPlayers(league_id: string): Observable<{ players: Player[] }> {
    const url = `api/${league_id}/players`;
    return this.http.get<{ players: Player[] }>(url);
  }
  
}
