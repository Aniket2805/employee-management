import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeTasksComponent } from './employee-tasks.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { EmployeeService } from '../../../core/services/employee.service';
import { ToastrService } from 'ngx-toastr';
import { selectRole } from '../../../store/auth/auth.selectors';
import { selectEmployeeTasks, selectSelectedEmployee, selectEmployeeDocumentMeta } from '../../../store/employee/employee.selectors';
import { inject, signal } from '@angular/core';
import { of } from 'rxjs';
import { Task } from '../../../models/task.model';
import { ActivatedRoute } from '@angular/router';

const mockTasks: {
    data: Task[];
    loading: boolean;
    error: string | null;
} = {
    data: [
        { taskId: 1, title: 'Create Official Email ID', department: 'IT', status: 'IN_PROGRESS', orderIndex: 1, description: '', formlyConfigJson: null },
        { taskId: 2, title: 'Approve Uploaded Documents', department: 'IT', status: 'IN_PROGRESS', orderIndex: 2, description: '', formlyConfigJson: null },
        { taskId: 3, title: 'Other Task', department: 'HR', status: 'COMPLETED', orderIndex: 3, description: '', formlyConfigJson: null },
    ],
    loading: false,
    error: null
};
const mockEmployee = {
    id: 1,
    firstName: 'Alice',
    lastName: 'Smith',
    department: 'IT',
    active: true,
    isMentor: false,
    onboardingStage: 'IT',
    onboardingStatus: 'IN_PROGRESS' as const,
    mentor: null
};
const mockDocument = {
    id: 10,
    employeeId: 1,
    originalFileName: 'aadhar.pdf',
    storedFileName: 'aadhar-10.pdf',
    fileType: 'pdf',
    fileSize: 123456,
    uploadedAt: '2025-08-28T10:00:00Z',
    approved: true
};

describe('EmployeeTasksComponent', () => {
    let component: EmployeeTasksComponent;
    let fixture: ComponentFixture<EmployeeTasksComponent>;
    let store: MockStore;
    let employeeService: jasmine.SpyObj<EmployeeService>;
    let toastr: jasmine.SpyObj<ToastrService>;
    let route: ActivatedRoute;
    beforeEach(async () => {
        const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', [
            'createEmail', 'approveDocumment', 'completeTask'
        ]);
        const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
        await TestBed.configureTestingModule({
            imports: [EmployeeTasksComponent, ReactiveFormsModule, DynamicFormComponent],
            providers: [
                provideMockStore(),
                { provide: EmployeeService, useValue: employeeServiceSpy },
                { provide: ToastrService, useValue: toastrSpy },
                { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
            ],
        }).compileComponents();
        store = TestBed.inject(MockStore);
        employeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
        toastr = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
        setupSelectors();
        fixture = TestBed.createComponent(EmployeeTasksComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    function setupSelectors(role = 'IT') {
        store.overrideSelector(selectRole, role);
        store.overrideSelector(selectEmployeeTasks, mockTasks);
        store.overrideSelector(selectSelectedEmployee, mockEmployee);
        store.overrideSelector(selectEmployeeDocumentMeta, mockDocument);
    }
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should filter tasks by role', () => {
        expect(component.filteredTasks().length).toBe(2);
        expect(component.filteredTasks()[0].department).toBe('IT');
    });

    it('should return true if all tasks for role are completed', () => {
        store.overrideSelector(selectEmployeeTasks, {
            data: [
                { taskId: 1, title: 'Create Official Email ID', department: 'IT', status: 'COMPLETED', orderIndex: 1, description: '', formlyConfigJson: null },
                { taskId: 2, title: 'Approve Uploaded Documents', department: 'IT', status: 'COMPLETED', orderIndex: 2, description: '', formlyConfigJson: null }
            ],
            loading: false,
            error: null
        });
        fixture = TestBed.createComponent(EmployeeTasksComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        expect(component.allTasksCompleted()).toBeTrue();
    });

    it('should select a task by id', () => {
        component.selectTask(1);
        expect(component.selectedTask()?.taskId).toBe(1);
    });

    it('should close modal', () => {
        component.selectTask(1);
        component.closeModal();
        expect(component.selectedTask()).toBeUndefined();
    });

    it('should get task by id', () => {
        const task = component.getTaskById(2);
        expect(task?.title).toBe('Approve Uploaded Documents');
    });

    it('should handle form submit for Create Official Email ID', () => {
        const fakeForm = { form: { valid: true } as FormGroup, data: new FormData() };
        fakeForm.data.append('officialEmail', 'alice@company.com');
        fakeForm.data.append('temporaryPassword', 'pass123');
        employeeService.createEmail.and.returnValue(of({}));
        employeeService.completeTask.and.returnValue(of({}));
        component.selectTask(1);
        component.handleFormSubmit(fakeForm, mockTasks.data[0]);
        expect(employeeService.createEmail).toHaveBeenCalled();
        expect(employeeService.completeTask).toHaveBeenCalled();
        expect(toastr.success).toHaveBeenCalled();
    });

    it('should handle form submit for Approve Uploaded Documents', () => {
        const fakeForm = { form: { valid: true } as FormGroup, data: new FormData() };
        employeeService.approveDocumment.and.returnValue(of({}));
        employeeService.completeTask.and.returnValue(of({}));
        component.selectTask(2);
        component.handleFormSubmit(fakeForm, mockTasks.data[1]);
        expect(employeeService.approveDocumment).toHaveBeenCalled();
        expect(employeeService.completeTask).toHaveBeenCalled();
        expect(toastr.success).toHaveBeenCalled();
    });

    it('should handle form submit for generic task', () => {
        const fakeForm = { form: { valid: true } as FormGroup, data: new FormData() };
        employeeService.completeTask.and.returnValue(of({}));
        component.selectTask(3);
        component.handleFormSubmit(fakeForm, mockTasks.data[2]);
        expect(employeeService.completeTask).toHaveBeenCalled();
        expect(toastr.success).toHaveBeenCalled();
    });
});
