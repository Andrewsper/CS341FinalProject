import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { LoginModel } from '../models/LoginModel';
import { RegisterModel } from '../models/RegisterModel';
import { UserService } from './user.service';
import { User } from '../models/User';

@Injectable()
export class LoginService {
    loginEndpoint = 'http://127.0.0.1:9090/login';
    registerEndpoint = 'http://0.0.0.0:5000/database/add/user';


    constructor(
        private http: HttpClient,
        private userService : UserService
        
    ) { }

    validateLogin(loginModel: LoginModel) {
        const options = {headers: {'Content-Type': 'application/json'}};
        let response = this.http.post<User>(this.loginEndpoint, JSON.stringify(loginModel), options).subscribe((user)=>{
            this.userService.setCurrentUser(user);
        });

    }

    register(registerModel: RegisterModel) {
        const options = {headers: {'Content-Type': 'application/json'}};
        let response = this.http.post(this.registerEndpoint, JSON.stringify(registerModel), options);
        return new Promise((resolve) => {
            response.subscribe((data) => { resolve(data) });
        });
    }
}