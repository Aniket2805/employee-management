import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { selectSignupError, selectSignupSuccess } from '../../../store/auth/auth.selectors';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        provideRouter([]), // ✅ Replaces deprecated RouterTestingModule
        provideMockStore({
          selectors: [
            {
              selector: selectSignupError,
              value: of(null), // or provide an actual signal if needed
            },
            {
              selector: selectSignupSuccess,
              value: of(false),
            }
          ]
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('should require fullName', () => {
    const fullName = component.form.get('fullName');
    fullName?.setValue('');
    expect(fullName?.hasError('required')).toBeTrue();
  });

  it('should require email', () => {
    const email = component.form.get('email');
    email?.setValue('');
    expect(email?.hasError('required')).toBeTrue();
  });

  it('should require password', () => {
    const password = component.form.get('password');
    password?.setValue('');
    expect(password?.hasError('required')).toBeTrue();
  });

  it('should require role', () => {
    const role = component.form.get('role');
    role?.setValue('');
    expect(role?.hasError('required')).toBeTrue();
  });

  it('should have valid form when all fields are filled', () => {
    component.form.get('fullName')?.setValue('Test User');
    component.form.get('email')?.setValue('test@example.com');
    component.form.get('password')?.setValue('password123');
    component.form.get('role')?.setValue('EMPLOYEE');
    expect(component.form.valid).toBeTrue();
  });
});
