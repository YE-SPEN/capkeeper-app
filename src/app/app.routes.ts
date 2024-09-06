import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TeamRosterComponent } from './components/team-roster/team-roster.component';
import { LoginComponent } from './components/login/login.component';
//import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
//import { AngularFireModule } from '@angular/fire';
//import { AngularFireAuthModule } from '@angular/fire/auth';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'roster', component: TeamRosterComponent },
];