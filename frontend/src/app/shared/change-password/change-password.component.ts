import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    });

    loading = false;

    submit() {
        if (this.form.invalid) return;
        this.loading = true;
        const { email, currentPassword, newPassword } = this.form.value;
        this.authService.changePassword({ email, currentPassword, newPassword }).subscribe({
            next: () => {
                this.toastr.success('Password changed successfully!');
                this.router.navigate(['/employee/dashboard']);
            },
            error: (err) => {
                this.toastr.error(err?.error?.message || 'Failed to change password');
                this.loading = false;
            }
        });
    }
}
