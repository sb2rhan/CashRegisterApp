import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry } from 'rxjs';
import { Purchase } from 'src/app/entities/purchase';
import { RestApiService } from '../rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class PurchasesService extends RestApiService {
  override apiURL = 'https://localhost:7123/api/v1/Purchases/';

  constructor(protected http: HttpClient) {
    super();
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
