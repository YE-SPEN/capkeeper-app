import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { TeamRosterComponent } from './components/team-roster/team-roster.component';
import { PlayerDatabaseComponent } from './components/player-database/player-database.component';
import { LeagueActivityComponent } from './components/league-activity/league-activity.component';
import { RulesComponent } from './components/rules/rules.component';
import { HomeComponent } from './components/home/home.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { TradeProposalComponent } from './components/trade-proposal/trade-proposal.component';
import { TradeReviewComponent } from './components/trade-review/trade-review.component';
import { ToastComponent } from './components/toast/toast.component';
import { TradeAssetPipe } from './pipes/trade-assets.pipe';
import { DraftComponent } from './components/draft/draft.component';
import { ProtectionSheetComponent } from './components/protection-sheet/protection-sheet.component';
import { CommissionerHubComponent } from './components/commissioner-hub/commissioner-hub.component';
import { DraftOrderPipe } from './pipes/draft-order-pipe';
import { CommissionerHubTabsComponent } from './components/commissioner-hub-tabs/commissioner-hub-tabs.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    TeamRosterComponent,
    PlayerDatabaseComponent,
    LeagueActivityComponent,
    RulesComponent,
    UserProfileComponent,
    TradeProposalComponent,
    TradeReviewComponent,
    ToastComponent,
    TradeAssetPipe,
    DraftOrderPipe, 
    DraftComponent,
    ProtectionSheetComponent,
    CommissionerHubComponent,
    CommissionerHubTabsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ModalModule,
    NgIdleKeepaliveModule.forRoot(),
    HttpClientModule,
  ],
  exports: [
    ToastComponent
  ],
  providers: [ 
    BsModalService,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }