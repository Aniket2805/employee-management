import { createReducer, on } from '@ngrx/store';
import { initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
    initialAuthState,

    // Login
    on(AuthActions.login, (state) => ({
        ...state,
        login: { ...state.login, loading: true, error: null },
    })),
    on(AuthActions.loginSuccess, (state, { token, role, fullName, employeeId }) => ({
        ...state,
        login: { token, fullName, role, employeeId, loading: false, error: null },
    })),
    on(AuthActions.loginFailure, (state, { error }) => ({
        ...state,
        login: { ...state.login, loading: false, error },
    })),

    // Signup
    on(AuthActions.signup, (state) => ({
        ...state,
        signup: { loading: true, error: null, success: null },
    })),
    on(AuthActions.signupSuccess, (state, { message }) => ({
        ...state,
        signup: { loading: false, error: null, success: message },
    })),
    on(AuthActions.signupFailure, (state, { error }) => ({
        ...state,
        signup: { loading: false, error, success: null },
    })),
    on(AuthActions.initAuthFromStorage, (state) => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const fullName = localStorage.getItem('fullName');
        const employeeId = localStorage.getItem('employeeId');

        if (token && role) {
            return {
                ...state,
                login: {
                    ...state.login,
                    token,
                    fullName,
                    role,
                    employeeId,
                    loading: false,
                    error: null,
                },
            };
        }

        return state;
    }),
    on(AuthActions.logout, () => initialAuthState)
);
