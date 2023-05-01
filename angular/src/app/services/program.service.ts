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

  signUp(programID: number, userID: number) { 
    this.http.post<any>(this.signUpEndpoint+"/"+programID+"/"+userID+"/"+"1",{})
    .pipe(
      catchError((err) => this.handleError(err))
    ).subscribe();
  }

  // This code updates the registration of the current user for a specified program
  // The programID is the id of the program
  // The numRegistered is the number of people currently registered for the program
  // The function returns true if the registration was successfully updated
  // The function returns false if the registration was not successfully updated

  updateRegistration(programID: number, userID: number): boolean {
    console.log(this.getCurUser().userid);

    let success = true;
    this.http.put<any>(this.signUpEndpoint+"/"+programID+"/"+userID+"/"+"1",{})
    .pipe(
      catchError((err) => this.handleError(err))
    ).subscribe();
    return success;
  }

  addProgram( p :Program){
    this.http.post<Program>(this.programsEndpoint,p).subscribe();
  }

  removeProgram(programID: Number) {
    this.http.delete(this.programEndpoint + programID).pipe(
      catchError((err) => this.handleError(err))
    ).subscribe();
  }

  handleError(err: HttpErrorResponse){
    if(err.status == 400 || err.status == 409) {
      this.modalService.showModal("Registration exceeded program capacity", "Error #0001");
    }
    if(err.status == 410) {
        this.modalService.showModal("Registration conflict", "Error #0003");
    }
    return throwError(() => new Error("Something went wrong please try again"));
  }

  //This function is necessary as cur user will change each login 
  private getCurUser(): User{
    return JSON.parse(sessionStorage.getItem('user') as string) as User;
  }
  
}
