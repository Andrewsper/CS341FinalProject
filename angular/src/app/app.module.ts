import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestService } from './services/test.service';
import { YmcaHeaderComponent } from './ymca-header/ymca-header.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from './services/user.service';
import { AuthGuard } from './guards/auth-guard';
import { StaffGuard } from './guards/staff-guard';
import { UserHomePageComponent } from './user-home-page/user-home-page.component';
import { StaffHomePageComponent } from './staff-home-page/staff-home-page.component';
import { ProgramsComponent } from './programs/programs.component';
import { ProgramService } from './services/program.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProgramModalComponent } from './program-modal/program-modal.component';



@NgModule({
  declarations: [
    AppComponent,
    YmcaHeaderComponent,
    LoginComponent,
    RegisterComponent,
    UserHomePageComponent,
    StaffHomePageComponent,
    ProgramsComponent,
    ProgramModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule
  ],
  providers: [HttpClientModule, TestService, UserService, AuthGuard, StaffGuard, ProgramService, MatDialog],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor() {}

}
