import { Injectable } from '@angular/core';
import { User } from '../User';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  curUser?: User;

  constructor() { 
    //Test user

    //this.curUser = new User("Bob","Johnson",0,false,false,"Bobj123","foobar",[],[]);
  }

  isLoggedIn(): User | undefined{
    return this.curUser;
  }
}
