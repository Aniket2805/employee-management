import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { FormlyConfigJson, FormControl as FormField, Validator as FieldValidator } from '../../models/task.model'; // adjust the path
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-dynamic-form',
    standalone: true,
    templateUrl: './dynamic-form.component.html',
    imports: [CommonModule, ReactiveFormsModule],
})
export class DynamicFormComponent implements OnInit {
    @Input() formSchema!: FormlyConfigJson;
    @Input() employeeId?: string;
    @Output() formSubmit = new EventEmitter<{ form: FormGroup, data: FormData }>();
    form: FormGroup = new FormGroup({});
    fileControls: { [key: string]: File | null } = {};

    constructor(private fb: FormBuilder) { } // ✅ Proper constructor initialization

    // inject HttpClient and AuthService (standalone-friendly)
    private http = inject(HttpClient);
    private authService = inject(AuthService);

    ngOnInit(): void {
        this.buildForm();
    }

    buildForm(): void {
        const group: { [key: string]: any } = {};
        this.formSchema?.formControls?.forEach((control: FormField) => {
            const validators: ValidatorFn[] = [];
            control.validators?.forEach((v: FieldValidator) => {
                if (v.validatorName === 'required' && v.required) {
                    validators.push(Validators.required);
                }
                if (v.validatorName === 'minLength' && v.minLength) {
                    validators.push(Validators.minLength(v.minLength));
                }
                if (v.validatorName === 'maxLength' && v.maxLength) {
                    validators.push(Validators.maxLength(v.maxLength));
                }
                if (v.validatorName === 'pattern' && v.pattern) {
                    validators.push(Validators.pattern(v.pattern));
                }
                if (v.validatorName === 'fileExtension') {
                    // Custom validator for file extension
                    validators.push(this.fileExtensionValidator(v.allowedExtensions || [], control.name));
                }
            });
            if (control.type === 'multicheckbox') {
                // Initialize as FormArray of booleans
                const arr = control.options?.map(() => false) || [];
                group[control.name] = this.fb.array(arr, validators);
            } else {
                group[control.name] = this.fb.control('', validators);
            }
        });
        this.form = this.fb.group(group);
    }

    resolveLink(url?: string): string {
        if (!url) return '#';
        if (this.employeeId) {
            return url.replace('{employeeId}', this.employeeId);
        }
        return url;
    }

    multicheckboxControls(controlName: string): FormControl[] {
        const arr = this.form.get(controlName);
        return arr && (arr instanceof FormArray)
            ? arr.controls.map(ctrl => ctrl as FormControl)
            : [];
    }
    /**
     * Fetches a readonly document URL with Authorization header and opens it in a new tab.
     * Falls back to opening the direct URL when no token is available.
     */
    async openReadOnly(url?: string) {
        const resolved = this.resolveLink(url);
        const token = this.authService.getToken();
        try {
            if (token) {
                // fetch as blob with auth header
                const resp = await firstValueFrom(this.http.get(resolved, { responseType: 'blob', headers: { Authorization: `Bearer ${token}` } }));
                const blobUrl = URL.createObjectURL(resp);
                window.open(blobUrl, '_blank');
                // revoke after short delay
                setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
            } else {
                // no token available - open directly
                window.open(resolved, '_blank');
            }
        } catch (err) {
            console.error('Failed to open readonly link', err);
            // fallback to direct open
            window.open(resolved, '_blank');
        }
    }

    // Custom validator for file extension
    fileExtensionValidator(allowedExtensions: string[], controlName: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const file = control.value;
            if (!file) return null;
            if (typeof file.name !== 'string') return null;
            const ext = file.name.split('.').pop()?.toLowerCase();
            const valid = allowedExtensions.includes(ext || '');
            return valid ? null : { fileExtension: true };
        };
    }
    // File input change handler
    onFileChange(event: Event, controlName: string): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0] || null;
        this.fileControls[controlName] = file;
        // Set the file object itself for validation
        this.form.get(controlName)?.setValue(file);
        this.form.get(controlName)?.markAsTouched();
        this.form.get(controlName)?.updateValueAndValidity();
    }

    onSubmit(): void {
        if (this.form.valid) {
            const formData = new FormData();
            this.formSchema.formControls?.forEach((control) => {
                if (control.type === 'file') {
                    // Use 'file' as the key to match backend API
                    formData.append('file', this.fileControls[control.name] as Blob);
                } else if (control.type === 'multicheckbox') {
                    // Serialize checked options as array of values
                    const arr = this.form.get(control.name) as FormArray;
                    const selected = (arr.value as boolean[])
                        .map((checked, idx) => (checked && control.options ? control.options[idx].value : null))
                        .filter(v => v !== null);
                    formData.append(control.name, JSON.stringify(selected));
                } else {
                    formData.append(control.name, this.form.get(control.name)?.value);
                }
            });
            this.formSubmit.emit({ form: this.form, data: formData });
        } else {
            this.form.markAllAsTouched();
        }
    }
    getValidatorMessage(control: FormField, type: string): string | undefined {
        return control.validators?.find(v => v.validatorName === type)?.message;
    }

    isRequired(control: FormField): boolean {
        return !!control.validators?.some(v => v.validatorName === 'required' && v.required);
    }
}
