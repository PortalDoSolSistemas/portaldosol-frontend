import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Promise(resolve => {
      this.auth.validateToken()
        .subscribe((res: boolean) => {
          if (res) {
            this.auth.emitUserLoged.emit({
              name: window.localStorage.getItem('userName') || true,
              isAdmin: window.localStorage.getItem('userIsAdmin')
            });
            resolve(true);
          } else {
            this.router.navigate(['/login']);
            resolve(false);
          }
        })
    })
  }

}
