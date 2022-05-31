import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { LoaderService } from './services/ui/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isLogged: boolean = false;
  username: string = "";

  constructor(public authService: AuthService,
    public loaderService: LoaderService,
    public router: Router)
  {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd)
        if (val.url.includes("workspace")) {
          this.isLogged = true;
          this.username = authService.getUsername() ?? "";
        } else {
          this.isLogged = false;
        }
    });
  }

  ngOnInit() {
    this.isLogged = this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
  }
}
