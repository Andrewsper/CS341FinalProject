import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, ObservableInput, catchError, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  curUser = JSON.parse(sessionStorage.getItem('user') as string) as User;
  // loginEndpoint = 'http://0.0.0.0:5000/login';
  // logoutEndpoint = 'http://0.0.0.0:5000/logout';
  // registerEndpoint = 'http://0.0.0.0:5000/register';
  
  //Leave in for people who cant get docker working
  loginEndpoint = 'http://127.0.01:9090/login';
  logoutEndpoint = 'http://127.0.01:9090/logout';
  registerEndpoint = 'http://127.0.01:9090/register';


  constructor(private http: HttpClient, private router: Router
  ) {
  
  }

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
            if(!user.isStaff){
              this.router.navigate(["/"]);
            } else {
              this.router.navigate(["/staff-home"]);
            }
        });
      }
    }
    else {
      this.router.navigate(["/"]);
    }
  }

  handleError(err: HttpErrorResponse){
    if (err.status === 401) {
      alert("Invalid login please try again");
    } else if (err.status !== 400){
      alert("Something went wrong please try again");
    }
    return throwError(() => new Error("Something went wrong please try "));
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
}
