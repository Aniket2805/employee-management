import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-change-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    private toastr = inject(ToastrService);

    form: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        currentPassword: ['', [Validators.required, Validators.minLength(6)]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    }, { validators: this.passwordMatchValidator });

    loading = false;

    /**
     * Custom validator to check if new password and confirm password match
     */
    private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const newPassword = control.get('newPassword');
        const confirmPassword = control.get('confirmPassword');

        if (!newPassword || !confirmPassword) {
            return null;
        }

        if (confirmPassword.errors && !confirmPassword.errors['passwordMismatch']) {
            return null;
        }

        if (newPassword.value !== confirmPassword.value) {
            confirmPassword.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        } else {
            confirmPassword.setErrors(null);
            return null;
        }
    }

    submit() {
        // Check if passwords match before submitting
        if (this.form.hasError('passwordMismatch')) {
            this.toastr.error('Passwords do not match. Please re-enter your password.');
            return;
        }

        if (this.form.invalid) {
            this.toastr.error('Please fill all fields correctly');
            return;
        }

        this.loading = true;
        const { email, currentPassword, newPassword } = this.form.value;
        this.authService.changePassword({ email, currentPassword, newPassword }).subscribe({
            next: () => {
                this.toastr.success('Password changed successfully!');
                this.router.navigate(['/hr/dashboard']);
            },
            error: (err) => {
                this.toastr.error(err?.error?.message || 'Failed to change password');
                this.loading = false;
            }
        });
    }
}
