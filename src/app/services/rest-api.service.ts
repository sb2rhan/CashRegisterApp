import { HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';

export class RestApiService {

  apiURL = 'https://localhost:7123/api/v1';
  
  httpOptions = {
    headers: new HttpHeaders({
    'Content-Type': 'application/json',
    }),
  };

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
}
