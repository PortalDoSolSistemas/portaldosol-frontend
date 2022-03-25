import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PoNavbarIconAction, PoNavbarItem } from '@po-ui/ng-components';
import { AuthService } from './services/auth/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HTTPStatus } from './services/http.intercept';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'mail-app';
  showNavbar = false;
  userName = '';

  items: PoNavbarItem[];

  actions: PoNavbarIconAction[] = [
    { label: 'logout', icon: 'po-icon-exit', action: this.logout.bind(this), tooltip: 'Logout' }
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    private httpStatus: HTTPStatus,
    private spinner: NgxSpinnerService,
  ) {
    this.httpStatus.getHttpStatus().subscribe((status: boolean) => {
      if (status) {
        spinner.show();
      }
      else {
        spinner.hide();
      }
    });
  }

  ngOnInit(): void {
    this.auth.emitUserLoged
      .subscribe(user => {
        this.userName = user.name;
        this.showNavbar = !!user.name;
        if (user.isAdmin == 'true') {
          this.items = [
            { label: 'Encomendas', action: () => this.router.navigate(['main/parcels']) },
            { label: 'Moradores', action: () => this.router.navigate(['main/residents']) },
            { label: 'Usuários', action: () => this.router.navigate(['users']) }
          ];
        } else {
          this.items = [
            { label: 'Encomendas', action: () => this.router.navigate(['main/parcels']) },
            { label: 'Moradores', action: () => this.router.navigate(['main/residents']) },
          ];
        }
      });
  }

  logout() {
    this.auth.logout();
  }



}


