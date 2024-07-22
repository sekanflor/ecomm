import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private baseURL = 'http://localhost/shopfyAPI/shopfyAPI/api';

  constructor(private http: HttpClient) { }

  userLogin(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/login`, data)
      .pipe(
        tap(response => {
          console.log('userLogin response:', response);
        }),
        catchError(this.handleError)
      );
  }

  userSignUp(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/signup`, data)
      .pipe(
        tap(response => {
          console.log('userSignUp response:', response);
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error occurred.
      console.error('An error occurred:', error.error.message);
    } else {
      // Backend returned an unsuccessful response code.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
}
