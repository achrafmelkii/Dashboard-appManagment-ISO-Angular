// auth-interceptor.service.ts
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private messageService: MessageService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //console.log('Interceptor triggered');
    const idToken = localStorage.getItem('firebaseIdToken') || "";
    //const uuid = localStorage.getItem('uid') || "";
   // console.log('Token:', idToken);

    if (request.url.includes('/api/login') || request.url.includes('/api/register')) {
      return next.handle(request);
    }

    if (idToken) {
      const cloned = request.clone({
        setHeaders: {
          Authorization: `Bearer: ${idToken}`,
        },
      });

      return next.handle(cloned).pipe(
        catchError((error: any) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            // JWT token expired or invalid
            console.error('JWT token expired or invalid:', error);
            this.messageService.clear();
            this.messageService.add({
              key:'toast1',
              severity: 'error',
              summary: 'JWT token expired',
              detail: 'Please log in again.',
              life: 3000
            });
            // Clear local storage and log out the user
            localStorage.removeItem('firebaseIdToken');
            // Redirect to the login page
            this.router.navigate(['/login']);
          }
          return throwError(error);
        })
      );
    } else {
     // console.error('Firebase token not available');
      return next.handle(request);
    }
  }
}
