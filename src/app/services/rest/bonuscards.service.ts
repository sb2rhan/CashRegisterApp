import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry } from 'rxjs';
import { BonusCard } from 'src/app/entities/bonuscard';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class BonusCardsService extends ApiService {
  override httpOptions = {
    headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.auth_service.getToken()}`
    }),
  };

  constructor(protected http: HttpClient, private auth_service: AuthService) {
    super();
    this.apiURL = this.apiURL + 'BonusCards/';
  }

  getBonusCard(id: string) {
    return this.http
      .get<BonusCard>(this.apiURL + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

}
