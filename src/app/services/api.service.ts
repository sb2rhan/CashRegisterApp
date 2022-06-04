import { HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';

export class ApiService {

  protected apiURL = 'https://storesystemapi20220603185433.azurewebsites.net/api/v1/';
  
  protected httpOptions = {
    headers: new HttpHeaders({
    'Content-Type': 'application/json'
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
