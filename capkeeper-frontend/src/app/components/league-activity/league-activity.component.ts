import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { SortingService } from '../../services/sorting.service';
import { User, Activity } from '../../types';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-league-activity',
  templateUrl: './league-activity.component.html',
  styleUrl: './league-activity.component.css'
})

export class LeagueActivityComponent {
  league_id!: string;
  searchRangeInDays: number = 7;
  start_date: string = this.getSearchDate(7);
  end_date: string = this.getSearchDate(0);
  rangeIsCustom: boolean = false;
  activity_log: Activity[] = [];
  filtered_activity_log: Activity[] = [];
  selected_users: User[] = [];
  users: User[] = [];
  activityFilter = 'all'
  currentPage = 1;
  totalPages!: number;
  pageSize = 25;

  constructor(
    public globalService: GlobalService,
    public sortingService: SortingService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.sortingService.sortColumn = 'date';
      this.sortingService.sortDirection = 'desc';
    this.route.paramMap.subscribe(params => {
      this.league_id = params.get('league_id')!;
    });
    this.globalService.notifications = 0;
    this.getActivitiesByDate();
  }

  ngAfterViewInit() {
    const dropdownButton = document.getElementById('dropdownBgHoverButton');
    const dropdownMenu = document.getElementById('dropdownBgHover');

    if (dropdownButton && dropdownMenu) {
      dropdownButton.addEventListener('click', () => {
        dropdownMenu.classList.toggle('hidden');
      });
    }
  }

  getSearchDate(days: number): string {
      const today = new Date();
      today.setDate(today.getDate() - days);
      const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

      return formattedDate;
  }

  setDateRange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const days = parseInt(selectElement.value, 10);
    
    if (days === 0) { 
      this.rangeIsCustom = true; 
      return; 
    }
    else {
      this.start_date = this.getSearchDate(days);
      this.end_date = this.getSearchDate(0);
      this.getActivitiesByDate();
    }
  }

  setStartDate(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const start = inputElement.value;
    
    this.start_date = start;
    console.log("Start Date:", this.start_date); 
  }

  setEndDate(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const end = inputElement.value;
    
    this.end_date = end
    console.log("End Date:", this.end_date); 
  }

  getActivitiesByDate(): void {
    const league_id = this.league_id;

    if (league_id) {
      this.globalService.getActivitiesByLeague(league_id, this.start_date, this.end_date)
      .subscribe(response => {
        this.users = response.users;
        this.selected_users = this.users;
        this.activity_log = response.action_log;
        this.filtered_activity_log = this.activity_log;
        this.totalPages = Math.ceil(this.filtered_activity_log.length / this.pageSize);
      });
    }
  }

  isNew(activity: Activity): boolean {
    if (this.globalService.loggedInUser) {
        if (activity.date > this.globalService.loggedInUser.log_out_date) {
            return true;
        }
        if (activity.date === this.globalService.loggedInUser.log_out_date && activity.time > this.globalService.loggedInUser.log_out_time) {
            return true;
        }
    }
    return false;
  }

  getUser(user_id: string): string {
    for (let user of this.users) {
      if (user_id === user.user_name) {
        return user.first_name + ' ' + user.last_name;
      }
    }
    return '';
  }

  formatActionType(action: string): string {
    if (action === 'ir' || action === 'callup') { return 'Roster Move'}
    if (action === 'create-player' || action === 'edit-player' || action === 'edit-contract') { return 'Database Update'}
    if (action === 'add-player' || action === 'drop-player') { return 'Add/Drop' }
    if (action === 'trade') { return 'Trade' }
    if (action === 'trade-block') { return 'Trade Block' }
    return ''
  }

  formatDateTime(dateString: string, timeString: string): string {
    const date = new Date(dateString);

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

  filterActivities(): void {
    this.filtered_activity_log = this.activity_log.filter(activity => this.inActivityTypeFilter(activity) && this.inUserFilter(activity));
    this.sortingService.sort(this.filtered_activity_log, this.sortingService.sortColumn, this.sortingService.sortDirection);
    this.totalPages = Math.ceil(this.filtered_activity_log.length / this.pageSize);
  }

  inActivityTypeFilter(activity: Activity): boolean {
    if (this.activityFilter === 'all' || this.formatActionType(activity.action_type) === this.activityFilter) { return true }
    return false;
  }

  inUserFilter(activity: Activity): boolean {
    for (let user of this.selected_users) {
      if (activity.user_id === user.user_name) {
        return true;
      }
    }
    return false;
  }

  toggleUserSelect(event: Event, user: User): void {
    const checkbox = event.target as HTMLInputElement;
  
    if (checkbox.checked) {
      this.selected_users.push(user);
    } else {
      this.selected_users = this.selected_users.filter(selectedUser => selectedUser.user_name !== user.user_name);
    }
    this.filterActivities();
  }

  isSelected(user: User): boolean {
    for (let selectedUser of this.selected_users) {
      if (selectedUser.user_name === user.user_name) {
        return true;
      }
    }
    return false;
  }

  deselectAllUsers(): void {
    this.selected_users = [];
    this.filterActivities();
    this.currentPage = 1;
  }

  selectAllUsers(): void {
    this.selected_users = this.users;
    this.filterActivities();
    this.currentPage = 1;
  }

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

  getPageEnd(): number {
    if (!this.filtered_activity_log) {
      return 0; 
    }
    return Math.min((this.currentPage % this.pageSize * this.pageSize), this.filtered_activity_log.length);
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
  
  setPageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filtered_activity_log.length / this.pageSize);
  }

}
