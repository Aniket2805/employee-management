/// <reference types="jasmine" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangePasswordComponent } from './change-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';

describe('ChangePasswordComponent', () => {
    let component: ChangePasswordComponent;
    let fixture: ComponentFixture<ChangePasswordComponent>;
    let authService: jasmine.SpyObj<AuthService>;
    let router: jasmine.SpyObj<Router>;
    let toastr: jasmine.SpyObj<ToastrService>;

    beforeEach(async () => {
        const authServiceSpy = jasmine.createSpyObj('AuthService', ['changePassword']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
        await TestBed.configureTestingModule({
            imports: [ChangePasswordComponent, ReactiveFormsModule],
            providers: [
                { provide: AuthService, useValue: authServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: ToastrService, useValue: toastrSpy }
            ],
        }).compileComponents();
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        toastr = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
        fixture = TestBed.createComponent(ChangePasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have invalid form when empty', () => {
        expect(component.form.valid).toBeFalse();
    });

    it('should require all fields and validate email', () => {
        component.form.setValue({ email: '', currentPassword: '', newPassword: '' });
        expect(component.form.get('email')?.hasError('required')).toBeTrue();
        expect(component.form.get('currentPassword')?.hasError('required')).toBeTrue();
        expect(component.form.get('newPassword')?.hasError('required')).toBeTrue();
        component.form.get('email')?.setValue('not-an-email');
        expect(component.form.get('email')?.hasError('email')).toBeTrue();
    });

    it('should call changePassword and navigate on success', () => {
        component.form.setValue({ email: 'test@example.com', currentPassword: 'oldpass', newPassword: 'newpass123' });
        authService.changePassword.and.returnValue(of({}));
        component.submit();
        expect(authService.changePassword).toHaveBeenCalledWith({
            email: 'test@example.com', currentPassword: 'oldpass', newPassword: 'newpass123'
        });
        expect(toastr.success).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/employee/dashboard']);
    });

    it('should show error and set loading false on failure', () => {
        component.form.setValue({ email: 'test@example.com', currentPassword: 'oldpass', newPassword: 'newpass123' });
        authService.changePassword.and.returnValue(throwError(() => ({ error: { message: 'fail' } })));
        component.submit();
        expect(authService.changePassword).toHaveBeenCalled();
        expect(toastr.error).toHaveBeenCalledWith('fail');
        expect(component.loading).toBeFalse();
    });
});
