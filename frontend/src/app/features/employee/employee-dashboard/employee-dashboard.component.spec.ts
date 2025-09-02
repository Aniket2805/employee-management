import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeDashboardComponent } from './employee-dashboard.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { EmployeeService } from '../../../core/services/employee.service';
import { of } from 'rxjs';
import { selectSelectedEmployee, selectEmployeeDocumentMeta } from '../../../store/employee/employee.selectors';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';
import { Employee } from '../../../models/employee.model';
import { DocumentMeta } from '../../../models/document.model';

const mockEmployee: Employee | null = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    department: 'IT',
    onboardingStage: 'HR',
    onboardingStatus: 'IN_PROGRESS',
    isMentor: false,
    password: null,
    active: true,
    mentor: {
        id: 2,
        firstName: 'Mentor',
        lastName: 'Kumar',
        email: 'mentor@example.com',
        department: 'HR',
        password: null,
        active: true,
        isMentor: true,
        onboardingStage: 'IT',
        onboardingStatus: 'IN_PROGRESS',
        mentor: null,
    }
};

const mockDocument: DocumentMeta = {
    id: 10,
    employeeId: 1,
    originalFileName: 'aadhar.pdf',
    storedFileName: 'aadhar-10.pdf',
    fileType: 'pdf',
    fileSize: 123456,
    uploadedAt: '2025-08-28T10:00:00Z',
    approved: true
};

describe('EmployeeDashboardComponent', () => {
    let component: EmployeeDashboardComponent;
    let fixture: ComponentFixture<EmployeeDashboardComponent>;
    let store: MockStore;
    let employeeService: jasmine.SpyObj<EmployeeService>;

    beforeEach(async () => {
        const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['uploadGovtDocument']);
        await TestBed.configureTestingModule({
            imports: [EmployeeDashboardComponent, ReactiveFormsModule, DynamicFormComponent],
            providers: [
                provideMockStore({
                    selectors: [
                        { selector: selectSelectedEmployee, value: signal(mockEmployee) },
                        { selector: selectEmployeeDocumentMeta, value: signal(mockDocument) },
                    ]
                }),
                { provide: EmployeeService, useValue: employeeServiceSpy }
            ],
        }).compileComponents();

        store = TestBed.inject(MockStore);
        employeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
        const selectedEmployee = { ...mockEmployee, active: true };
        store.overrideSelector(selectSelectedEmployee, selectedEmployee);
        store.overrideSelector(selectEmployeeDocumentMeta, mockDocument);
        fixture = TestBed.createComponent(EmployeeDashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display employee name and department', () => {
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        expect(compiled.textContent).toContain('Welcome, John Doe');
        expect(compiled.textContent).toContain('IT');
    });

    it('should show document meta if document is uploaded', () => {
        const compiled = fixture.nativeElement;
        expect(compiled.textContent).toContain('aadhar.pdf');
        expect(compiled.textContent).toContain('pdf');
        expect(compiled.textContent).toContain('123,456 bytes');
        expect(compiled.textContent).toContain('Verified');
    });

    it('should open and close upload modal', () => {
        expect(component.showUploadModal).toBeFalse();
        component.openUploadModal();
        expect(component.showUploadModal).toBeTrue();
        component.closeUploadModal();
        expect(component.showUploadModal).toBeFalse();
    });

    it('should call uploadGovtDocument and reload meta on form submit', () => {
        employeeService.uploadGovtDocument.and.returnValue(of({}));
        spyOn(component, 'closeUploadModal');
        const fakeForm = { form: {} as any, data: new FormData() };
        component.onDocumentFormSubmit(fakeForm, 1);
        expect(employeeService.uploadGovtDocument).toHaveBeenCalledWith(1, fakeForm.data);
        expect(component.closeUploadModal).toHaveBeenCalled();
    });
});
