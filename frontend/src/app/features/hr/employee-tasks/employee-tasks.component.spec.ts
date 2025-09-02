import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeTasksComponent } from './employee-tasks.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { EmployeeService } from '../../../core/services/employee.service';
import { ToastrService } from 'ngx-toastr';
import { selectRole } from '../../../store/auth/auth.selectors';
import { selectEmployeeTasks, selectSelectedEmployee } from '../../../store/employee/employee.selectors';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

const mockTasks = {
    data: [
        { taskId: 1, title: 'HR Task 1', department: 'HR', status: 'IN_PROGRESS', orderIndex: 1, description: '', formlyConfigJson: null },
        { taskId: 2, title: 'HR Task 2', department: 'HR', status: 'COMPLETED', orderIndex: 2, description: '', formlyConfigJson: null },
        { taskId: 3, title: 'Other Task', department: 'IT', status: 'COMPLETED', orderIndex: 3, description: '', formlyConfigJson: null },
    ],
    loading: false,
    error: null
};
const mockEmployee = {
    id: 1,
    firstName: 'Alice',
    lastName: 'Smith',
    department: 'HR',
    active: true,
    isMentor: false,
    onboardingStage: 'HR',
    onboardingStatus: 'IN_PROGRESS' as const,
    mentor: null
};

describe('EmployeeTasksComponent', () => {
    let component: EmployeeTasksComponent;
    let fixture: ComponentFixture<EmployeeTasksComponent>;
    let store: MockStore;
    let employeeService: jasmine.SpyObj<EmployeeService>;
    let toastr: jasmine.SpyObj<ToastrService>;

    beforeEach(async () => {
        const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', [
            'completeTask'
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
    });

    function setupSelectors(role = 'HR') {
        store.overrideSelector(selectRole, role);
        store.overrideSelector(selectEmployeeTasks, mockTasks);
        store.overrideSelector(selectSelectedEmployee, mockEmployee);
    }

    beforeEach(() => {
        setupSelectors();
        fixture = TestBed.createComponent(EmployeeTasksComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should filter tasks by role', () => {
        expect(component.filteredTasks().length).toBe(2);
        expect(component.filteredTasks()[0].department).toBe('HR');
    });

    it('should return true if all tasks for role are completed', () => {
        store.overrideSelector(selectEmployeeTasks, {
            data: [
                { taskId: 1, title: 'Task 1', department: 'HR', status: 'COMPLETED', orderIndex: 1, description: '', formlyConfigJson: null },
                { taskId: 2, title: 'Task 2', department: 'HR', status: 'COMPLETED', orderIndex: 2, description: '', formlyConfigJson: null },
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
        expect(task?.title).toBe('HR Task 2');
    });

    it('should handle form submit for task', () => {
        const fakeForm = { form: { valid: true } as FormGroup, data: new FormData() };
        employeeService.completeTask.and.returnValue(of({}));
        component.selectTask(1);
        component.handleFormSubmit(fakeForm, mockTasks.data[0]);
        expect(employeeService.completeTask).toHaveBeenCalledWith(1, 'COMPLETED');
        expect(toastr.success).toHaveBeenCalled();
    });
});
