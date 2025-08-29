import { Component, inject, Input, OnInit } from '@angular/core';
import { Employee } from '../../../models/employee.model';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectSelectedEmployee } from '../../../store/employee/employee.selectors';
import { setSelectedEmployee } from '../../../store/employee/employee.actions';

@Component({
    selector: 'app-mentor-detail',
    templateUrl: './mentor-detail.component.html',
    standalone: true,
    imports: [CommonModule],
    styleUrls: ['./mentor-detail.component.scss']
})
export class MentorDetailComponent implements OnInit {
    private store = inject(Store);
    employee = this.store.selectSignal(selectSelectedEmployee);

    ngOnInit(): void {
        const employeeIdStr = localStorage.getItem('employeeId');

        const employeeId = employeeIdStr !== null ? Number(employeeIdStr) : null;
        if (employeeId !== null && !isNaN(employeeId)) {
            console.log(employeeIdStr);
            this.store.dispatch(setSelectedEmployee({ employeeId }));
        }
    }
}
