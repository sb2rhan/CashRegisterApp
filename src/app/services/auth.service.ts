import { Injectable } from '@angular/core';
import { catchError, retry } from 'rxjs';
import { isBefore } from 'date-fns';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiService {
  override apiURL = 'https://localhost:7123/api/v1/Authenticate/';

  static TOKEN_KEY: string = "token";
  static EXPIRATION: string = "expires_at";
  static USER_ID: string = "user_id";

  constructor(protected http: HttpClient) {
    super();
  }

  login(username: string, password: string) {
    return this.http.post(
      this.apiURL + "login",
      JSON.stringify({ "username": username, "password": password }),
      this.httpOptions
    ).pipe(retry(1), catchError(this.handleError));
  }

  setSession(token: string, expiration: string, user_id: string) {
    localStorage.setItem(AuthService.TOKEN_KEY, token);
    localStorage.setItem(AuthService.EXPIRATION, expiration);
    localStorage.setItem(AuthService.USER_ID, user_id);
  }

  logout() {
    localStorage.removeItem(AuthService.TOKEN_KEY);
    localStorage.removeItem(AuthService.EXPIRATION);
    localStorage.removeItem(AuthService.USER_ID);
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

  getToken() {
    return localStorage.getItem(AuthService.TOKEN_KEY);
  }

  getUserId() {
    return localStorage.getItem(AuthService.USER_ID);
  }
}
