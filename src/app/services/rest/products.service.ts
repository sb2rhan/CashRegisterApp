import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry } from 'rxjs';
import { Product } from 'src/app/entities/product';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends ApiService {
  override apiURL = 'https://localhost:7123/api/v1/Products/';
  override httpOptions = {
    headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.auth_service.getToken()}`
    }),
  };

  constructor(protected http: HttpClient, private auth_service: AuthService) {
    super();
  }

  getProducts(): Observable<Product> {
    return this.http
      .get<Product>(this.apiURL, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  getProduct(id: string): Observable<Product> {
    return this.http
      .get<Product>(this.apiURL + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  getProductByBarcode(barcode: string): Observable<Product> {
    return this.http
      .get<Product>(this.apiURL + 'barcode/' + barcode, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
}
