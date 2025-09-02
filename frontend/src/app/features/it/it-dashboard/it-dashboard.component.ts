import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as EmployeeActions from '../../../store/employee/employee.actions';
import { selectEmployeesData, selectEmployeesError, selectEmployeesLoading } from '../../../store/employee/employee.selectors';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  standalone: true,
  selector: 'app-hr-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './it-dashboard.component.html',
  styleUrl: './it-dashboard.component.scss'
})
export class ItDashboardComponent {
  private store = inject(Store);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);

  employees = this.store.selectSignal(selectEmployeesData);
  loading = this.store.selectSignal(selectEmployeesLoading);
  error = this.store.selectSignal(selectEmployeesError);

  // Summary stats
  get totalEmployees(): number {
    return this.employees()?.data?.length || 0;
  }
  get pendingOnboarding(): number {
    return this.employees()?.data?.filter((e: any) => e.onboardingStatus === 'IN_PROGRESS').length || 0;
  }
  get completedOnboarding(): number {
    return this.employees()?.data?.filter((e: any) => e.onboardingStatus === 'COMPLETED').length || 0;
  }

  get offboardedEmployees(): number {
    return this.employees().data?.filter(e => e.onboardingStatus === 'OFFBOARDED').length || 0;
  }
  // Modal state
  modalOpen = false;
  selectedEmp: any = null;

  ngOnInit(): void {
    this.store.dispatch(EmployeeActions.loadEmployees());
  }

  goToEmployeeTasks(empId: number) {
    this.store.dispatch(EmployeeActions.setSelectedEmployee({ employeeId: empId }));
    this.router.navigate(['/it/employees', 'tasks', empId]);
  }

  // Card actions
  viewEmployee(empId: number) {
    this.selectedEmp = this.employees()?.data?.find((e: any) => e.id === empId);
    this.modalOpen = true;
  }
  modelOpen() {
    return this.modalOpen;
  }
  closeModal() {
    this.modalOpen = false;
    this.selectedEmp = null;
  }
  selectedEmployee() {
    return this.selectedEmp;
  }
  // Fallback for isItSpecialist property
  isItSpecialist(emp: any): boolean {
    return emp.isItSpecialist !== undefined ? emp.isItSpecialist : (emp.department?.toLowerCase() === 'it');
  }
}
