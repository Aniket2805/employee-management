import { Injectable, signal } from '@angular/core';
import { interval, Subject, takeUntil, takeWhile } from 'rxjs';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class SessionTimerService {
    private authService: AuthService;
    private toastr: ToastrService;

    sessionTimeLeft = signal('00:00:00');
    sessionPercentage = signal(100);
    isWarning = signal(false);
    isCritical = signal(false);

    private destroy$ = new Subject<void>();
    private warningThreshold = 5 * 60 * 1000; // 5 minutes in milliseconds
    private criticalThreshold = 2 * 60 * 1000; // 2 minutes in milliseconds
    private totalSessionDuration: number = 0; // Total session duration from token

    constructor(authService: AuthService, toastr: ToastrService) {
        this.authService = authService;
        this.toastr = toastr;
    }

    /**
     * Initialize session timer by calculating remaining time from token expiration
     */
    initializeSessionTimer(): void {
        const remainingTime = this.getRemainingSessionTime();
        this.totalSessionDuration = this.authService.getTokenSessionDuration();

        if (remainingTime > 0 && this.totalSessionDuration > 0) {
            this.updateSessionDisplay(remainingTime);

            // Start timer updates every 1 second
            this.startSessionTimer();
        }
    }

    /**
     * Start the session timer that updates every second
     */
    private startSessionTimer(): void {
        interval(1000)
            .pipe(
                takeUntil(this.destroy$),
                takeWhile(() => {
                    const remaining = this.getRemainingSessionTime();
                    return remaining > 0;
                })
            )
            .subscribe(() => {
                const remaining = this.getRemainingSessionTime();
                this.updateSessionDisplay(remaining);

                // Show warning when session is about to expire (5 minutes left)
                if (remaining < this.warningThreshold && remaining > this.criticalThreshold) {
                    if (!this.isWarning()) {
                        this.toastr.warning('Your session is about to expire. Please save your work.');
                        this.isWarning.set(true);
                    }
                }

                // Show critical warning (2 minutes left)
                if (remaining <= this.criticalThreshold && remaining > 0) {
                    this.isCritical.set(true);
                }

                // Session expired
                if (remaining <= 0) {
                    this.handleSessionExpired();
                }
            });
    }

    /**
     * Update the session display with formatted time and percentage
     */
    private updateSessionDisplay(remainingMs: number): void {
        const minutes = Math.floor(remainingMs / 60000);
        const seconds = Math.floor((remainingMs % 60000) / 1000);
        this.sessionTimeLeft.set(`${minutes}m ${seconds}s`);

        // Calculate percentage based on total session duration from token
        if (this.totalSessionDuration > 0) {
            this.sessionPercentage.set(Math.round((remainingMs / this.totalSessionDuration) * 100));
        } else {
            this.sessionPercentage.set(100);
        }
    }

    /**
     * Handle session expiration
     */
    private handleSessionExpired(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.toastr.error('Your session has expired. Please log in again.');
        localStorage.clear();
        window.location.href = '/login';
    }

    /**
     * Get remaining session time in milliseconds from token
     */
    getRemainingSessionTime(): number {
        const expirationTime = this.authService.getTokenExpirationTime();
        return Math.max(0, expirationTime);
    }

    /**
     * Format time from milliseconds to HH:MM:SS
     */
    formatTime(milliseconds: number): string {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
    }

    /**
     * Destroy the timer and clean up resources
     */
    destroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Pad numbers with leading zeros
     */
    private padZero(value: number): string {
        return value < 10 ? `0${value}` : `${value}`;
    }
}
