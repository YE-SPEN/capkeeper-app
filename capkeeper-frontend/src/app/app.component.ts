import { Component } from '@angular/core';
import { routes } from './app.routes';
import { CommonModule } from '@angular/common'; // For common directives like ngIf, ngFor
import { RouterModule, RouterOutlet } from '@angular/router'; // For routing
import { FormsModule } from '@angular/forms'; // For template-driven forms
import { HttpClientModule } from '@angular/common/http'; // For making HTTP requests
import { ModalModule } from 'ngx-bootstrap/modal'; // Modal component for pop-ups
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TeamRosterComponent } from './components/team-roster/team-roster.component';
import { LoginComponent } from './components/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes), 
    FormsModule,    
    RouterOutlet,   
    HttpClientModule, 
    ModalModule.forRoot(), 
    SidebarComponent,
    LoginComponent,
    TeamRosterComponent,
  ],
  providers: [BsModalService] // Modal service for handling modal instances
})
export class AppComponent {
  title = 'capkeeper-app';
}
