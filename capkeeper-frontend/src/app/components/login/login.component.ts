import { Component } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { GlobalService } from '../../services/global.service';
import { TeamService } from '../../services/team.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    public globalService: GlobalService,
    private teamService: TeamService,
  ) { initializeApp(environment.firebase) }

  signIn() {
    const auth = getAuth();

    signInWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Login successful:', user);

        // use logged in email to retrieve user profile
        if (user.email) {
          this.globalService.openSession(user.email)
            .subscribe(response => {
              this.globalService.loggedInUser = response.userInfo[0];

              // use logged user to find associated league(s)
              if (this.globalService.loggedInUser) {
                const league = this.globalService.loggedInUser.league_id;

                // use league id to retrieve associated teams
                this.teamService.getTeamsByLeague(league)
                  .subscribe(response => {
                      this.globalService.teams = response.teams;
                      this.globalService.league = response.league;
                      this.globalService.nhl_teams = response.nhl_teams;
                      console.log(this.globalService.teams);

                      // match logged in user to their corresponding team
                      for (let team of this.globalService.teams) {
                        if (team.managed_by && this.globalService.loggedInUser?.user_name && team.managed_by.includes(this.globalService.loggedInUser.user_name)) {
                          this.globalService.loggedInTeam = team;
                          console.log('Matched ' + this.globalService.loggedInUser.user_name + ' to ' + this.globalService.loggedInTeam.team_name);

                          // initialize cap space & contract variables for logged in team
                          this.globalService.updateTeamCap(this.globalService.loggedInTeam);
                        }
                      }

                      // redirect logged in user to main app
                      this.router.navigate(['/' + league + '/activity-log']);
                  });
              }
            })
        }
      })
      .catch((error) => {
        // Handle login errors
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Login failed:', errorCode, errorMessage);
      });
  }

  signOutClicked(): void {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log('User signed out');
        this.globalService.loggedInUser = null;
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  }

}
