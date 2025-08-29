export interface AuthState {
    login: {
        token: string | null;
        fullName: string | null;
        role: string | null;
        employeeId: string | null;
        loading: boolean;
        error: string | null;
    };
    signup: {
        loading: boolean;
        error: string | null;
        success: string | null;
    };
}

export const initialAuthState: AuthState = {
    login: {
        token: null,
        fullName: null,
        role: null,
        employeeId: null,
        loading: false,
        error: null,
    },
    signup: {
        loading: false,
        error: null,
        success: null,
    },
};
