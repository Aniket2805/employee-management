import { Component, inject, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as EmployeeActions from '../../../store/employee/employee.actions';
import { selectEmployeesData, selectEmployeesError, selectEmployeesLoading } from '../../../store/employee/employee.selectors';
import { EmployeeService } from '../../../core/services/employee.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    standalone: true,
    selector: 'app-hr-dashboard',
    imports: [CommonModule, RouterModule],
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
    selectedEmployee = this.store.selectSignal(state => state.employee.selectedEmployee);
    modelOpen = signal<boolean>(false);

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
        this.employeeService.startOnboarding(empId).subscribe(() => {
            this.toastr.success('Onboarding started successfully');
            this.store.dispatch(EmployeeActions.loadEmployees());
        });
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
        this.store.dispatch(EmployeeActions.setSelectedEmployee({ employeeId: id }));
        this.modelOpen.set(true);
    }
    closeModal() {
        this.modelOpen.set(false);
    }

    addEmployee() {
        this.router.navigate(['/hr/employees/add']);
    }
    offboardEmployee(id: number) {
        this.store.dispatch(EmployeeActions.offboardEmployee({ id }));
        this.store.dispatch(EmployeeActions.loadEmployees());
    }
}
