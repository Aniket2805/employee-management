import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { authReducer } from './auth/auth.reducer';
import { employeeReducer } from './employee/employee.reducer';

export const appReducer: ActionReducerMap<AppState> = {
    auth: authReducer,
    employee: employeeReducer, // Assuming you have an employeeReducer defined
};