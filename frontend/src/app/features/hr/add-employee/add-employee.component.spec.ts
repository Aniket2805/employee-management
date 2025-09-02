import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEmployeeComponent } from './add-employee.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('AddEmployeeComponent', () => {
    let component: AddEmployeeComponent;
    let fixture: ComponentFixture<AddEmployeeComponent>;
    let store: MockStore;
    let router: jasmine.SpyObj<Router>;
    let route: ActivatedRoute;

    beforeEach(async () => {
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        await TestBed.configureTestingModule({
            imports: [AddEmployeeComponent, ReactiveFormsModule],
            providers: [
                provideMockStore(),
                { provide: Router, useValue: routerSpy },
                { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }
            ],
        }).compileComponents();
        store = TestBed.inject(MockStore);
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        route = TestBed.inject(ActivatedRoute);
        fixture = TestBed.createComponent(AddEmployeeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have invalid form when empty', () => {
        expect(component.form.valid).toBeFalse();
    });

    it('should have required validation for all fields', () => {
        component.form.get('firstName')?.setValue('');
        component.form.get('lastName')?.setValue('');
        component.form.get('department')?.setValue('');
        expect(component.form.get('firstName')?.hasError('required')).toBeTrue();
        expect(component.form.get('lastName')?.hasError('required')).toBeTrue();
        expect(component.form.get('department')?.hasError('required')).toBeTrue();
    });

    it('should dispatch addEmployee on submit in add mode', () => {
        const dispatchSpy = spyOn(store, 'dispatch');
        component.form.setValue({ firstName: 'John', lastName: 'Doe', department: 'IT', isMentor: false });
        component.isEditMode = false;
        component.submit();
        expect(dispatchSpy).toHaveBeenCalled();
    });

    it('should dispatch updateEmployee on submit in edit mode', () => {
        const dispatchSpy = spyOn(store, 'dispatch');
        component.form.setValue({ firstName: 'Jane', lastName: 'Smith', department: 'HR', isMentor: true });
        component.isEditMode = true;
        component.employeeId = 5;
        component.submit();
        expect(dispatchSpy).toHaveBeenCalled();
    });

    it('should patch form values in edit mode on ngOnInit', () => {
        // Mock route param and selector
        const emp = { firstName: 'Edit', lastName: 'User', department: 'HR', isMentor: true };
        spyOn(route.snapshot.paramMap, 'get').and.returnValue('10');
        spyOn(store, 'select').and.returnValue(of(emp));
        component.ngOnInit();
        expect(component.form.value).toEqual(jasmine.objectContaining(emp));
    });
});
