import {
    HttpInterceptorFn,
    HttpRequest,
    HttpHandlerFn,
    HttpEvent,
    HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { exhaustMap, take, catchError } from 'rxjs/operators';
import { selectLoginToken } from '../../store/auth/auth.selectors';
import { AuthService } from '../services/auth.service';
import * as AuthActions from '../../store/auth/auth.actions';

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const store = inject(Store);
    const authService = inject(AuthService);

    return store.select(selectLoginToken).pipe(
        take(1),
        exhaustMap((token) => {
            // Validate token before adding it to the request
            if (token) {
                // Check if token is expired or invalid
                if (authService.isTokenExpired(token) || authService.isTokenInvalid(token)) {
                    // Token is invalid/expired, dispatch auto logout action
                    const reason = authService.isTokenExpired(token)
                        ? 'Token has expired'
                        : 'Token is invalid';
                    store.dispatch(AuthActions.autoLogout({ reason }));

                    // Continue without the token
                    return next(req).pipe(
                        catchError((error: HttpErrorResponse) => {
                            return throwError(() => error);
                        })
                    );
                }

                // Token is valid, add it to the request
                const authReq = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                return next(authReq).pipe(
                    catchError((error: HttpErrorResponse) => {
                        // Handle 401 Unauthorized errors
                        if (error.status === 401) {
                            // Token was rejected by the server, it might be invalid or expired
                            store.dispatch(AuthActions.autoLogout({ reason: 'Token was rejected by server (401)' }));
                        }
                        return throwError(() => error);
                    })
                );
            } else {
                return next(req).pipe(
                    catchError((error: HttpErrorResponse) => {
                        return throwError(() => error);
                    })
                );
            }
        })
    );
};
