import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectLoginToken = createSelector(
    selectAuthState,
    (state) => state.login.token
);

export const selectRole = createSelector(
    selectAuthState,
    (state) => state.login.role
);

export const selectLoginLoading = createSelector(
    selectAuthState,
    (state) => state.login.loading
);

export const selectLoginError = createSelector(
    selectAuthState,
    (state) => state.login.error
);

export const selectSignupSuccess = createSelector(
    selectAuthState,
    (state) => state.signup.success
);

export const selectSignupError = createSelector(
    selectAuthState,
    (state) => state.signup.error
);

export const selectSignupLoading = createSelector(
    selectAuthState,
    (state) => state.signup.loading
);
