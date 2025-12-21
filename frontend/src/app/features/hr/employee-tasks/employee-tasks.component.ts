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
import {
    FormlyFieldConfig,
    FormlyFormOptions,
    FormlyModule,
} from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { CommonModule } from '@angular/common';

import { EmployeeService } from '../../../core/services/employee.service';
import { selectRole } from '../../../store/auth/auth.selectors';
import {
    loadEmployeeTasks,
    setSelectedEmployee,
} from '../../../store/employee/employee.actions';
import {
    selectEmployeesLoading,
    selectEmployeeTasks,
    selectEmployeeTasksError,
    selectEmployeeTasksLoading,
    selectSelectedEmployee,
} from '../../../store/employee/employee.selectors';
import { ToastrService } from 'ngx-toastr';
import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { Task } from '../../../models/task.model';
import { LoadingComponent } from '../../../shared/loading/loading.component';

@Component({
    selector: 'app-employee-tasks',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormlyModule,
        FormlyBootstrapModule,
        DynamicFormComponent,
        LoadingComponent
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
    loading = this.store.selectSignal(selectEmployeeTasksLoading);
    tasksError = this.store.selectSignal(selectEmployeeTasksError);

    selectedTask = signal<Task | undefined>(undefined);

    formsMap = signal<{ [taskId: number]: FormGroup }>({});
    fieldsMap = signal<{ [taskId: number]: FormlyFieldConfig[] }>({});
    optionsMap = signal<{ [taskId: number]: FormlyFormOptions }>({});

    selectTask(id: number) {
        // this.selectedTaskId.set(id);.
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
        console.log(this.filteredTasks());
        return this.filteredTasks().find(task => task.taskId === id);
    }
    ngOnInit(): void {
        this.store.dispatch(loadEmployeeTasks({ employeeId: this.employeeId }));
        this.store.dispatch(setSelectedEmployee({ employeeId: this.employeeId }));
    }

    handleFormSubmit($event: { form: FormGroup, data: FormData }, task: any) {
        // also catch errors and show toastr
        if ($event.form.valid) {
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
