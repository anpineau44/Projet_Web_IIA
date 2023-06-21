import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { TokenService } from './token.service';
import { NavbarComponent } from './navbar/navbar.component';
import { ExtractComponent } from './extract/extract.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NotifierModule } from 'angular-notifier';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ForgotPasswordTokenComponent } from './forgot-password-token/forgot-password-token.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    ExtractComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
    ForgotPasswordTokenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    NotifierModule
  ],
  providers: [TokenService],
  bootstrap: [AppComponent]
})
export class AppModule { }
