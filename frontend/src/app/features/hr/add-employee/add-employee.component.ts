import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { addEmployee, loadEmployees, updateEmployee } from '../../../store/employee/employee.actions';
import { selectEmployeeById, selectAddOrUpdateLoading } from '../../../store/employee/employee.selectors';
@Component({
    standalone: true,
    selector: 'app-add-employee',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './add-employee.component.html',
    styleUrl: './add-employee.component.scss',
})
export class AddEmployeeComponent implements OnInit {
    private fb = inject(FormBuilder);
    private store = inject(Store);
    private route = inject(ActivatedRoute);

    form = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        department: ['', Validators.required],
        isMentor: [false]
    });

    employeeId: number | null = null;
    isEditMode = false;
    loading = this.store.selectSignal(selectAddOrUpdateLoading);

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        this.store.dispatch(loadEmployees());
        if (idParam) {
            this.isEditMode = true;
            this.employeeId = +idParam;

            this.store.select(selectEmployeeById(this.employeeId)).subscribe((emp) => {
                if (emp) {
                    this.form.patchValue({
                        firstName: emp.firstName,
                        lastName: emp.lastName,
                        department: emp.department,
                        isMentor: emp.isMentor
                    });
                }
            });
        }
    }

    submit() {
        if (this.form.valid) {
            const formValue = this.form.value;

            if (this.isEditMode && this.employeeId !== null) {
                this.store.dispatch(updateEmployee({
                    id: this.employeeId,
                    employee: {
                        firstName: formValue.firstName!,
                        lastName: formValue.lastName!,
                        department: formValue.department!,
                        isMentor: formValue.isMentor!
                    }
                }));
            } else {
                this.store.dispatch(addEmployee({
                    employee: {
                        firstName: formValue.firstName!,
                        lastName: formValue.lastName!,
                        department: formValue.department!,
                        isMentor: formValue.isMentor!
                    }
                }));
            }
        }
    }
}