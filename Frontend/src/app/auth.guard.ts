import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Observable, from, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return from(this.authService.waitUntilAuthCheck()).pipe(
      switchMap(() => {
        return this.authService.isAuthenticated$.pipe(
          take(1),
          switchMap((isAuthenticated) => {
            if (!isAuthenticated) {
              console.log('User is not authenticated. Redirecting to login.');
              this.router.navigate(['/']);
              // this.router.navigate(['/login']);
              return of(false);
            }

            return this.authService.getCurrentUser().pipe(
              switchMap((user: firebase.User | null) => {
                if (!user) {
                  console.log('No user found. Redirecting to login.');
                  this.router.navigate(['/']);
                  // this.router.navigate(['/login']);
                  return of(false);
                }

                const uid = user.uid;
                return this.authService.checkSuperAdmin(uid);
              }),
              map((isSuperAdmin) => {
                console.log(route.data);
                if (!isSuperAdmin) {
                  if (route.data['title'] === 'Admins') {
                    console.log(
                      'User is not a super admin. Redirecting to home.'
                    );
                    this.router.navigate(['/']);
                    return false;
                  }
                }

                return true;
              })
            );
          })
        );
      })
    );
  }
}
