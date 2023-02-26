import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserHomePageComponent } from './user-home-page/user-home-page.component';
import { StaffHomePageComponent } from './staff-home-page/staff-home-page.component';
import { AuthGuard } from './guards/auth-guard';
import { StaffGuard } from './guards/staff-guard';
import { ProgramsComponent } from './programs/programs.component';


//note with routes, the order matters. The first route that matches will be used.
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'programs', component: ProgramsComponent, canActivate: [AuthGuard] },
  { path: '', component: UserHomePageComponent, canActivate: [AuthGuard] }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
