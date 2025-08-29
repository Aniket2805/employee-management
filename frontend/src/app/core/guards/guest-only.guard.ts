import { computed, effect, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectLoginToken, selectRole } from '../../store/auth/auth.selectors';

export const guestOnlyGuard: CanActivateFn = () => {
  const router = inject(Router);
  const store = inject(Store);
  const token = store.selectSignal(selectLoginToken);
  const role = store.selectSignal(selectRole);

  const isLoggedIn = computed(() => !!token());

  effect(
    () => {
      if (isLoggedIn()) {
        // 🔁 Redirect based on role
        const userRole = role();
        if (userRole === 'HR') router.navigate(['/hr/dashboard']);
        else if (userRole === 'IT') router.navigate(['/it/dashboard']);
        else router.navigate(['/employee/dashboard']);
      }
    },
    { allowSignalWrites: true }
  );
  return !isLoggedIn();;
};
