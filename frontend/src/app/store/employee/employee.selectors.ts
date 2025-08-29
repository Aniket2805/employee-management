import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmployeeState } from './employee.state';

export const selectEmployeeState = createFeatureSelector<EmployeeState>('employee');

export const selectAllEmployees = createSelector(
    selectEmployeeState,
    (state) => state.employees
);

export const selectSelectedEmployee = createSelector(
    selectEmployeeState,
    (state) => state.selectedEmployee
);

export const selectEmployeeTasks = createSelector(
    selectEmployeeState,
    (state) => state.tasks
);

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
