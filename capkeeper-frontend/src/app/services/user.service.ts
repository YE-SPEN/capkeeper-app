import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User, Activity } from '../types';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
  ) { }

  getActivitiesByLeague(league_id: string, start: string, end: string): Observable<{ action_log: Activity[], users: User[] }> {
    const url = `api/${league_id}/activity-log`;
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<{ action_log: Activity[], users: User[] }>(url, { params });
  }

}
