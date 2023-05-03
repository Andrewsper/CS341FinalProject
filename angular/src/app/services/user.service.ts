
/**
 * This service communicates with the user api

Author: Will, Andrew

Date Modified: 2023-04-25
 */
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

  loginEndpoint = 'http://127.0.0.1:9090/login';
  logoutEndpoint = 'http://127.0.0.1:9090/logout';
  registerEndpoint = 'http://127.0.0.1:9090/register';
  userProgramsEndpoint = 'http://127.0.0.1:9090/programs';
  usersEndpoint = 'http://127.0.0.1:9090/users';



  constructor(private http: HttpClient, private router: Router, private modalService: ModalService, private programService: ProgramService) { }


  //send a login request to the api with the loginInfo param info
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
  //handels api error responses
  handleError(err: HttpErrorResponse){
    if (err.status === 401) {
      this.modalService.showModal("Invalid login please try again", "Login Failed");
    } else if (err.status !== 400){
      this.modalService.showModal("Something went wrong please try again", "Login Failed");
    }
    return throwError(() => new Error("Something went wrong please try again"));
  }

  //send a register request to the api with the registerInfo param info

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

  //gets all of the user info from the api
  getAllUsers() : Observable<User[]> {
    return this.http.get<User[]>(this.usersEndpoint);
  }

  //sends a request to the api to toggle the member status of the user with the same user id as the param
  toggleMembership(uid : String){
    return this.http.put(this.usersEndpoint+'/'+uid+ "/member",{});
  }
  //sends a request to the api to toggle the active status of the user with the same user id as the param

  toggleActive(uid : String){
    return this.http.put(this.usersEndpoint+'/'+uid+ "/active",{});
  }
  //sends a request to the api to toggle the staff status of the user with the same user id as the param

  toggleStaff(uid : String){
    return this.http.put(this.usersEndpoint+'/'+uid+ "/staff",{});
  }

  //checks to see if the current member is a member
  isMember(): boolean {
    var user = JSON.parse(sessionStorage.getItem('user') as string);
    return user ? user.isMember : false;
  }

  //sets the current user to the paramter user info
  setUser(user : User){
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  //updates family member programs via api call
  async updateFamilyMemberPrograms() {
    var user = JSON.parse(sessionStorage.getItem('user') as string);
    if (user) {
      this.http.get<Program[]>(this.userProgramsEndpoint+'/family/'+user.userid).subscribe(
        (fam) => {
          user.Family = fam;
          this.setUser(user);
      });
    }
    this.curUser = user;
  }

//sends a logout request ot the api and removes user data from the session storage
  logout() {
    sessionStorage.removeItem('user');
    this.curUser = new User("","");
    this.http.post(this.logoutEndpoint, null).subscribe()
    this.router.navigate(["/login"]);
  }

  //gets the first name of the current user
  getFirstName():String | undefined{
    return sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string).firstName : undefined;
  }

  //checks to see if there is a user logged in 
  isLoggedIn(): boolean {
    if (JSON.parse(sessionStorage.getItem('user') as string) as User) {
      return true;
    }
    return false;
  }
  //checks to see if the current user is a staff
  isStaff(): boolean {
    var user = JSON.parse(sessionStorage.getItem('user') as string);
    return user ? user.isStaff : false;
  }

  //gets the relation table of the current user and their programs
  getUserProgramsRel(): number[][] | undefined{
    this.curUser = JSON.parse(sessionStorage.getItem('user') as string) as User;

    if (!this.curUser) {
      return undefined;
    }

    this.http.get<number[][]>(this.userProgramsEndpoint+'/relation/'+this.curUser.userid).subscribe(
      (programs) => {
        this.curUser.classesTaken = programs;
        this.setUser(this.curUser);
    });
    return this.curUser.classesTaken;
  }

  //gets all of the programs the user with userId has signed up for
  getUserPrograms(userId : String){
    return this.http.get<Program[]>(this.userProgramsEndpoint+'/'+userId);
  }

  //gets the ammount of users signed up for a program
  getNumRegistered(programID: number): number {
    var user = JSON.parse(sessionStorage.getItem('user') as string);
    if (user) {
      var program = this.curUser.classesTaken?.find((program) => program[0] === programID);
      if (program) {
        return program[1];
      }
    }
    this.setUser(user);
    this.curUser = user;
    return 0;
  }
}
