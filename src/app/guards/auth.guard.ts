import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return new Promise((resolve, reject) => {
      const isLoggedin = localStorage.getItem('isLoggedin');
      if (isLoggedin == 'true') {
        console.log('User is logged in');
        resolve(true);
      } else {
        console.log('User is not logged in');
        this.router.navigate(['/login']);
        resolve(false);
      }
    });
  }
}
