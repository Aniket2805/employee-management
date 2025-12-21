
import { DocumentMeta } from '../../models/document.model';
import { Employee } from '../../models/employee.model';
import { AuditLog } from '../../models/auditlog.model';
import { Task } from '../../models/task.model';

export interface EmployeeState {
    employees: {
        data: Employee[];
        loading: boolean;
        error: string | null;
    };
    selectedEmployee: Employee | null;
    selectedEmployeeLoading: boolean;
    selectedEmployeeError: string | null;
    selectedDocument: DocumentMeta | null;
    tasks: {
        data: Task[];
        loading: boolean;
        error: string | null;
    };
    reviews: {
        data: any[];
        loading: boolean;
        error: string | null;
    };
    auditLogs: {
        data: AuditLog[];
        loading: boolean;
        error: string | null;
    };
    addLoading: boolean;
    updateLoading: boolean;
    operationLoading: {
        [employeeId: number]: {
            delete: boolean;
            offboard: boolean;
            startOnboarding: boolean;
        }
    };
}

export const initialEmployeeState: EmployeeState = {
    employees: {
        data: [],
        loading: false,
        error: null,
    },
    selectedEmployee: null,
    selectedEmployeeLoading: false,
    selectedEmployeeError: null,
    selectedDocument: null,
    tasks: {
        data: [],
        loading: false,
        error: null,
    },
    reviews: {
        data: [],
        loading: false,
        error: null,
    },
    auditLogs: {
        data: [],
        loading: false,
        error: null,
    },
    addLoading: false,
    updateLoading: false,
    operationLoading: {},
};

