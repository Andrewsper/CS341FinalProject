import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  curUser = JSON.parse(sessionStorage.getItem('user') as string) as User;
  loginEndpoint = 'http://127.0.0.1:9090/login';
  logoutEndpoint = 'http://127.0.0.1:9090/logout';
  registerEndpoint = 'http://0.0.0.0:5000/register';


  constructor(private http: HttpClient, private router: Router
  ) {

  }
  validateLogin(loginInfo?: User) {
    console.log("HIT")
    //If the session already has a user saved set it to the current user to it
    if (!sessionStorage.getItem('user')) {
      {
        const options = { headers: { 'Content-Type': 'application/json' } };
        let response = this.http.post<User>(this.loginEndpoint, JSON.stringify(loginInfo), options).subscribe((user) => {
          if (user) {
            sessionStorage.setItem('user', JSON.stringify(user));
            this.router.navigate(["/"]);
          } else {
            alert("Invalid login please try again");
          }
        });
      }
    }
    else {
      this.router.navigate(["/"]);
    }
  }


  registerUser(registerInfo: User) {
    const options = { headers: { 'Content-Type': 'application/json' } };
    let response = this.http.post<User>(this.registerEndpoint, JSON.stringify(registerInfo), options).subscribe((user) => {
      if (user) {
        //set the session storage to save the user
        sessionStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(["/"])
      } else {
        alert("Failed to register please try again");
      }
    });

  }

  logout() {
    sessionStorage.removeItem('user');
    this.http.post(this.logoutEndpoint, null).subscribe()
  }


  getFirstName():String | undefined{
    return this.curUser.firstName;
  }

  isLoggedIn(): boolean {
    if (JSON.parse(sessionStorage.getItem('user') as string) as User) {
      return true;
    }
    return false;
  }
}
