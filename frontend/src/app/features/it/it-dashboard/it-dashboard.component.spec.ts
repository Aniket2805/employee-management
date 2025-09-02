import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItDashboardComponent } from './it-dashboard.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../core/services/employee.service';
import { selectEmployeesData, selectEmployeesError, selectEmployeesLoading } from '../../../store/employee/employee.selectors';
import { signal } from '@angular/core';
import { of } from 'rxjs';

const mockEmployees = {
    data: [
        { id: 1, firstName: 'Alice', lastName: 'Smith', onboardingStatus: 'IN_PROGRESS' as const, department: 'IT', onboardingStage: 'HR', active: true, isMentor: false, mentor: null },
        { id: 2, firstName: 'Bob', lastName: 'Jones', onboardingStatus: 'COMPLETED' as const, department: 'IT', onboardingStage: 'IT', active: true, isMentor: false, mentor: null },
        { id: 3, firstName: 'Carol', lastName: 'White', onboardingStatus: 'OFFBOARDED' as const, department: 'IT', onboardingStage: 'IT', active: false, isMentor: false, mentor: null },
    ],
    loading: false,
    error: null
};

describe('ItDashboardComponent', () => {
    let component: ItDashboardComponent;
    let fixture: ComponentFixture<ItDashboardComponent>;
    let store: MockStore;
    let router: jasmine.SpyObj<Router>;
    let employeeService: jasmine.SpyObj<EmployeeService>;

    beforeEach(async () => {
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['startOnboarding', 'deleteEmployee']);
        await TestBed.configureTestingModule({
            imports: [ItDashboardComponent],
            providers: [
                provideMockStore({
                    selectors: [
                        { selector: selectEmployeesData, value: signal(mockEmployees) },
                        { selector: selectEmployeesLoading, value: signal(false) },
                        { selector: selectEmployeesError, value: signal(null) },
                    ]
                }),
                { provide: Router, useValue: routerSpy },
                { provide: EmployeeService, useValue: employeeServiceSpy }
            ],
        }).compileComponents();

        store = TestBed.inject(MockStore);
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        employeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
        store.overrideSelector(selectEmployeesData, mockEmployees);
        fixture = TestBed.createComponent(ItDashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display total, pending, completed, and offboarded employees', () => {
        expect(component.totalEmployees).toBe(3);
        expect(component.pendingOnboarding).toBe(1);
        expect(component.completedOnboarding).toBe(1);
        expect(component.offboardedEmployees).toBe(1);
    });

    it('should dispatch loadEmployees on ngOnInit', () => {
        const dispatchSpy = spyOn(store, 'dispatch');
        component.ngOnInit();
        expect(dispatchSpy).toHaveBeenCalled();
    });

    it('should call goToEmployeeTasks and navigate', () => {
        const dispatchSpy = spyOn(store, 'dispatch');
        component.goToEmployeeTasks(2);
        expect(dispatchSpy).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/it/employees', 'tasks', 2]);
    });

    it('should set selectedEmp and open modal on viewEmployee', () => {
        component.viewEmployee(1);
        expect(component.selectedEmp).toEqual(jasmine.objectContaining({ id: 1 }));
        expect(component.modalOpen).toBeTrue();
    });

    it('should open and close modal', () => {
        component.viewEmployee(1);
        expect(component.modelOpen()).toBeTrue();
        component.closeModal();
        expect(component.modelOpen()).toBeFalse();
        expect(component.selectedEmployee()).toBeNull();
    });

    it('should return true for isItSpecialist if isItSpecialist is true', () => {
        expect(component.isItSpecialist({ isItSpecialist: true })).toBeTrue();
    });

    it('should return true for isItSpecialist if department is IT', () => {
        expect(component.isItSpecialist({ department: 'IT' })).toBeTrue();
    });

    it('should return false for isItSpecialist if not IT', () => {
        expect(component.isItSpecialist({ department: 'HR' })).toBeFalse();
    });
});
