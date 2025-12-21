import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmployeeState } from './employee.state';
import { state } from '@angular/animations';

export const selectEmployeeState = createFeatureSelector<EmployeeState>('employee');

export const selectAllEmployees = createSelector(
    selectEmployeeState,
    (state) => state.employees
);

export const selectSelectedEmployee = createSelector(
    selectEmployeeState,
    (state) => state.selectedEmployee
);

export const selectSelectedEmployeeLoading = createSelector(
    selectEmployeeState,
    (state) => state.selectedEmployeeLoading
);

export const selectSelectedEmployeeError = createSelector(
    selectEmployeeState,
    (state) => state.selectedEmployeeError
);

export const selectEmployeeTasks = createSelector(
    selectEmployeeState,
    (state) => state.tasks
);

export const selectEmployeeTasksLoading = createSelector(
    selectEmployeeState,
    (state) => state.tasks.loading
)

export const selectEmployeeTasksError = createSelector(
    selectEmployeeState,
    (state) => state.tasks.error
)

export const selectEmployeesData = createSelector(
    selectEmployeeState,
    (state) => state.employees
);
export const selectEmployeesLoading = createSelector(
    selectEmployeeState,
    (state) => state.employees.loading
);
export const selectEmployeesError = createSelector(
    selectEmployeeState,
    (state) => state.employees.error
);

export const selectEmployeeById = (id: number) => createSelector(
    selectAllEmployees,
    (employees) => employees.data.find(emp => emp.id === id)
);

// Document Meta Selectors
export const selectEmployeeDocumentMeta = createSelector(
    selectEmployeeState,
    (state) => state.selectedDocument
);

// Performance Review Selectors
export const selectPerformanceReviews = createSelector(
    selectEmployeeState,
    (state) => state.reviews
);

export const selectPerformanceReviewsData = createSelector(
    selectEmployeeState,
    (state) => state.reviews.data
);

export const selectPerformanceReviewsLoading = createSelector(
    selectEmployeeState,
    (state) => state.reviews.loading
);

export const selectPerformanceReviewsError = createSelector(
    selectEmployeeState,
    (state) => state.reviews.error
);

// Audit Log Selectors
export const selectAuditLogs = createSelector(
    selectEmployeeState,
    (state) => state.auditLogs
);
export const selectAuditLogsData = createSelector(
    selectEmployeeState,
    (state) => state.auditLogs.data
);
export const selectAuditLogsLoading = createSelector(
    selectEmployeeState,
    (state) => state.auditLogs.loading
);
export const selectAuditLogsError = createSelector(
    selectEmployeeState,
    (state) => state.auditLogs.error
);

// Add and Update Employee Loading Selectors
export const selectAddLoading = createSelector(
    selectEmployeeState,
    (state) => state.addLoading
);

export const selectUpdateLoading = createSelector(
    selectEmployeeState,
    (state) => state.updateLoading
);

export const selectAddOrUpdateLoading = createSelector(
    selectAddLoading,
    selectUpdateLoading,
    (addLoading, updateLoading) => addLoading || updateLoading
);

// Operation Loading Selectors
export const selectOperationLoading = createSelector(
    selectEmployeeState,
    (state) => state.operationLoading
);

export const selectEmployeeOperationLoading = (employeeId: number) => createSelector(
    selectOperationLoading,
    (operationLoading) => operationLoading[employeeId] || { delete: false, offboard: false, startOnboarding: false }
);

export const selectEmployeeIsLoading = (employeeId: number) => createSelector(
    selectEmployeeOperationLoading(employeeId),
    (operations) => operations.delete || operations.offboard || operations.startOnboarding
);