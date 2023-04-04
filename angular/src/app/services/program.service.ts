import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Program } from '../models/ProgramModel';
import { ModalService } from './modal.service';
@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  curUser = JSON.parse(sessionStorage.getItem('user') as string) as User;
  // programsEndpoint = 'http://0.0.0.0:5000/programs';
  // programEndpoint = 'http://0.0.0.0:5000/program/';
  // signUpEndpoint = 'http://0.0.0.0:5000/program';

  //test endpoints
  programsEndpoint = 'http://127.0.0.1:9090/programs';
  programEndpoint = 'http://127.0.0.1:9090/program/';
  signUpEndpoint = 'http://127.0.0.1:9090/program';

  constructor(private http: HttpClient, private router: Router, private modalService: ModalService
  ) {
  
  }

  getAllPrograms(): Observable<Program[]> {
    return this.http.get<Program[]>(this.programsEndpoint);
  }

  getProgram(programID: number): Observable<Program> {
    return this.http.get<Program>(this.programEndpoint + programID);

  }

  signUp(programID: number, numRegistered: number) { 
    this.http.post<any>(this.signUpEndpoint+"/"+programID+"/"+this.curUser.userid+"/"+numRegistered,{}).subscribe();
  }

  updateRegistration(programID: number, numRegistered: number): boolean {
    let success = true;
    this.http.put<any>(this.signUpEndpoint+"/"+programID+"/"+this.curUser.userid+"/"+numRegistered,{})
    .pipe(
      catchError((err) => this.handleError(err))
    ).subscribe();
    return success;
  }

  addProgram( p :Program){
    this.http.post(this.programsEndpoint,p).subscribe()
  }

  handleError(err: HttpErrorResponse){
    if(err.status == 400) {
      this.modalService.showModal("Registration exceeded program capacity", "Error #0001");
    }
    return throwError(() => new Error("Something went wrong please try again"));
  }
  
}
