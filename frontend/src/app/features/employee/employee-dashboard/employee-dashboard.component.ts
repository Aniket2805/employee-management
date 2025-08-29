import { Component, OnInit, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';

import { selectEmployeeDocumentMeta, selectSelectedEmployee } from '../../../store/employee/employee.selectors';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { loadEmployeeDocumentMeta, setSelectedEmployee } from '../../../store/employee/employee.actions';
import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { EmployeeService } from '../../../core/services/employee.service';
@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormComponent],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.scss'
})
export class EmployeeDashboardComponent implements OnInit {
  private store = inject(Store);
  private employeeService = inject(EmployeeService);
  employee = this.store.selectSignal(selectSelectedEmployee);
  document = this.store.selectSignal(selectEmployeeDocumentMeta);

  showUploadModal = false;
  documentFormSchema = {
    "formTitle": "Employee ID Verification Form",
    "formControls": [
      {
        "name": "idType",
        "label": "ID Type",
        "type": "select",
        "class": "col-md-6",
        "options": [
          {
            "label": "Aadhar Card",
            "value": "aadhar"
          },
          {
            "label": "Passport",
            "value": "passport"
          },
          {
            "label": "Driving License",
            "value": "driving_license"
          },
          {
            "label": "Voter ID",
            "value": "voter_id"
          }
        ],
        "validators": [
          {
            "validatorName": "required",
            "required": true,
            "message": "ID Type is required"
          }
        ]
      },
      {
        "name": "idNumber",
        "label": "ID Number",
        "type": "input",
        "placeholder": "Enter your ID number",
        "class": "col-md-6",
        "validators": [
          {
            "validatorName": "required",
            "required": true,
            "message": "ID Number is required"
          },
          {
            "validatorName": "minLength",
            "minLength": 5,
            "message": "ID Number must be at least 5 characters"
          }
        ]
      },
      {
        "name": "idFile",
        "label": "Upload ID Document",
        "type": "file",
        "class": "col-md-12",
        "validators": [
          {
            "validatorName": "required",
            "required": true,
            "message": "ID document upload is required"
          },
          {
            "validatorName": "fileExtension",
            "allowedExtensions": [
              "pdf",
              "jpg",
              "jpeg",
              "png"
            ],
            "message": "Only PDF or image files are allowed"
          }
        ]
      }
    ]
  };

  ngOnInit(): void {
    const employeeIdStr = localStorage.getItem('employeeId');
    const employeeId = employeeIdStr !== null ? Number(employeeIdStr) : null;
    if (employeeId !== null && !isNaN(employeeId)) {
      this.store.dispatch(setSelectedEmployee({ employeeId }));
      this.store.dispatch(loadEmployeeDocumentMeta({ employeeId }))
    }
  }

  openUploadModal() {
    this.showUploadModal = true;
  }

  closeUploadModal() {
    this.showUploadModal = false;
  }

  onDocumentFormSubmit($event: { form: FormGroup, data: FormData }, id: number) {
    this.employeeService.uploadGovtDocument(id, $event.data).subscribe(() => {
      this.store.dispatch(loadEmployeeDocumentMeta({ employeeId: id }))
    });
    this.closeUploadModal();
  }
}