import { Component, computed, effect, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Router, RouterModule } from '@angular/router';
import { selectSignupError, selectSignupLoading, selectSignupSuccess } from '../../../store/auth/auth.selectors';
import { signup } from '../../../store/auth/auth.actions';
import { LoadingComponent } from '../../../shared/loading/loading.component';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, LoadingComponent],
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
    private fb = inject(FormBuilder);
    private store = inject(Store);
    private router = inject(Router);

    form = this.fb.group({
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        role: ['EMPLOYEE', Validators.required],
    });

    roles = ['HR', 'IT', 'EMPLOYEE'];
    error = this.store.selectSignal(selectSignupError);
    success = this.store.selectSignal(selectSignupSuccess);
    loading = this.store.selectSignal(selectSignupLoading);

    constructor() {
        effect(
            () => {
                if (this.success()) {
                    this.router.navigate(['/login']);
                }
            },
            { allowSignalWrites: true }
        );
    }

    onSubmit() {
        if (this.form.invalid) return;

        const { fullName, email, password, role } = this.form.value;
        this.store.dispatch(
            signup({
                fullName: fullName ?? '',
                email: email ?? '',
                password: password ?? '',
                role: role ?? 'EMPLOYEE',
            })
        );
    }
}
