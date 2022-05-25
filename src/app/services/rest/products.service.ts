import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry } from 'rxjs';
import { Product } from 'src/app/entities/product';
import { RestApiService } from '../rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends RestApiService {
  override apiURL = 'https://localhost:7123/api/v1/Products/';

  constructor(protected http: HttpClient) {
    super();
  }

  getProducts(): Observable<Product> {
    return this.http
      .get<Product>(this.apiURL)
      .pipe(retry(1), catchError(this.handleError));
  }

  getProduct(id: string): Observable<Product> {
    return this.http
      .get<Product>(this.apiURL + id)
      .pipe(retry(1), catchError(this.handleError));
  }
}
