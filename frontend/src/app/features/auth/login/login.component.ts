import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router, RouterModule } from '@angular/router';
import { login } from '../../../store/auth/auth.actions';
import {selectLoginError, selectLoginLoading, selectLoginToken, selectRole } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required,Validators.minLength(6)]],
  });

  loading = this.store.selectSignal(selectLoginLoading);
  token = this.store.selectSignal(selectLoginToken);
  role = this.store.selectSignal(selectRole);

  constructor() {
    // Redirect on successful login
    effect(() => {
      const token = this.token();
      const role = this.role();
      if (token && role) {
        if (role === 'HR') this.router.navigate(['/hr/dashboard']);
        else if (role === 'IT') this.router.navigate(['/it/dashboard']);
        else this.router.navigate(['/employee/dashboard']);
      }
    }, { allowSignalWrites: true });
  }

  onSubmit() {
    if (this.form.invalid) return;
    
    const email = this.form.get('email')?.value ?? '';
    const password = this.form.get('password')?.value ?? '';
    this.store.dispatch(login({ email, password }));
  }
}
