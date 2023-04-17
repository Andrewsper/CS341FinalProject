import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { YmcaHeaderComponent } from './ymca-header/ymca-header.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from './services/user.service';
import { AuthGuard } from './guards/auth-guard';
import { StaffGuard } from './guards/staff-guard';
import { UserHomePageComponent } from './user-home-page/user-home-page.component';
import { ProgramsComponent } from './programs/programs.component';
import { ProgramService } from './services/program.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProgramModalComponent } from './program-modal/program-modal.component';
import { YmcaModalComponent } from './ymca-modal/ymca-modal.component';
import { ModalService } from './services/modal.service';
import { AddProgramComponent } from './add-program/add-program.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { Convert24To12Pipe } from './pipes/time-pipe.pipe';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationService } from './services/notification.service';



@NgModule({
  declarations: [
    AppComponent,
    YmcaHeaderComponent,
    LoginComponent,
    RegisterComponent,
    UserHomePageComponent,
    ProgramsComponent,
    ProgramModalComponent,
    YmcaModalComponent,
    AddProgramComponent,
    ManageUsersComponent,
    Convert24To12Pipe,
    NotificationsComponent
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
  providers: [HttpClientModule, UserService, AuthGuard, StaffGuard, ProgramService, MatDialog, ModalService, NotificationService],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor() {}

}
