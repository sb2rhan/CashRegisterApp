import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry, throwError } from 'rxjs';
import { isBefore } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiURL = 'https://localhost:7123/api/v1/Authenticate/';

  constructor(private http: HttpClient) { }
    httpOptions = {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  login(username: string, password: string) {
    return this.http.post(
      this.apiURL + "login",
      JSON.stringify({ "username": username, "password": password }),
      this.httpOptions
    ).pipe(retry(1), catchError(this.handleError));
  }

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }

  setSession(token: string, expiration: string) {
    localStorage.setItem('id_token', token);
    localStorage.setItem("expires_at", expiration);
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
  }

  isLoggedIn() {
    return isBefore(new Date(), this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration ?? "");
    return new Date(expiresAt);
  }    
}
