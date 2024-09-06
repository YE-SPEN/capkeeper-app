import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TeamRosterComponent } from './components/team-roster/team-roster.component';
import { LoginComponent } from './components/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet,
    SidebarComponent,
    LoginComponent,
    TeamRosterComponent,
  ]

})
export class AppComponent {
  title = 'capkeeper-app';
}
