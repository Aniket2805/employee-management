
import { Routes } from '@angular/router';
import { guestOnlyGuard } from './core/guards/guest-only.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'change-password',
        canActivate: [authGuard()],
        loadComponent: () => import('./shared/change-password/change-password.component').then(m => m.ChangePasswordComponent)
    },
    {
        path: 'login',
        canActivate: [guestOnlyGuard],
        loadComponent: () =>
            import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    },
    {
        path: 'signup',
        canActivate: [guestOnlyGuard],
        loadComponent: () =>
            import('./features/auth/signup/signup.component').then((m) => m.SignupComponent),
    },
    {
        path: 'hr/dashboard',
        canActivate: [authGuard('HR')],
        data: { roles: ['HR'] },
        loadComponent: () =>
            import('./features/hr/hr-dashboard/hr-dashboard.component').then((m) => m.HrDashboardComponent),
    },
    {
        path: 'hr/employees/add',
        canActivate: [authGuard('HR')],
        loadComponent: () =>
            import('./features/hr/add-employee/add-employee.component').then(
                m => m.AddEmployeeComponent
            )
    },
    {
        path: 'hr/employees/edit/:id',
        canActivate: [authGuard('HR')],
        loadComponent: () =>
            import('./features/hr/add-employee/add-employee.component').then(
                m => m.AddEmployeeComponent
            )
    },
    {
        path: 'unauthorized',
        loadComponent: () => import('./shared/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
    },
    {
        path: 'hr/employees/tasks/:id',
        canActivate: [authGuard('HR')],
        data: { roles: ['HR'] },
        loadComponent: () =>
            import('./features/hr/employee-tasks/employee-tasks.component').then((m) => m.EmployeeTasksComponent),
    },
    {
        path: 'hr/reviews',
        canActivate: [authGuard('HR')],
        data: { roles: ['HR'] },
        loadComponent: () => import('./features/hr/performance-reviews/performance-reviews.component').then(m => m.PerformanceReviewsComponent)
    },
    {
        path: 'hr/audit-log',
        canActivate: [authGuard('HR')],
        data: { roles: ['HR'] },
        loadComponent: () => import('./features/hr/audit-log/audit-log.component').then(m => m.AuditLogComponent)
    },
    {
        path: 'it/dashboard',
        canActivate: [authGuard('IT')],
        data: { roles: ['IT'] },
        loadComponent: () =>
            import('./features/it/it-dashboard/it-dashboard.component').then((m) => m.ItDashboardComponent),
    },
    {
        path: 'it/employees/tasks/:id',
        canActivate: [authGuard('IT')],
        data: { roles: ['IT'] },
        loadComponent: () =>
            import('./features/it/employee-tasks/employee-tasks.component').then((m) => m.EmployeeTasksComponent),
    },
    {
        path: 'employee/dashboard',
        canActivate: [authGuard('EMPLOYEE')],
        data: { roles: ['EMPLOYEE'] },
        loadComponent: () =>
            import('./features/employee/employee-dashboard/employee-dashboard.component').then((m) => m.EmployeeDashboardComponent),
    },
    {
        path: 'employee/mentor',
        canActivate: [authGuard('EMPLOYEE')],
        data: { roles: ['EMPLOYEE'] },
        loadComponent: () => import('./features/employee/mentor-detail/mentor-detail.component').then(m => m.MentorDetailComponent),
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'not-found',
        pathMatch: 'full'
    },
    {
        path: 'not-found',
        loadComponent: () => import('./shared/not-found/not-found.component').then(m => m.NotFoundComponent)
    }
];
