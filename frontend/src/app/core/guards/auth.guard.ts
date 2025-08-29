import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectLoginToken, selectRole } from '../../store/auth/auth.selectors';

export function authGuard(...allowedRoles: string[]): CanActivateFn {
  return () => {
    const store = inject(Store);
    const router = inject(Router);

    const token = store.selectSignal(selectLoginToken);
    const role = store.selectSignal(selectRole);

    if (!token()) {
      router.navigate(['/login']);
      return false;
    }

    if (allowedRoles.length && !allowedRoles.includes(role() || '')) {
      router.navigate(['/unauthorized']); // or some access denied page
      return false;
    }

    return true;
  };
}
