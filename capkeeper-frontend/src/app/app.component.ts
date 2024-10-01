import { Component, OnInit } from '@angular/core';
import { TeamService } from './services/team.service';
import { GlobalService } from './services/global.service';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';
//import { User } from './types';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'capkeeper-app';
  user: User | null = null;
  /*temp: User = {
    user_name: 'e_spen',
    first_name: 'Eric',
    last_name: 'Spensieri',
    email: 'espensieri@hotmail.com',
    picture: '',
    league_id: '100',
    notification_count: 0,
    log_in_date: this.globalService.getDate(),
    log_in_time: this.globalService.getTime(),
    team_managed: 'chiefkeefe',
    log_out_date: this.globalService.getDate(),
    log_out_time: this.globalService.getTime(),
  }*/
  email = '';
  password = ''

  constructor(
    private teamService: TeamService,
    public globalService: GlobalService,
  ) { }

  ngOnInit(): void {
    
    /*
    // remove for sign-in to work again
    this.globalService.loggedInUser = this.temp;
    if (this.globalService.loggedInUser) {
      this.teamService.getTeamsByLeague('100')
        .subscribe(response => {
            this.globalService.teams = response.teams;
            this.globalService.league = response.league;
            this.globalService.nhl_teams = response.nhl_teams;

            for (let team of this.globalService.teams) {
              if (team.team_id === 'chiefkeefe') {
                this.globalService.loggedInTeam = team;
                this.globalService.initializeTeam(this.globalService.loggedInTeam)
                .subscribe(response => {
                  let temp = response.teamInfo[0];
                  if (this.globalService.loggedInTeam) {
                    this.globalService.loggedInTeam.roster_size = temp.roster_size;
                    this.globalService.loggedInTeam.total_cap = temp.total_cap;
                    
                    // If `this.globalService.league` or `salary_cap` can be undefined, handle them accordingly
                    if (this.globalService.league?.salary_cap) {
                      this.globalService.loggedInTeam.cap_space = this.globalService.league.salary_cap - temp.total_cap;
                    }
                  }
                  console.log(this.globalService.loggedInTeam);
                });
              
              }
            }
        });
    } */

    const auth = getAuth();
    
    // Subscribe to the authentication state
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        this.user = user;
      } else {
        // No user is signed in
        this.user = null;
      }
    });
    
    
  }

}
