export interface Employee {
    id: number;
    fullName?: string;
    firstName: string;
    lastName: string;
    email: string | null;
    password: string | null;
    department: string;
    onboardingStage: string;
    onboardingStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OFFBOARDED';
    active: boolean;
    isMentor: boolean;
    mentor: Employee | null;
}
export interface NewEmployeePayload {
    firstName: string;
    lastName: string;
    department: string;
    isMentor: boolean;
}