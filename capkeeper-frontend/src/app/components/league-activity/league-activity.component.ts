import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
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
  activity_log: Activity[] = [];
  filtered_activity_log: Activity[] = [];
  users: User[] = [];
  activityFilter = 'all'

  constructor(
    public globalService: GlobalService,
    private userService: UserService,
    public sortingService: SortingService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.sortingService.sortColumn = 'date';
      this.sortingService.sortDirection = 'desc';
    this.route.paramMap.subscribe(params => {
      this.league_id = params.get('league_id')!;
    });
    this.getActivitiesByDate();
  }

  getSearchDate(days: number): string {
      const today = new Date();
      today.setDate(today.getDate() - days);
      const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

      return formattedDate;
    }

  getActivitiesByDate(): void {
    const league_id = this.league_id;
    const date = this.getSearchDate(this.searchRangeInDays);

    if (league_id) {
      this.userService.getActivitiesByLeague(league_id, date)
      .subscribe(response => {
        this.users = response.users;
        this.activity_log = response.action_log;
        this.filtered_activity_log = this.activity_log;
      });
    }
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
    if (action === 'create-player' || action === 'edit-player') { return 'Database Update'}
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
    if (this.activityFilter === 'all') {
      this.filtered_activity_log = this.activity_log;
      return;
    }
    this.filtered_activity_log = this.activity_log.filter(activity => this.formatActionType(activity.action_type) === this.activityFilter);
    this.sortingService.sort(this.filtered_activity_log, this.sortingService.sortColumn, this.sortingService.sortDirection);
  }
  

}
