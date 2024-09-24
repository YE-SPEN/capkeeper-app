import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Team, Player } from '../types';

@Injectable({
  providedIn: 'root'
})
export class SortingService {
  sortColumn: string | null = 'last_name';
  sortDirection: 'asc' | 'desc' = 'asc';  

  constructor(
    private http: HttpClient,
  ) { }

  sort(data: any[], column: string | null, direction: 'asc' | 'desc'): any[] {
    if (column) {
      return data.sort((a, b) => {
        const valueA = a[column];
        const valueB = b[column];
        if (direction === 'asc') {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
    }
    this.sortColumn = column;
    return data;
  }

  toggleSort(data: any[], column: string): void {
    if (column === this.sortColumn) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'desc';
    }
    this.sort(data, column, this.sortDirection);
  }
  
}