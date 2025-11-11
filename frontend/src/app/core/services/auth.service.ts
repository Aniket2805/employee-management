import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private jwtHelper = new JwtHelperService();
    private AUTH_API_URL = environment.apiUrls.auth;

    constructor(private http: HttpClient) { }

    login(
        email: string,
        password: string
    ): Observable<{
        token: string;
        fullName: string;
        role: string;
        employeeId: string;
    }> {
        return this.http
            .post<{ data: { token: string; fullName: string } }>(
                `${this.AUTH_API_URL}/login`,
                {
                    email,
                    password,
                }
            )
            .pipe(
                tap(response => {
                    localStorage.setItem('token', response.data.token);
                }),
                map(response => {
                    const token = response.data.token;
                    const fullName = response.data.fullName;

                    // Decode the token
                    const decodedToken = this.jwtHelper.decodeToken(token);
                    console.log('Decoded Token:', decodedToken);
                    localStorage.setItem(
                        'role',
                        decodedToken?.role || 'EMPLOYEE'
                    );
                    const role = decodedToken?.role?.toUpperCase() || 'EMPLOYEE';
                    const employeeId = decodedToken?.employeeId || null;
                    localStorage.setItem('fullName', fullName);
                    localStorage.setItem(
                        'employeeId',
                        employeeId ? employeeId.toString() : 'null'
                    );
                    return { token, fullName, role, employeeId };
                })
            );
    }

    signup(
        fullName: string,
        email: string,
        password: string,
        role: string
    ) {
        return this.http.post<{ message: string }>(
            `${this.AUTH_API_URL}/register`,
            { fullName, email, password, role }
        );
    }

    // Change Profile Password
    changePassword(payload: {
        email: string;
        currentPassword: string;
        newPassword: string;
    }): Observable<any> {
        return this.http.put(`${this.AUTH_API_URL}/password`, payload);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getRole(): string | null {
        const token = this.getToken();
        if (token && !this.jwtHelper.isTokenExpired(token)) {
            const decoded = this.jwtHelper.decodeToken(token);
            return decoded?.role?.toUpperCase() || null;
        }
        return null;
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('fullName');
        localStorage.removeItem('employeeId');
    }
}
