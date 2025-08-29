import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import {
  selectLoginError,
  selectLoginLoading,
  selectLoginToken,
  selectRole,
} from '../../../store/auth/auth.selectors';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        provideRouter([]), // ✅ Replaces RouterTestingModule
        provideMockStore({
          selectors: [
            { selector: selectLoginLoading, value: signal(false) },
            { selector: selectLoginToken, value: signal(null) },
            { selector: selectRole, value: signal(null) },
            { selector: selectLoginError, value: signal(null) },
          ]
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('should have email field required', () => {
    const email = component.form.get('email');
    email?.setValue('');
    expect(email?.hasError('required')).toBeTrue();
  });

  it('should have password field required', () => {
    const password = component.form.get('password');
    password?.setValue('');
    expect(password?.hasError('required')).toBeTrue();
  });

  it('should disable submit button when form is invalid', () => {
    component.form.get('email')?.setValue('');
    component.form.get('password')?.setValue('');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button?.disabled).toBeTrue();
  });
});
