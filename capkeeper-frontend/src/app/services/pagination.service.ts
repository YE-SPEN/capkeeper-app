import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  currentPage = 1;
  totalPages!: number;
  pageSize = 25;

  constructor() { }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  setPage(page: number): void {
    this.currentPage = page;
  }

  getPageStart(): number {
    return ((this.currentPage % this.pageSize) * this.pageSize) - (this.pageSize - 1);
  }

  getPageEnd(list: any[]): number {
    if (!list) {
      return 0; 
    }
    return Math.min((this.currentPage % this.pageSize * this.pageSize), list.length);
  }
  
  generatePageArray(): number[] {
    let array = [];
  
    if (this.currentPage <= 3) {
      const maxPage = Math.min(5, this.totalPages);
      for (let i = 1; i <= maxPage; i++) {
        array.push(i);
      }
      return array;
    }
  
    if (this.currentPage >= this.totalPages - 2) {
      const startPage = Math.max(this.totalPages - 4, 1); 
      for (let i = startPage; i <= this.totalPages; i++) {
        array.push(i);
      }
      return array;
    }

    for (let i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
      array.push(i);
    }
  
    return array;
  }
  
  setPageSize(size: number, list: any[]): void {
    this.pageSize = size;
    this.setPage(1);
    this.totalPages = Math.ceil(list.length / this.pageSize);
  }

  calculateTotalPages(list: any[]): void {
    this.totalPages = Math.ceil(list.length / this.pageSize);
  }

}
