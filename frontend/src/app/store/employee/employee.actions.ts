// Audit Logs
import { AuditLog } from '../../models/auditlog.model';
import { createAction, props } from '@ngrx/store';
import { Employee, NewEmployeePayload } from '../../models/employee.model';
import { Task } from '../../models/task.model';
import { DocumentMeta } from '../../models/document.model';

// Load All Employees
export const loadEmployees = createAction('[Employee] Load Employees');
export const loadEmployeesSuccess = createAction(
    '[Employee] Load Employees Success',
    props<{ employees: Employee[] }>()
);
export const loadEmployeesFailure = createAction(
    '[Employee] Load Employees Failure',
    props<{ error: string }>()
);
// Audit Logs
export const loadAuditLogs = createAction('[Employee] Load Audit Logs');
export const loadAuditLogsSuccess = createAction('[Employee] Load Audit Logs Success', props<{ auditLogs: AuditLog[] }>());
export const loadAuditLogsFailure = createAction('[Employee] Load Audit Logs Failure', props<{ error: string }>());
// Set Selected Employee
export const setSelectedEmployee = createAction(
    '[Employee] Set Selected Employee',
    props<{ employeeId: number }>()
);

export const setSelectedEmployeeSuccess = createAction(
    '[Employee] Set Selected Employee Success',
    props<{ employee: Employee }>()
);

export const setSelectedEmployeeFailure = createAction(
    '[Employee] Set Selected Employee Failure',
    props<{ error: string }>()
);

// Load Tasks for Employee
export const loadEmployeeTasks = createAction(
    '[Employee] Load Employee Tasks',
    props<{ employeeId: number }>()
);
export const loadEmployeeTasksSuccess = createAction(
    '[Employee] Load Employee Tasks Success',
    props<{ tasks: Task[] }>()
);
export const loadEmployeeTasksFailure = createAction(
    '[Employee] Load Employee Tasks Failure',
    props<{ error: string }>()
);

// Add New Employee
export const addEmployee = createAction(
    '[Employee] Add Employee',
    props<{ employee: NewEmployeePayload }>()
);

export const addEmployeeSuccess = createAction(
    '[Employee] Add Employee Success',
    props<{ employee: Employee }>()
);

export const addEmployeeFailure = createAction(
    '[Employee] Add Employee Failure',
    props<{ error: string }>()
);

export const updateEmployee = createAction(
    '[Employee] Update Employee',
    props<{ id: number; employee: Partial<Employee> }>()
);

export const updateEmployeeSuccess = createAction(
    '[Employee] Update Employee Success',
    props<{ employee: Employee }>()
);

export const updateEmployeeFailure = createAction(
    '[Employee] Update Employee Failure',
    props<{ error: string }>()
);

// Delete Employee
export const deleteEmployee = createAction(
    '[Employee] Delete Employee',
    props<{ id: number }>()
);
export const deleteEmployeeSuccess = createAction(
    '[Employee] Delete Employee Success',
    props<{ id: number }>()
);
export const deleteEmployeeFailure = createAction(
    '[Employee] Delete Employee Failure',
    props<{ id: number; error: string }>()
);

// Document Metadata Actions
export const loadEmployeeDocumentMeta = createAction(
    '[Employee] Load Employee Document Meta',
    props<{ employeeId: number }>()
);
export const loadEmployeeDocumentMetaSuccess = createAction(
    '[Employee] Load Employee Document Meta Success',
    props<{ documentMeta: DocumentMeta }>() // Replace `any` with a proper DocumentMeta model if available
);
export const loadEmployeeDocumentMetaFailure = createAction(
    '[Employee] Load Employee Document Meta Failure',
    props<{ error: string }>()
);

// Performance Reviews
export const loadPerformanceReviews = createAction('[Employee] Load Performance Reviews');
export const loadPerformanceReviewsSuccess = createAction(
    '[Employee] Load Performance Reviews Success',
    props<{ reviews: any[] }>()
);
export const loadPerformanceReviewsFailure = createAction(
    '[Employee] Load Performance Reviews Failure',
    props<{ error: string }>()
);

export const loadPerformanceReviewsByEmployee = createAction(
    '[Employee] Load Performance Reviews By Employee',
    props<{ employeeId: number }>()
);
export const loadPerformanceReviewsByEmployeeSuccess = createAction(
    '[Employee] Load Performance Reviews By Employee Success',
    props<{ reviews: any[] }>()
);
export const loadPerformanceReviewsByEmployeeFailure = createAction(
    '[Employee] Load Performance Reviews By Employee Failure',
    props<{ error: string }>()
);

// Offboarding
export const offboardEmployee = createAction(
    '[Employee] Offboard Employee',
    props<{ id: number }>()
);
export const offboardEmployeeSuccess = createAction(
    '[Employee] Offboard Employee Success',
    props<{ id: number }>()
);
export const offboardEmployeeFailure = createAction(
    '[Employee] Offboard Employee Failure',
    props<{ id: number; error: string }>()
);

// Start Onboarding
export const startOnboarding = createAction(
    '[Employee] Start Onboarding',
    props<{ id: number }>()
);
export const startOnboardingSuccess = createAction(
    '[Employee] Start Onboarding Success',
    props<{ id: number }>()
);
export const startOnboardingFailure = createAction(
    '[Employee] Start Onboarding Failure',
    props<{ id: number; error: string }>()
);
