import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  curUser?: User;
  loginEndpoint = 'http://0.0.0.0:5000/login';
  registerEndpoint = 'http://0.0.0.0:5000/register';


  constructor(        private http: HttpClient,
    ) { 
    //Test user

    //this.curUser = new User("Bob","Johnson",0,false,false,"Bobj123","foobar",[],[]);
  }
  validateLogin(loginInfo: User) {
    const options = {headers: {'Content-Type': 'application/json'}};
    let response = this.http.post<User>(this.loginEndpoint, JSON.stringify(loginInfo), options).subscribe((user)=>{
        this.setCurrentUser(user);
    });

}

  setCurrentUser(user : User){
    this.curUser = user;
  }

  isLoggedIn(): User | undefined{
    return this.curUser;
  }
}
