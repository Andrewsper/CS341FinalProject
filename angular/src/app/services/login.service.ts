import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { LoginModel } from '../models/LoginModel';
import { RegisterModel } from '../models/RegisterModel';

@Injectable()
export class LoginService {
    loginEndpoint = 'http://0.0.0.0:5000/verifyLogin';
    registerEndpoint = 'http://0.0.0.0:5000/database/add/user';


    constructor(
        private http: HttpClient
        
    ) { }

    validateLogin(loginModel: LoginModel) {
        const options = {headers: {'Content-Type': 'application/json'}};
        let response = this.http.post(this.loginEndpoint, JSON.stringify(loginModel), options);
        return new Promise((resolve) => {
            response.subscribe((data) => { resolve(data) });
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