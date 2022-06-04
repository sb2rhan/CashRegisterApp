import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry } from 'rxjs';
import { Purchase } from 'src/app/entities/purchase';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class PurchasesService extends ApiService {
  override httpOptions = {
    headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.auth_service.getToken()}`
    }),
  };

  constructor(protected http: HttpClient, private auth_service: AuthService) {
    super();
    this.apiURL = this.apiURL + 'Purchases/';
  }

  getPurchases(): Observable<Purchase> {
    return this.http
      .get<Purchase>(this.apiURL)
      .pipe(retry(1), catchError(this.handleError));
  }

  getPurchase(id: string): Observable<Purchase> {
    return this.http
      .get<Purchase>(this.apiURL + id)
      .pipe(retry(1), catchError(this.handleError));
  }

  createPurchase(purchase: Purchase): Observable<Purchase> {
    return this.http
      .post<Purchase>(
        this.apiURL,
        JSON.stringify(purchase),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }
}
