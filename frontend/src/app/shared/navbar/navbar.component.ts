import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectLoginToken, selectRole } from '../../store/auth/auth.selectors';
import { logout } from '../../store/auth/auth.actions';
import { selectSelectedEmployee } from '../../store/employee/employee.selectors';
import { setSelectedEmployee } from '../../store/employee/employee.actions';
@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    private store = inject(Store);
    isMenuOpen = false;
    token = this.store.selectSignal(selectLoginToken);
    role = this.store.selectSignal(selectRole);
    employee = this.store.selectSignal(selectSelectedEmployee);
    ngOnInit(): void {
        const employeeIdStr = localStorage.getItem('employeeId');
        const employeeId = employeeIdStr !== null ? Number(employeeIdStr) : null;
        if (employeeId !== null && !isNaN(employeeId)) {
            this.store.dispatch(setSelectedEmployee({ employeeId }));
        }
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }

    logout() {
        this.store.dispatch(logout());
    }
}
