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

    isTokenPresent(): boolean {
        const token = localStorage.getItem('token');
        return !!token;
    }

    /**
     * Check if token is expired
     * @param token - JWT token to check
     * @returns true if token is expired, false otherwise
     */
    isTokenExpired(token?: string): boolean {
        try {
            const tokenToCheck = token || localStorage.getItem('token');
            if (!tokenToCheck) {
                return true;
            }
            return this.jwtHelper.isTokenExpired(tokenToCheck);
        } catch (error) {
            console.error('Error checking token expiration:', error);
            return true;
        }
    }

    /**
     * Check if token is invalid (can't be decoded)
     * @param token - JWT token to check
     * @returns true if token is invalid, false otherwise
     */
    isTokenInvalid(token?: string): boolean {
        try {
            const tokenToCheck = token || localStorage.getItem('token');
            if (!tokenToCheck) {
                return true;
            }
            const decoded = this.jwtHelper.decodeToken(tokenToCheck);
            return !decoded;
        } catch (error) {
            console.error('Error decoding token:', error);
            return true;
        }
    }

    /**
     * Comprehensive check if token is valid (exists, not expired, and decodable)
     * @param token - JWT token to check (optional, will use localStorage if not provided)
     * @returns true if token is valid, false otherwise
     */
    isTokenValid(token?: string): boolean {
        const tokenToCheck = token || localStorage.getItem('token');
        if (!tokenToCheck) {
            return false;
        }
        return !this.isTokenExpired(tokenToCheck) && !this.isTokenInvalid(tokenToCheck);
    }

    /**
     * Get remaining time until token expires (in milliseconds)
     * @param token - JWT token to check
     * @returns remaining time in milliseconds, or 0 if token is already expired
     */
    getTokenExpirationTime(token?: string): number {
        try {
            const tokenToCheck = token || localStorage.getItem('token');
            if (!tokenToCheck) {
                return 0;
            }
            const expirationDate = this.jwtHelper.getTokenExpirationDate(tokenToCheck);
            if (!expirationDate) {
                return 0;
            }
            const now = new Date().getTime();
            const expiration = expirationDate.getTime();
            const remaining = expiration - now;
            return remaining > 0 ? remaining : 0;
        } catch (error) {
            console.error('Error getting token expiration time:', error);
            return 0;
        }
    }

    /**
     * Decode token to get payload
     * @param token - JWT token to decode
     * @returns decoded token payload or null
     */
    decodeToken(token?: string): any {
        try {
            const tokenToCheck = token || localStorage.getItem('token');
            if (!tokenToCheck) {
                return null;
            }
            return this.jwtHelper.decodeToken(tokenToCheck);
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    /**
     * Clear all authentication data from localStorage
     */
    clearAuthData(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('fullName');
        localStorage.removeItem('employeeId');
    }

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

    /**
     * Get total session duration from token (exp - iat in milliseconds)
     * @param token - JWT token to check
     * @returns total session duration in milliseconds, or 0 if unable to determine
     */
    getTokenSessionDuration(token?: string): number {
        try {
            const tokenToCheck = token || localStorage.getItem('token');
            if (!tokenToCheck) {
                return 0;
            }
            const decoded = this.jwtHelper.decodeToken(tokenToCheck);
            if (!decoded || !decoded.exp || !decoded.iat) {
                return 0;
            }
            // exp and iat are in seconds, convert to milliseconds
            const totalDuration = (decoded.exp - decoded.iat) * 1000;
            return totalDuration > 0 ? totalDuration : 0;
        } catch (error) {
            console.error('Error getting token session duration:', error);
            return 0;
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('fullName');
        localStorage.removeItem('employeeId');
    }
}
