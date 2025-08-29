import { AuthState } from './auth/auth.state';
import { EmployeeState } from './employee/employee.state';

export interface AppState {
    auth: AuthState;
    employee: EmployeeState
}