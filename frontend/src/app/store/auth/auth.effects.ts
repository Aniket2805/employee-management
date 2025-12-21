import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthEffects {
    private actions$ = inject(Actions);
    private authService = inject(AuthService);
    private router = inject(Router);
    private toastr = inject(ToastrService);
    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.login),
            mergeMap(({ email, password }) =>
                this.authService.login(email, password).pipe(
                    map((res) => {
                        this.toastr.success('Login successful');
                        return AuthActions.loginSuccess({ token: res.token, role: res.role, fullName: res.fullName, employeeId: res.employeeId })
                    }),
                    catchError((err) => {
                        this.toastr.error(err.error?.message || 'Login failed');
                        return of(AuthActions.loginFailure({ error: err.message }))
                    })
                )
            )
        )
    );

    signup$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.signup),
            mergeMap(({ fullName, email, password, role }) =>
                this.authService.signup(fullName, email, password, role).pipe(
                    map((res) => {
                        this.toastr.success('Signup successful');
                        return AuthActions.signupSuccess({ message: res.message })
                    }),
                    catchError((err) => {
                        this.toastr.error(err.error?.message || 'Signup failed');
                        return of(AuthActions.signupFailure({ error: err.error?.message || 'Signup failed' }))
                    }
                    )
                )
            )
        )
    );
    logout$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.logout),
                tap(() => {
                    this.toastr.info('Logged out successfully');
                    this.authService.logout(); // 🗑️ Clear local storage
                }),
                tap(() => {
                    this.router.navigate(['/login']); // ✅ Navigate after logout
                })
            ),
        { dispatch: false } // 🔒 This effect doesn't dispatch another action
    );

    /**
     * Handle automatic logout when token is expired or invalid.
     * This effect is triggered by the autoLogout action and performs cleanup.
     */
    autoLogout$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.autoLogout),
                tap(({ reason }) => {
                    if (reason.includes('expired')) {
                        this.toastr.warning('Your session has expired. Please login again.');
                    } else if (reason.includes('invalid')) {
                        this.toastr.warning('Your session is invalid. Please login again.');
                    } else if (reason.includes('401')) {
                        this.toastr.warning('Your session has been terminated. Please login again.');
                    } else {
                        this.toastr.warning('Session terminated: ' + reason);
                    }
                }),
                tap(() => {
                    // Clear local storage
                    this.authService.logout();
                }),
                tap(() => {
                    // Navigate to login page
                    this.router.navigate(['/login']);
                })
            ),
        { dispatch: false }
    );

    /**
     * Check token validity periodically or on demand.
     * This can be called from components to validate the current token.
     * Only validates if a token is actually present.
     */
    checkTokenValidity$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.checkTokenValidity),
            map(() => {
                // Skip validation if no token exists
                if (!this.authService.isTokenPresent()) {
                    return { type: '[Auth] No Token Present' } as any;
                }

                // Token exists, check if it's valid
                const isValid = this.authService.isTokenValid();
                if (!isValid) {
                    this.toastr.warning('Token is invalid, triggering auto logout');
                    return AuthActions.autoLogout({ reason: 'Token validation check failed' });
                }

                return { type: '[Auth] Token Valid' } as any;
            }),
            catchError((err) => {
                console.error('Error checking token validity:', err);
                return of(AuthActions.autoLogout({ reason: 'Error validating token' }));
            })
        )
    );

}
