import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as EmployeeActions from '../../../store/employee/employee.actions';
import { selectEmployeesData, selectEmployeesError, selectEmployeesLoading, selectEmployeeOperationLoading } from '../../../store/employee/employee.selectors';
import { EmployeeService } from '../../../core/services/employee.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from '../../../shared/loading/loading.component';

@Component({
    standalone: true,
    selector: 'app-hr-dashboard',
    imports: [CommonModule, RouterModule, LoadingComponent],
    templateUrl: './hr-dashboard.component.html',
    styleUrls: ['./hr-dashboard.component.scss'],
})
export class HrDashboardComponent {
    private store = inject(Store);
    private router = inject(Router);
    private employeeService = inject(EmployeeService);
    private toastr = inject(ToastrService);

    employees = this.store.selectSignal(selectEmployeesData);
    loading = this.store.selectSignal(selectEmployeesLoading);
    error = this.store.selectSignal(selectEmployeesError);

    getOperationLoading(empId: number) {
        return this.store.selectSignal(selectEmployeeOperationLoading(empId));
    }

    get totalEmployees(): number {
        return this.employees().data?.length || 0;
    }
    get pendingOnboarding(): number {
        return this.employees().data?.filter(e => e.onboardingStatus === 'IN_PROGRESS').length || 0;
    }
    get completedOnboarding(): number {
        return this.employees().data?.filter(e => e.onboardingStatus === 'COMPLETED').length || 0;
    }
    get offboardedEmployees(): number {
        return this.employees().data?.filter(e => e.onboardingStatus === 'OFFBOARDED').length || 0;
    }

    ngOnInit(): void {
        this.store.dispatch(EmployeeActions.loadEmployees());
    }

    startOnboarding(empId: number) {
        this.store.dispatch(EmployeeActions.startOnboarding({ id: empId }));
    }
    editEmployee(id: number) {
        this.router.navigate(['/hr/employees/edit', id]);
    }
    deleteEmployee(id: number) {
        this.store.dispatch(EmployeeActions.deleteEmployee({ id: id }));
    }
    goToEmployeeTasks(id: number) {
        this.store.dispatch(EmployeeActions.setSelectedEmployee({ employeeId: id }));
        this.router.navigate(['/hr/employees', 'tasks', id]);
    }
    viewEmployee(id: number) {
        this.router.navigate(['/hr/view-employee-details', id]);
    }

    addEmployee() {
        this.router.navigate(['/hr/employees/add']);
    }
    offboardEmployee(id: number) {
        this.store.dispatch(EmployeeActions.offboardEmployee({ id }));
    }
}
