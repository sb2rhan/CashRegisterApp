import { Injectable } from '@angular/core';
import { catchError, retry } from 'rxjs';
import { isBefore } from 'date-fns';
import { RestApiService } from './rest-api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends RestApiService {
  override apiURL = 'https://localhost:7123/api/v1/Authenticate/';

  static TOKEN_KEY: string = "token";
  static EXPIRATION: string = "expires_at";

  constructor(protected http: HttpClient) {
    super();
  }

  login(username: string, password: string) {
    debugger;
    return this.http.post(
      this.apiURL + "login",
      JSON.stringify({ "username": username, "password": password }),
      this.httpOptions
    ).pipe(retry(1), catchError(this.handleError));
  }

  setSession(token: string, expiration: string) {
    localStorage.setItem(AuthService.TOKEN_KEY, token);
    localStorage.setItem(AuthService.EXPIRATION, expiration);
  }

  logout() {
    localStorage.removeItem(AuthService.TOKEN_KEY);
    localStorage.removeItem(AuthService.EXPIRATION);
  }

  isLoggedIn() {
    const expires_at = this.getExpiration();
    if (expires_at == null) {
      return false;
    }
    return isBefore(new Date(), expires_at);
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem(AuthService.EXPIRATION);
    if (expiration == null) return null;
    return new Date(expiration);
  }
}
