import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HrDashboardComponent } from './hr-dashboard.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../core/services/employee.service';
import { ToastrService } from 'ngx-toastr';
import { selectEmployeesData, selectEmployeesError, selectEmployeesLoading } from '../../../store/employee/employee.selectors';
import { signal } from '@angular/core';
import { of } from 'rxjs';

const mockEmployees = {
    data: [
        { id: 1, firstName: 'Alice', lastName: 'Smith', onboardingStatus: 'IN_PROGRESS' as const, department: 'HR', onboardingStage: 'HR', active: true, isMentor: false, mentor: null },
        { id: 2, firstName: 'Bob', lastName: 'Jones', onboardingStatus: 'COMPLETED' as const, department: 'HR', onboardingStage: 'HR', active: true, isMentor: false, mentor: null },
        { id: 3, firstName: 'Carol', lastName: 'White', onboardingStatus: 'OFFBOARDED' as const, department: 'HR', onboardingStage: 'HR', active: false, isMentor: false, mentor: null },
    ],
    loading: false,
    error: null
};

describe('HrDashboardComponent', () => {
    let component: HrDashboardComponent;
    let fixture: ComponentFixture<HrDashboardComponent>;
    let store: MockStore;
    let router: jasmine.SpyObj<Router>;
    let employeeService: jasmine.SpyObj<EmployeeService>;
    let toastr: jasmine.SpyObj<ToastrService>;

    beforeEach(async () => {
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['startOnboarding']);
        const toastrSpy = jasmine.createSpyObj('ToastrService', ['success']);
        await TestBed.configureTestingModule({
            imports: [HrDashboardComponent],
            providers: [
                provideMockStore({
                    selectors: [
                        { selector: selectEmployeesData, value: signal(mockEmployees) },
                        { selector: selectEmployeesLoading, value: signal(false) },
                        { selector: selectEmployeesError, value: signal(null) },
                    ]
                }),
                { provide: Router, useValue: routerSpy },
                { provide: EmployeeService, useValue: employeeServiceSpy },
                { provide: ToastrService, useValue: toastrSpy }
            ],
        }).compileComponents();

        store = TestBed.inject(MockStore);
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        employeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
        toastr = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
        store.overrideSelector(selectEmployeesData, mockEmployees);
        fixture = TestBed.createComponent(HrDashboardComponent);
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

    it('should call startOnboarding and reload employees', () => {
        employeeService.startOnboarding.and.returnValue(of(''));
        const dispatchSpy = spyOn(store, 'dispatch');
        component.startOnboarding(1);
        expect(employeeService.startOnboarding).toHaveBeenCalledWith(1);
        expect(toastr.success).toHaveBeenCalled();
        expect(dispatchSpy).toHaveBeenCalled();
    });

    it('should navigate to editEmployee', () => {
        component.editEmployee(2);
        expect(router.navigate).toHaveBeenCalledWith(['/hr/employees/edit', 2]);
    });

    it('should dispatch deleteEmployee', () => {
        const dispatchSpy = spyOn(store, 'dispatch');
        component.deleteEmployee(1);
        expect(dispatchSpy).toHaveBeenCalled();
    });

    it('should go to employee tasks and navigate', () => {
        const dispatchSpy = spyOn(store, 'dispatch');
        component.goToEmployeeTasks(1);
        expect(dispatchSpy).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/hr/employees', 'tasks', 1]);
    });

    it('should set modelOpen true on viewEmployee and false on closeModal', () => {
        component.viewEmployee(1);
        expect(component.modelOpen()).toBeTrue();
        component.closeModal();
        expect(component.modelOpen()).toBeFalse();
    });

    it('should navigate to addEmployee', () => {
        component.addEmployee();
        expect(router.navigate).toHaveBeenCalledWith(['/hr/employees/add']);
    });

    it('should dispatch offboardEmployee and reload employees', () => {
        const dispatchSpy = spyOn(store, 'dispatch');
        component.offboardEmployee(3);
        expect(dispatchSpy).toHaveBeenCalled();
    });
});
