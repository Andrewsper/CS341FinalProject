import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, ObservableInput, catchError, throwError } from 'rxjs';
import { Program } from '../models/ProgramModel';
@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  curUser = JSON.parse(sessionStorage.getItem('user') as string) as User;
  programsEndpoint = 'http://0.0.0.0:5000/programs';
  programEndpoint = 'http://0.0.0.0:5000/program?id=';
  signUpEndpoint = 'http://0.0.0.0:5000/signup';


  constructor(private http: HttpClient, private router: Router
  ) {
  
  }

  getAllPrograms(): Observable<Program[]> {
    return this.http.get<Program[]>(this.programsEndpoint);
  }

  getProgram(programID: number): Observable<Program> {
    return this.http.get<Program>(this.programEndpoint + programID);
  }

  signUp(programID: number) {
    let ProgramSignupModel = {
      programID: programID,
      userID: this.curUser.userid
    };
    this.http.post<any>(this.signUpEndpoint, ProgramSignupModel).subscribe();
  }





}
