import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs';
import { API } from 'src/app/api/api-config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = API;
  
  constructor(private http: HttpClient, private router: Router) { }

  emitUserLoged = new EventEmitter<any>();
  emitError = new EventEmitter();

  auth(data: any): void {
    this.http.post(`${this.api}/signin`, data)
    .subscribe(
      res => {
        window.localStorage.setItem('token', res['token']);
        window.localStorage.setItem('userName', res['name']);
        window.localStorage.setItem('userIsAdmin', res['admin']);
        window.localStorage.setItem('userId', res['id']);
        this.router.navigate(['/main']);
      },
      err => {
        this.emitError.emit(err.error);
      }
    )
  }

  validateToken(): Observable<any> {
     const token = window.localStorage.getItem('token');
     return this.http.post(`${this.api}/validateToken`, {token: token});
  }

  logout(): void {
    window.localStorage.clear();
    this.emitUserLoged.emit(false);
    this.router.navigate(['/login']);
  }
}
