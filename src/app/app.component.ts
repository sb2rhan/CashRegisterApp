import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { LoaderService } from './services/ui/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isLogged: boolean = false;

  constructor(public auth_service: AuthService,
    public loaderService: LoaderService) {}

  ngOnInit() {
    this.isLogged = this.auth_service.isLoggedIn();
  }

  logout($event: any) {
    this.auth_service.logout();
  }
}
