import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { TeamRosterComponent } from './components/team-roster/team-roster.component';
import { PlayerDatabaseComponent } from './components/player-database/player-database.component';
import { LeagueActivityComponent } from './components/league-activity/league-activity.component';
import { RulesComponent } from './components/rules/rules.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TeamRosterComponent,
    PlayerDatabaseComponent,
    LeagueActivityComponent,
    RulesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ModalModule,
    HttpClientModule,
  ],
  providers: [ 
    BsModalService,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }