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


  constructor(private http: HttpClient, private router: Router
  ) {
  
  }

  getAllPrograms(): Observable<Program[]> {
    return this.http.get<Program[]>(this.programsEndpoint);
  }





}
