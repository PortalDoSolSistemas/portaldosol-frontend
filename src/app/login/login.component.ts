import { Component, OnInit } from '@angular/core';
import { PoPageLoginLiterals } from '@po-ui/ng-templates';
import { Router } from "@angular/router";
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  background: string;
  private readonly LOGIN_BACKGROUND = [
    'encomendas.jpg',
    'encomendas2.jpg',
  ];
  literals: PoPageLoginLiterals  = {
    welcome: 'Bem-vindo',
  }
  errorMsg = null;

  constructor(private router: Router, private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.createOrNotDefaultUser();
    this.setBackgroundImage();
    this.authService.emitError
      .subscribe((error: string) => {
        this.sendError(error);
      });
  }

  login(event: any): void {
    this.authService.auth({email: event.login, password: event.password});
  }

  setBackgroundImage(): void {
    const randomIndex = Math.floor(
      Math.random() * this.LOGIN_BACKGROUND.length
    );
    this.background = `assets/background/${this.LOGIN_BACKGROUND[randomIndex]}`;
  }

  sendError(error: string): void {
    this.errorMsg = error;
    setTimeout(_ => {
      this.errorMsg = null;
    }, 6000)
  }

  createOrNotDefaultUser() {
    console.log('caiu no createOrNOtDefaultUser');
    this.userService.createOrNotDefaultUser()
      .subscribe();
  }

}
