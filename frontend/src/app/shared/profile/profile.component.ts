import { Component, OnInit, OnDestroy, inject, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectSelectedEmployee } from '../../store/employee/employee.selectors';
import { setSelectedEmployee } from '../../store/employee/employee.actions';
import { selectRole, selectEmployeeId } from '../../store/auth/auth.selectors';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from '../loading/loading.component';
import { SessionTimerService } from '../../core/services/session-timer.service';

@Component({
    standalone: true,
    selector: 'app-profile',
    imports: [CommonModule, LoadingComponent],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
    @Input() userRole: 'HR' | 'IT' | 'EMPLOYEE' = 'HR';

    private store = inject(Store);
    private router = inject(Router);
    private toastr = inject(ToastrService);
    private sessionTimerService = inject(SessionTimerService);

    profile = this.store.selectSignal(selectSelectedEmployee);
    userRoleFromStore = this.store.selectSignal(selectRole);
    userId = this.store.selectSignal(selectEmployeeId);

    loading = signal(false);

    // Signals from session timer service
    sessionTimeLeft = this.sessionTimerService.sessionTimeLeft;
    sessionPercentage = this.sessionTimerService.sessionPercentage;

    ngOnInit(): void {
        const employeeIdStr = localStorage.getItem('employeeId');
        const employeeId = employeeIdStr ? Number(employeeIdStr) : null;

        if (employeeId) {
            this.store.dispatch(setSelectedEmployee({ employeeId }));
        }
        this.sessionTimerService.initializeSessionTimer();
    }

    ngOnDestroy(): void {
        this.sessionTimerService.destroy();
    }

    navigateToChangePassword(): void {
        this.router.navigate(['/change-password']);
    }

    logout(): void {
        localStorage.clear();
        this.router.navigate(['/login']);
        this.toastr.info('You have been logged out');
    }

    getStatusColor(status: string | undefined): string {
        if (!status) return '#6b7280';
        switch (status) {
            case 'PENDING':
                return '#eab308';
            case 'IN_PROGRESS':
                return '#3b82f6';
            case 'COMPLETED':
                return '#22c55e';
            case 'OFFBOARDED':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    }

    getInitials(): string {
        if (this.profile()) {
            const firstName = this.profile()!.firstName || '';
            const lastName = this.profile()!.lastName || '';
            return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
        }
        return 'US';
    }

    getRoleLabel(): string {
        switch (this.userRole) {
            case 'HR':
                return 'HR Administrator';
            case 'IT':
                return 'IT Administrator';
            case 'EMPLOYEE':
                return 'Employee';
            default:
                return 'User';
        }
    }

    getRoleBadgeIcon(): string {
        switch (this.userRole) {
            case 'HR':
                return 'fa-shield';
            case 'IT':
                return 'fa-screwdriver';
            case 'EMPLOYEE':
                return 'fa-user';
            default:
                return 'fa-user';
        }
    }
}
