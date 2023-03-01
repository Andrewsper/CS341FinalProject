import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Program } from '../models/ProgramModel';
@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  curUser = JSON.parse(sessionStorage.getItem('user') as string) as User;
  // programsEndpoint = 'http://0.0.0.0:5000/programs';
  // programEndpoint = 'http://0.0.0.0:5000/program?id=';
  // signUpEndpoint = 'http://0.0.0.0:5000/program';

  //test endpoints
  programsEndpoint = 'http://127.0.0.1:9090/programs';
  programEndpoint = 'http://127.0.0.1:9090/program?id=';
  signUpEndpoint = 'http://127.0.0.1:9090/program';

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
    this.http.post<any>(this.signUpEndpoint, {userID: this.curUser.userid, programID: programID}).subscribe();
  }

  cancelRegistration(programID: number): boolean {
    let success = true;
    let params = new HttpParams();
    params = params.append('userID', this.curUser.userid as string);
    params = params.append('programID', programID.toString());
    this.http.delete<any>(this.signUpEndpoint, {params: params}).subscribe();
    return success;
  }
  
}
