import { Component, OnInit } from '@angular/core';
import { TeamService } from './services/team.service';
import { GlobalService } from './services/global.service';
import { getAuth, onAuthStateChanged, User, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'capkeeper-app';
  user: User | null = null;

  constructor(
    private teamService: TeamService,
    public globalService: GlobalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const auth = getAuth();

    // Set persistence to keep user signed in after refresh
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        onAuthStateChanged(auth, (user) => {
          this.globalService.loading = true;

          if (user) {
            // User is signed in, retrieve session data
            this.user = user;

            this.globalService.openSession(user.email!).subscribe((response) => {
              this.globalService.loggedInUser = response.userInfo[0];
              this.globalService.loading = false;

              if (this.globalService.loggedInUser) {
                const leagueId = this.globalService.loggedInUser?.league_id;

                if (leagueId) {
                  this.globalService.initializeLeague(leagueId, this.router.url);
                } else {
                  console.error('League ID not found for user');
                  this.router.navigate(['/login']);
                }
              }
            });
          } else {
            this.user = null;
            this.globalService.loggedInUser = null;
            this.globalService.loading = false;

            this.router.navigate(['/login']);
          }
        });
      })
      .catch((error) => {
        console.error('Error setting persistence:', error);
        this.globalService.loading = false;
      });
  }
  
}
