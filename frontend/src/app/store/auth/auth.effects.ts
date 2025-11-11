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

}
