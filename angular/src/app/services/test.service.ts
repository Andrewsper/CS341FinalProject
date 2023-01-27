import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TestService {
    testUrl = 'http://0.0.0.0:5000/test';

    constructor(
        private http: HttpClient
    ) { }

    getWord(): Observable<string> {
        return this.http.get(this.testUrl,{responseType:'text'});
    }
}