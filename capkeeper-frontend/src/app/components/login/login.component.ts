import { Component, TemplateRef } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { GlobalService } from '../../services/global.service';
import { TeamService } from '../../services/team.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  modalRef!: BsModalRef;
  email: string = '';
  password: string = '';
  loginError: boolean = false;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    public globalService: GlobalService,
    private teamService: TeamService,
  ) { initializeApp(environment.firebase) }

  signIn() {
    const auth = getAuth();

    signInWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        this.loginError = false;
        const user = userCredential.user;
        
        // use logged in email to retrieve user profile
        if (user.email) {
          this.globalService.openSession(user.email)
            .subscribe(response => {
              this.globalService.loggedInUser = response.userInfo[0];

              // use logged user to find associated league(s)
              if (this.globalService.loggedInUser) {
                this.globalService.recordSession(this.globalService.loggedInUser.user_name, 'login');
                this.globalService.notifications = this.globalService.loggedInUser?.notification_count
                const league = this.globalService.loggedInUser.league_id;

                // use league id to retrieve associated teams
                this.teamService.getTeamsByLeague(league)
                  .subscribe(response => {
                      this.globalService.teams = response.teams;
                      this.globalService.league = response.league;
                      this.globalService.nhl_teams = response.nhl_teams;

                      // match logged in user to their corresponding team
                      for (let team of this.globalService.teams) {
                        if (team.team_id === this.globalService.loggedInUser?.team_managed) {
                          this.globalService.loggedInTeam = team;
                          console.log('Matched ' + this.globalService.loggedInUser.user_name + ' to ' + this.globalService.loggedInTeam.team_name);

                          // initialize cap space & contract variables for logged in team
                          this.globalService.updateTeamCap(this.globalService.loggedInTeam);
                        }
                      }

                      // redirect logged in user to main app
                      this.router.navigate(['/' + league + '/home']);
                  });
              }
            })
        }
      })
      .catch((error) => {
        this.loginError = true;
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
        if (this.globalService.loggedInUser) {
          this.globalService.recordSession(this.globalService.loggedInUser.user_name, 'logout');
        }
        this.globalService.loggedInUser = null;
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  }

  createAccount() {
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Registration successful:', user);

        this.signIn();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Registration failed:', errorCode, errorMessage);
      });
  }

  resetPassword() {
    const auth = getAuth();
  
    if (!this.email) {
      console.error('Please enter your email address.');
      return;
    }
    
    sendPasswordResetEmail(auth, this.email)
      .then(() => {
        console.log('Password reset email sent.');
        alert('Password reset email sent. Please check your inbox & junk folder.');
        this.closeModal()
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error sending password reset email:', errorCode, errorMessage);
        alert('Error sending password reset email: ' + errorMessage);
      });
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalRef.hide();
  }
  

}
