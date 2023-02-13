import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RegisterModel } from '../models/RegisterModel';
import { UserService } from './user.service';
import { User } from '../models/User';

@Injectable()
export class LoginService {
    loginEndpoint = 'http://0.0.0.0:5000/login';
    registerEndpoint = 'http://0.0.0.0:5000/database/add/user';


    constructor(
        private http: HttpClient,
        private userService : UserService
        
    ) { }




}