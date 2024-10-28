import { AfterViewInit, Component, ElementRef, ViewChild  } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { SortingService } from '../../services/sorting.service';
import { User, Activity, Asset } from '../../types';
import { ActivatedRoute } from '@angular/router';
import { TeamService } from '../../services/team.service';
declare const window: any;

@Component({
  selector: 'app-league-activity',
  templateUrl: './league-activity.component.html',
  styleUrl: './league-activity.component.css'
})

export class LeagueActivityComponent {
  @ViewChild('datepickerRangeStart') datepickerRangeStart!: ElementRef;
  @ViewChild('datepickerRangeEnd') datepickerRangeEnd!: ElementRef;
  userSelectOpen: boolean = false;
  league_id!: string;
  searchKey: string = '';
  searchRangeInDays: number = 7;
  start_date: string = this.getSearchDate(7);
  end_date: string = this.getSearchDate(0);
  rangeIsCustom: boolean = false;
  activity_log: Activity[] = [];
  filtered_activity_log: Activity[] = [];
  selected_users: User[] = [];
  trade_items: Asset[] = [];
  users: User[] = [];
  activityFilter = 'all'
  currentPage = 1;
  totalPages!: number;
  pageSize = 25;
  tradeData: { [key: string]: { partners: string[], assetsByTeam: { [team_id: string]: any[] } } } = {};

  constructor(
    public globalService: GlobalService,
    public sortingService: SortingService,
    private teamService: TeamService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.sortingService.sortDirection = 'desc';
    this.sortingService.sortColumn = 'datetime';
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
      dropdownButton.addEventListener('mouseenter', () => {
        dropdownMenu.classList.remove('hidden');
      });
  
      dropdownMenu.addEventListener('mouseleave', () => {
        dropdownMenu.classList.add('hidden');
      });
    }
  
    /*const Datepicker = window.Flowbite.Datepicker;
    const options = {
      autoHide: true,
      orientation: 'bottom',
      autoSelectToday: true,
      format: 'yyyy-mm-dd',
      defaultDate: new Date(),
    };
  
    const startDatepicker = new Datepicker(this.datepickerRangeStart.nativeElement, options);
    const endDatepicker = new Datepicker(this.datepickerRangeEnd.nativeElement, options);
  
    this.datepickerRangeStart.nativeElement.addEventListener('focus', () => startDatepicker.show());
    this.datepickerRangeEnd.nativeElement.addEventListener('focus', () => endDatepicker.show());
  
    document.addEventListener('click', (event) => {
      if (!this.datepickerRangeStart.nativeElement.contains(event.target) && !this.datepickerRangeEnd.nativeElement.contains(event.target)) {
        startDatepicker.hide();
        endDatepicker.hide();
        this.getActivitiesByDate();
      }
    });*/
  }

  toggleUserSelectMenu(isOpen: boolean): void {
    this.userSelectOpen = isOpen;
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
  }

  setEndDate(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const end = inputElement.value;
    
    this.end_date = end
  }

  getActivitiesByDate(): void {
    const league_id = this.league_id;

    if (league_id) {
      this.globalService.getActivitiesByLeague(league_id, this.start_date, this.end_date)
      .subscribe(response => {
        this.users = response.users;
        this.selected_users = this.users;
        this.trade_items = response.tradeItems;
        this.activity_log = response.action_log;
        this.concatDateTimes(this.activity_log);
        this.filterActivities();
        this.sortingService.sort(this.filtered_activity_log, this.sortingService.sortColumn, this.sortingService.sortDirection);
        this.totalPages = Math.ceil(this.filtered_activity_log.length / this.pageSize);
      });
    }
  }

  concatDateTimes(activity_log: any[]): any[] {
    return activity_log.map(activity => {
      const datetime = new Date(activity.date + ' ' + activity.time);
      return {
        ...activity,
        datetime
      };
    });
  }

  searchActivities(): void {
    if (this.searchKey === '') { this.resetSearch(); return; }
    this.filterActivities();
    this.totalPages = Math.ceil(this.filtered_activity_log.length / this.pageSize);
    this.setPage(1);
  }

  resetSearch(): void {
    this.searchKey = '';
    this.filterActivities();
    this.totalPages = Math.ceil(this.filtered_activity_log.length / this.pageSize);
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

  filterActivities(): void {
    this.filtered_activity_log = this.activity_log.filter(activity => this.inActivityTypeFilter(activity) && this.inUserFilter(activity) && activity.message.toLowerCase().includes(this.searchKey.toLowerCase()));
    this.sortingService.sort(this.filtered_activity_log, this.sortingService.sortColumn, this.sortingService.sortDirection);
    this.totalPages = Math.ceil(this.filtered_activity_log.length / this.pageSize);
    this.setPage(1);
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

  getTradePartners(trade_id: string): string[] {
    const teamIdsSet = new Set<string>();
  
    this.trade_items.forEach(item => {
      if (item && item.traded_to && item.trade_id === trade_id) {
        teamIdsSet.add(item.traded_to);
      }
    });
  
    return Array.from(teamIdsSet);
  }

  getAssetsByTeam(trade_id: string, team_id: string): Asset[] {
    const items = this.trade_items.filter(asset => asset?.trade_id === trade_id && asset?.traded_to === team_id);
    return items
  }
  
}
