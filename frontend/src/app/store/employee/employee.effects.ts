import { AuditLog } from '../../models/auditlog.model';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as EmployeeActions from './employee.actions';
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../models/employee.model';
import { ToastrService } from 'ngx-toastr';
import { DocumentMeta } from '../../models/document.model';

@Injectable()
export class EmployeeEffects {
    private actions$ = inject(Actions);
    private employeeService = inject(EmployeeService);
    private router = inject(Router);
    private toastr = inject(ToastrService);
    // ✅ Add Employee Effect
    addEmployee$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeeActions.addEmployee),
            mergeMap(({ employee }) =>
                this.employeeService.addEmployee(employee).pipe(
                    map((createdEmployee: Employee) => {
                        return EmployeeActions.addEmployeeSuccess({ employee: createdEmployee })
                    }
                    ),
                    catchError((error) => {
                        return of(EmployeeActions.addEmployeeFailure({ error: error.error.message }))
                    }
                    )
                )
            )
        )
    );

    // Load Audit Logs
    loadAuditLogs$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeeActions.loadAuditLogs),
            mergeMap(() =>
                this.employeeService.getAuditLogs().pipe(
                    map((auditLogs: AuditLog[]) => EmployeeActions.loadAuditLogsSuccess({ auditLogs })),
                    catchError((error) => of(EmployeeActions.loadAuditLogsFailure({ error: error.error?.message || 'Failed to load audit logs' })))
                )
            )
        )
    );
    // ✅ Navigate after employee added
    addEmployeeSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(EmployeeActions.addEmployeeSuccess),
                tap(() => {
                    this.toastr.success('Employee added successfully');
                    this.router.navigate(['/hr/dashboard']);
                })
            ),
        { dispatch: false }
    );

    //get the error message and show a toast notification
    addEmployeeFailure$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(EmployeeActions.addEmployeeFailure),
                tap(({ error }) => {
                    this.toastr.error(`Failed to add employee.`);
                    this.toastr.error(`${error}`);
                })
            ),
        { dispatch: false }
    );

    // ✅ Update Employee Effect
    updateEmployee$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeeActions.updateEmployee),
            mergeMap(({ id, employee }) =>
                this.employeeService.updateEmployee(id, employee).pipe(
                    map((updatedEmployee: Employee) => {
                        return EmployeeActions.updateEmployeeSuccess({ employee: updatedEmployee })

                    }
                    ),
                    catchError((error) => {
                        this.toastr.error('Failed to update employee');
                        this.toastr.error(`${error.error.message}`);
                        return of(EmployeeActions.updateEmployeeFailure({ error: error.error.message }))
                    }
                    )
                )
            )
        )
    );

    // update employee success effect to navigate back to dashboard
    updateEmployeeSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(EmployeeActions.updateEmployeeSuccess),
                tap(() => {
                    this.toastr.success('Employee updated successfully');

                    this.router.navigate(['/hr/dashboard']);
                })
            ),
        { dispatch: false }
    );


    // ✅ Delete Employee Effect
    deleteEmployee$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeeActions.deleteEmployee),
            mergeMap(({ id }) =>
                this.employeeService.deleteEmployee(id).pipe(
                    map(() => {
                        this.toastr.success('Employee deleted successfully');
                        return EmployeeActions.deleteEmployeeSuccess({ id })
                    }),
                    catchError((error) => {
                        this.toastr.error('Failed to delete employee');
                        return of(EmployeeActions.deleteEmployeeFailure({ id, error: error.message }))
                    }
                    )
                )
            )
        )
    );


    // ✅ Load Employee Tasks
    loadEmployeeTasks$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeeActions.loadEmployeeTasks),
            mergeMap(({ employeeId }) =>
                this.employeeService.getTasksForEmployee(employeeId).pipe(
                    map((tasks) => {
                        this.toastr.success('Tasks loaded successfully');
                        return EmployeeActions.loadEmployeeTasksSuccess({ tasks })
                    }
                    ),
                    catchError((error) => {
                        this.toastr.error('Failed to load tasks');
                        return of(
                            EmployeeActions.loadEmployeeTasksFailure({
                                error: error?.message || 'Failed to load tasks',
                            })
                        )
                    }
                    )
                )
            )
        )
    );

    // Load Performance Reviews (upcoming)
    loadPerformanceReviews$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeeActions.loadPerformanceReviews),
            mergeMap(() =>
                this.employeeService.getUpcomingreview().pipe(
                    map((reviews: any) => EmployeeActions.loadPerformanceReviewsSuccess({ reviews })),
                    catchError((error) => of(EmployeeActions.loadPerformanceReviewsFailure({ error: error?.message || 'Failed to load reviews' })))
                )
            )
        )
    );

    // Load Performance Reviews by Employee
    loadPerformanceReviewsByEmployee$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeeActions.loadPerformanceReviewsByEmployee),
            mergeMap(({ employeeId }) =>
                this.employeeService.getByUpcomingreviewEmployee(employeeId).pipe(
                    map((reviews: any) => EmployeeActions.loadPerformanceReviewsByEmployeeSuccess({ reviews })),
                    catchError((error) => of(EmployeeActions.loadPerformanceReviewsByEmployeeFailure({ error: error?.message || 'Failed to load employee reviews' })))
                )
            )
        )
    );

    // ✅ Set Selected Employee
    setSelectedEmployee$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeeActions.setSelectedEmployee),
            mergeMap(({ employeeId }) =>
                this.employeeService.getEmployeeById(employeeId).pipe(
                    map((employee) => {
                        return EmployeeActions.setSelectedEmployeeSuccess({ employee })
                    }
                    ),
                    catchError((error) =>
                        of(
                            EmployeeActions.setSelectedEmployeeFailure({
                                error: error?.message || 'Failed to load employee',
                            })
                        )
                    )
                )
            )
        )
    );
    // ✅ Load All Employees (Optional but recommended for HR dashboard)
    loadEmployees$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeeActions.loadEmployees),
            mergeMap(() =>
                this.employeeService.getAllEmployees().pipe(
                    map((employees) => {
                        return EmployeeActions.loadEmployeesSuccess({ employees })
                    }
                    ),
                    catchError((error) => {
                        this.toastr.error('Failed to load employees');
                        return of(
                            EmployeeActions.loadEmployeesFailure({
                                error: error?.message || 'Failed to load employees',
                            })
                        )
                    }
                    )
                )
            )
        )
    );
    // Load Employee Document Metadata
    loadEmployeeDocumentMeta$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeeActions.loadEmployeeDocumentMeta),
            mergeMap(({ employeeId }) =>
                this.employeeService.getGovtDocument(employeeId).pipe(
                    map((documentMeta: DocumentMeta) =>
                        EmployeeActions.loadEmployeeDocumentMetaSuccess({ documentMeta })
                    ),
                    catchError((error) =>
                        of(EmployeeActions.loadEmployeeDocumentMetaFailure({ error: error?.message || 'Failed to load document metadata' }))
                    )
                )
            )
        )
    );

    // ✅ Offboard Employee Effect
    offboardEmployee$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeeActions.offboardEmployee),
            mergeMap(({ id }) =>
                this.employeeService.offboardEmployee(id).pipe(
                    map(() => {
                        this.toastr.success('Employee offboarded successfully');
                        return EmployeeActions.offboardEmployeeSuccess({ id });
                    }),
                    catchError((error) => {
                        this.toastr.error('Failed to offboard employee');
                        return of(EmployeeActions.offboardEmployeeFailure({ id, error: error?.message || 'Failed to offboard employee' }));
                    })
                )
            )
        )
    );

    // ✅ Start Onboarding Effect
    startOnboarding$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EmployeeActions.startOnboarding),
            mergeMap(({ id }) =>
                this.employeeService.startOnboarding(id).pipe(
                    map(() => {
                        this.toastr.success('Onboarding started successfully');
                        return EmployeeActions.startOnboardingSuccess({ id });
                    }),
                    catchError((error) => {
                        this.toastr.error('Failed to start onboarding');
                        return of(EmployeeActions.startOnboardingFailure({ id, error: error?.message || 'Failed to start onboarding' }));
                    })
                )
            )
        )
    );
}
