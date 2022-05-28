import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry } from 'rxjs';
import { PurchaseProduct } from 'src/app/entities/purchaseproduct';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseProductsService extends ApiService {
  override apiURL = 'https://localhost:7123/api/v1/PurchaseProducts/';
  override httpOptions = {
    headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.auth_service.getToken()}`
    }),
  };

  constructor(protected http: HttpClient, private auth_service: AuthService) {
    super();
  }

  createPurchaseProduct(purchase_product: PurchaseProduct): Observable<PurchaseProduct> {
    return this.http
      .post<PurchaseProduct>(
        this.apiURL,
        JSON.stringify(purchase_product),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }
}
