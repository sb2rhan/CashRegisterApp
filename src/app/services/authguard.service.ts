import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private auth_service: AuthService) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // not logged = redirect to login page
    if (this.auth_service.isLoggedOut() && state.url !== '/welcome') {
      this.router.navigate(['/welcome']);
      return false;
    }
    if (this.auth_service.isLoggedIn() && state.url === '/welcome') {
      this.router.navigate(['/workspace']);
      return false;
    }
    return true;
  }
}
