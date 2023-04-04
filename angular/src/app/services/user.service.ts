import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, ObservableInput, catchError, tap, throwError } from 'rxjs';
import { Program } from '../models/ProgramModel';
import { ProgramService } from './program.service';
import { ModalService } from './modal.service';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  curUser = JSON.parse(sessionStorage.getItem('user') as string) as User;
  // loginEndpoint = 'http://0.0.0.0:5000/login';
  // logoutEndpoint = 'http://0.0.0.0:5000/logout';
  // registerEndpoint = 'http://0.0.0.0:5000/register';
  // userProgramsEndpoint = 'http://127.0.0.1:5000/programs';
  // usersEndpoint = 'http://127.0.0.1:5000/users';
  //Leave in for people who cant get docker working
  loginEndpoint = 'http://127.0.0.1:9090/login';
  logoutEndpoint = 'http://127.0.0.1:9090/logout';
  registerEndpoint = 'http://127.0.0.1:9090/register';
  userProgramsEndpoint = 'http://127.0.0.1:9090/programs';
  usersEndpoint = 'http://127.0.0.1:9090/users';



  constructor(private http: HttpClient, private router: Router, private modalService: ModalService, private programService: ProgramService) { }


  validateLogin(loginInfo?: User) {
    //If the session already has a user saved set it to the current user to it
    if (!sessionStorage.getItem('user')) {
      {
        const options = { headers: { 'Content-Type': 'application/json' } };
        this.http.post<User>(this.loginEndpoint, JSON.stringify(loginInfo), options)
        .pipe(
          catchError((err) => this.handleError(err))
        ).subscribe((user) => {
            this.setUser(user);
            this.router.navigate(["/"])
        });
      }
    }
    else {
      this.router.navigate(["/"]);
    }
  }

  handleError(err: HttpErrorResponse){
    if (err.status === 401) {
      this.modalService.showModal("Invalid login please try again", "Login Failed");
    } else if (err.status !== 400){
      this.modalService.showModal("Something went wrong please try again", "Login Failed");
    }
    return throwError(() => new Error("Something went wrong please try again"));
  }


  registerUser(registerInfo: User) {
    const options = { headers: { 'Content-Type': 'application/json' } };
    let response = this.http.post<User>(this.registerEndpoint, JSON.stringify(registerInfo), options).subscribe((user) => {
      if (user) {
        //set the session storage to save the user
        this.setUser(user);
        this.router.navigate(["/"])
      } else {
        alert("Failed to register please try again");
      }
    });

  }

  getAllUsers() : Observable<User[]> {
    return this.http.get<User[]>(this.usersEndpoint);
  }

  toggleMembership(uid : String){
    return this.http.put(this.usersEndpoint+'/'+uid+ "/member",{});
  }

  toggleActive(uid : String){
    return this.http.put(this.usersEndpoint+'/'+uid+ "/active",{});
  }

  toggleStaff(uid : String){
    return this.http.put(this.usersEndpoint+'/'+uid+ "/staff",{});
  }

  isMember(): boolean {
    var user = JSON.parse(sessionStorage.getItem('user') as string);
    return user ? user.isMember : false;
  }

  setUser(user : User){
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  // getUser(): User | undefined{
  // }

  logout() {
    sessionStorage.removeItem('user');
    this.http.post(this.logoutEndpoint, null).subscribe()
    this.router.navigate(["/login"]);
  }


  getFirstName():String | undefined{
    return sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string).firstName : undefined;
  }

  isLoggedIn(): boolean {
    if (JSON.parse(sessionStorage.getItem('user') as string) as User) {
      return true;
    }
    return false;
  }

  isStaff(): boolean {
    var user = JSON.parse(sessionStorage.getItem('user') as string);
    return user ? user.isStaff : false;
  }

  getUserPrograms(): number[][] | undefined{
    this.curUser = JSON.parse(sessionStorage.getItem('user') as string) as User;
    this.http.get<number[][]>(this.userProgramsEndpoint+'/'+this.curUser.userid).subscribe(
      (programs) => {
        this.curUser.classesTaken = programs;
        this.setUser(this.curUser);
    });
    return this.curUser.classesTaken;
  }

  getNumRegistered(programID: number): number {
    var user = JSON.parse(sessionStorage.getItem('user') as string);
    if (user) {
      var program = this.curUser.classesTaken?.find((program) => program[0] === programID);
      if (program) {
        return program[1];
      }
    }
    return 0;
  }
}
