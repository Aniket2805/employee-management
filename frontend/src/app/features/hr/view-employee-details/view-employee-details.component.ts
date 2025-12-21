import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectSelectedEmployee, selectSelectedEmployeeLoading } from '../../../store/employee/employee.selectors';
import * as EmployeeActions from '../../../store/employee/employee.actions';
import { LoadingComponent } from '../../../shared/loading/loading.component';

@Component({
    standalone: true,
    selector: 'app-view-employee-details',
    imports: [CommonModule, RouterModule, LoadingComponent],
    templateUrl: './view-employee-details.component.html',
    styleUrls: ['./view-employee-details.component.scss'],
})
export class ViewEmployeeDetailsComponent implements OnInit {
    private store = inject(Store);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    selectedEmployee = this.store.selectSignal(selectSelectedEmployee);
    loading = this.store.selectSignal(selectSelectedEmployeeLoading);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.store.dispatch(EmployeeActions.setSelectedEmployee({ employeeId: parseInt(id) }));
        }
    }

    goBack(): void {
        this.router.navigate(['/hr/dashboard']);
    }

    returnToDashboard(): void {
        this.router.navigate(['/hr/dashboard']);
    }

    editEmployee(): void {
        if (this.selectedEmployee()?.id) {
            this.router.navigate(['/hr/employees/edit', this.selectedEmployee()?.id]);
        }
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'PENDING':
                return 'text-yellow-600 bg-yellow-50';
            case 'IN_PROGRESS':
                return 'text-blue-600 bg-blue-50';
            case 'COMPLETED':
                return 'text-green-600 bg-green-50';
            case 'OFFBOARDED':
                return 'text-red-600 bg-red-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    }

    getStatusBgColor(status: string): string {
        switch (status) {
            case 'PENDING':
                return 'yellow-100';
            case 'IN_PROGRESS':
                return 'blue-100';
            case 'COMPLETED':
                return 'green-100';
            case 'OFFBOARDED':
                return 'red-100';
            default:
                return 'gray-100';
        }
    }

    getStatusIcon(status: string): string {
        switch (status) {
            case 'PENDING':
                return 'fa-hourglass-half';
            case 'IN_PROGRESS':
                return 'fa-spinner';
            case 'COMPLETED':
                return 'fa-circle-check';
            case 'OFFBOARDED':
                return 'fa-user-slash';
            default:
                return 'fa-circle';
        }
    }

    isEmailAssigned(): boolean {
        const email = this.selectedEmployee()?.email;
        return !!(email && typeof email === 'string' && email.trim().length > 0);
    }

    getEmailDisplay(): string {
        const email = this.selectedEmployee()?.email;
        return (email && typeof email === 'string' && email.trim()) ? email : 'Not Assigned';
    }

    isEmployeeMentor(): boolean {
        return Boolean(this.selectedEmployee()?.isMentor);
    }

    hasMentor(): boolean {
        return Boolean(this.selectedEmployee()?.mentor);
    }
}
