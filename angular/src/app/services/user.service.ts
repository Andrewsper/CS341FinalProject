import { Injectable } from '@angular/core';
import { User } from '../models/User';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  curUser?: User;

  constructor() { 
    //Test user

    //this.curUser = new User("Bob","Johnson",0,false,false,"Bobj123","foobar",[],[]);
  }

  setCurrentUser(user : User){
    this.curUser = user;
  }

  isLoggedIn(): User | undefined{
    return this.curUser;
  }
}
