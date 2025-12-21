import { createReducer, on } from '@ngrx/store';
import { initialEmployeeState } from './employee.state';
import * as EmployeeActions from './employee.actions';
export const employeeReducer = createReducer(
    initialEmployeeState,

    // Load All Employees
    on(EmployeeActions.loadEmployees, (state) => ({
        ...state,
        employees: { ...state.employees, loading: true, error: null }
    })),
    on(EmployeeActions.loadEmployeesSuccess, (state, { employees }) => ({
        ...state,
        employees: { data: employees, loading: false, error: null }
    })),
    on(EmployeeActions.loadEmployeesFailure, (state, { error }) => ({
        ...state,
        employees: { ...state.employees, loading: false, error }
    })),

    // Set Selected Employee
    on(EmployeeActions.setSelectedEmployee, (state) => ({
        ...state,
        selectedEmployeeLoading: true,
        selectedEmployeeError: null
    })),
    on(EmployeeActions.setSelectedEmployeeSuccess, (state, { employee }) => ({
        ...state,
        selectedEmployee: employee,
        selectedEmployeeLoading: false,
        selectedEmployeeError: null
    })),
    on(EmployeeActions.setSelectedEmployeeFailure, (state, { error }) => ({
        ...state,
        selectedEmployee: null,
        selectedEmployeeLoading: false,
        selectedEmployeeError: error
    })),

    // Load Tasks for Employee
    on(EmployeeActions.loadEmployeeTasks, (state) => ({
        ...state,
        tasks: { ...state.tasks, loading: true, error: null }
    })),
    on(EmployeeActions.loadEmployeeTasksSuccess, (state, { tasks }) => ({
        ...state,
        tasks: { data: tasks, loading: false, error: null }
    })),
    on(EmployeeActions.loadEmployeeTasksFailure, (state, { error }) => ({
        ...state,
        tasks: { ...state.tasks, loading: false, error }
    })),

    // Add New Employee
    on(EmployeeActions.addEmployee, (state) => ({
        ...state,
        addLoading: true
    })),
    on(EmployeeActions.addEmployeeSuccess, (state, { employee }) => ({
        ...state,
        employees: {
            ...state.employees,
            data: [...state.employees.data, employee],
        },
        addLoading: false
    })),
    on(EmployeeActions.addEmployeeFailure, (state) => ({
        ...state,
        addLoading: false
    })),

    // Update Employee
    on(EmployeeActions.updateEmployee, (state) => ({
        ...state,
        updateLoading: true
    })),
    on(EmployeeActions.updateEmployeeSuccess, (state, { employee }) => ({
        ...state,
        employees: {
            ...state.employees,
            data: state.employees.data.map((emp) =>
                emp.id === employee.id ? { ...emp, ...employee } : emp
            ),
        },
        updateLoading: false
    })),
    on(EmployeeActions.updateEmployeeFailure, (state) => ({
        ...state,
        updateLoading: false
    })),


    // Document Metadata
    on(EmployeeActions.loadEmployeeDocumentMeta, (state) => ({
        ...state,
        selectedDocument: null,
        documentMetaLoading: true,
        documentMetaError: null
    })),
    on(EmployeeActions.loadEmployeeDocumentMetaSuccess, (state, { documentMeta }) => ({
        ...state,
        selectedDocument: documentMeta,
        documentMetaLoading: false,
        documentMetaError: null
    })),
    on(EmployeeActions.loadEmployeeDocumentMetaFailure, (state, { error }) => ({
        ...state,
        selectedDocument: null,
        documentMetaLoading: false,
        documentMetaError: error
    })),

    // Performance Reviews
    on(EmployeeActions.loadPerformanceReviews, (state) => ({
        ...state,
        reviews: { ...state.reviews, loading: true, error: null }
    })),
    on(EmployeeActions.loadPerformanceReviewsSuccess, (state, { reviews }) => ({
        ...state,
        reviews: { data: reviews, loading: false, error: null }
    })),
    on(EmployeeActions.loadPerformanceReviewsFailure, (state, { error }) => ({
        ...state,
        reviews: { ...state.reviews, loading: false, error }
    })),

    on(EmployeeActions.loadPerformanceReviewsByEmployee, (state) => ({
        ...state,
        reviews: { ...state.reviews, loading: true, error: null }
    })),
    on(EmployeeActions.loadPerformanceReviewsByEmployeeSuccess, (state, { reviews }) => ({
        ...state,
        reviews: { data: reviews, loading: false, error: null }
    })),
    on(EmployeeActions.loadPerformanceReviewsByEmployeeFailure, (state, { error }) => ({
        ...state,
        reviews: { ...state.reviews, loading: false, error }
    })),

    // Delete Employee
    on(EmployeeActions.deleteEmployee, (state, { id }) => ({
        ...state,
        operationLoading: {
            ...state.operationLoading,
            [id]: { ...state.operationLoading[id], delete: true }
        }
    })),
    on(EmployeeActions.deleteEmployeeSuccess, (state, { id }) => ({
        ...state,
        employees: {
            ...state.employees,
            data: state.employees.data.filter((emp) => emp.id !== id),
        },
        operationLoading: {
            ...state.operationLoading,
            [id]: { ...state.operationLoading[id], delete: false }
        }
    })),
    on(EmployeeActions.deleteEmployeeFailure, (state, { id }) => ({
        ...state,
        operationLoading: {
            ...state.operationLoading,
            [id]: { ...state.operationLoading[id], delete: false }
        }
    })),

    // Audit Logs
    on(EmployeeActions.loadAuditLogs, (state) => ({
        ...state,
        auditLogs: { ...state.auditLogs, loading: true, error: null }
    })),
    on(EmployeeActions.loadAuditLogsSuccess, (state, { auditLogs }) => ({
        ...state,
        auditLogs: { data: auditLogs, loading: false, error: null }
    })),
    on(EmployeeActions.loadAuditLogsFailure, (state, { error }) => ({
        ...state,
        auditLogs: { ...state.auditLogs, loading: false, error }
    })),

    // Offboarding
    on(EmployeeActions.offboardEmployee, (state, { id }) => ({
        ...state,
        operationLoading: {
            ...state.operationLoading,
            [id]: { ...state.operationLoading[id], offboard: true }
        }
    })),
    on(EmployeeActions.offboardEmployeeSuccess, (state, { id }) => ({
        ...state,
        employees: {
            ...state.employees,
            data: state.employees.data.map(emp =>
                emp.id === id ? { ...emp, onboardingStatus: 'OFFBOARDED' as const } : emp
            ),
        },
        operationLoading: {
            ...state.operationLoading,
            [id]: { ...state.operationLoading[id], offboard: false }
        }
    })),
    on(EmployeeActions.offboardEmployeeFailure, (state, { id }) => ({
        ...state,
        operationLoading: {
            ...state.operationLoading,
            [id]: { ...state.operationLoading[id], offboard: false }
        }
    })),

    // Start Onboarding
    on(EmployeeActions.startOnboarding, (state, { id }) => ({
        ...state,
        operationLoading: {
            ...state.operationLoading,
            [id]: { ...state.operationLoading[id], startOnboarding: true }
        }
    })),
    on(EmployeeActions.startOnboardingSuccess, (state, { id }) => ({
        ...state,
        employees: {
            ...state.employees,
            data: state.employees.data.map(emp =>
                emp.id === id ? { ...emp, onboardingStatus: 'IN_PROGRESS' as const } : emp
            ),
        },
        operationLoading: {
            ...state.operationLoading,
            [id]: { ...state.operationLoading[id], startOnboarding: false }
        }
    })),
    on(EmployeeActions.startOnboardingFailure, (state, { id }) => ({
        ...state,
        operationLoading: {
            ...state.operationLoading,
            [id]: { ...state.operationLoading[id], startOnboarding: false }
        }
    })),

);
