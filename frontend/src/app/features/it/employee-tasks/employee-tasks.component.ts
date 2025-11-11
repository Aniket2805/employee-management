import {
    Component,
    OnInit,
    inject,
    signal,
    computed,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { CommonModule } from '@angular/common';

import { EmployeeService } from '../../../core/services/employee.service';
import { selectRole } from '../../../store/auth/auth.selectors';
import {
    loadEmployeeDocumentMeta,
    loadEmployeeTasks,
    setSelectedEmployee,
} from '../../../store/employee/employee.actions';
import {
    selectEmployeeDocumentMeta,
    selectEmployeeTasks,
    selectSelectedEmployee,
} from '../../../store/employee/employee.selectors';
import { ToastrService } from 'ngx-toastr';
import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { Task } from '../../../models/task.model';
import { Employee } from '../../../models/employee.model';
@Component({
    selector: 'app-employee-tasks',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormlyBootstrapModule,
        DynamicFormComponent
    ],
    templateUrl: './employee-tasks.component.html',
})
export class EmployeeTasksComponent implements OnInit {
    private store = inject(Store);
    private route = inject(ActivatedRoute);
    private employeeService = inject(EmployeeService);
    private toastr = inject(ToastrService);
    employeeId = Number(this.route.snapshot.paramMap.get('id'));
    role = this.store.selectSignal(selectRole);
    tasks = this.store.selectSignal(selectEmployeeTasks);
    employee = this.store.selectSignal(selectSelectedEmployee);
    document = this.store.selectSignal(selectEmployeeDocumentMeta);
    selectedTask = signal<Task | undefined>(undefined);

    selectTask(id: number) {
        this.selectedTask.set(this.getTaskById(id));
    }


    filteredTasks = computed(() =>
        this.tasks().data.filter((task) => task.department === this.role())
    );

    allTasksCompleted = computed(() => {
        const tasksForRole = this.filteredTasks();
        return tasksForRole.length > 0 && tasksForRole.every((t) => t.status === 'COMPLETED');
    });

    closeModal() {
        this.selectedTask.set(undefined);
    }

    getTaskById(id: number) {
        return this.filteredTasks().find(task => task.taskId === id);
    }
    ngOnInit(): void {
        this.store.dispatch(loadEmployeeTasks({ employeeId: this.employeeId }));
        this.store.dispatch(setSelectedEmployee({ employeeId: this.employeeId }));
        this.store.dispatch(loadEmployeeDocumentMeta({ employeeId: this.employeeId }));
    }

    handleFormSubmit($event: { form: FormGroup, data: FormData }, task: any) {
        if ($event.form.valid) {
            if (task.title === "Create Official Email ID") {
                $event.data.append('fullName', `${this.employee()?.firstName} ${this.employee()?.lastName}`);
                const employee: Partial<Employee> = {
                    fullName: `${this.employee()?.firstName} ${this.employee()?.lastName}`,
                    email: $event.data.get('officialEmail') as string,
                    password: $event.data.get('temporaryPassword') as string,
                };
                this.employeeService.createEmail(this.employeeId, employee).subscribe({
                    next: () => {
                        this.toastr.success('Email account created successfully');
                        this.closeModal();
                        this.store.dispatch(loadEmployeeTasks({ employeeId: this.employeeId }));
                    },
                    error: (err) => {
                        console.error(err);
                        this.closeModal();
                        this.toastr.error('Failed to create email account. Please try again.');
                        return;
                    }
                });
            }
            if (task.title === "Approve Uploaded Documents") {
                this.employeeService.approveDocumment(this.document()?.id).subscribe({
                    next: () => {
                        this.toastr.success('Document approved successfully');
                        this.closeModal();
                        this.store.dispatch(loadEmployeeTasks({ employeeId: this.employeeId }));
                    }
                    ,
                    error: (err) => {
                        console.error(err);
                        this.closeModal();
                        this.toastr.error('Failed to approve document. Please try again.');
                        return;
                    }
                });
            }
            this.employeeService
                .completeTask(task.taskId, "COMPLETED")
                .subscribe(
                    {
                        next: () => {
                            this.toastr.success('Task completed successfully');
                            this.closeModal();
                            this.store.dispatch(loadEmployeeTasks({ employeeId: this.employeeId }));
                        },
                        error: (err) => {
                            console.error(err);
                            this.closeModal();
                            this.toastr.error('Failed to complete the task. Please try again.');
                        }
                    }
                );
        }
    }
}
