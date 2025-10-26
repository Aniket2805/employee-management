import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, NewEmployeePayload } from '../../models/employee.model';
import { DocumentMeta } from '../../models/document.model';
import { environment } from '../../../environments/environment';
import { Task } from '../../models/task.model';
import { AuditLog } from '../../models/auditlog.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private HR_APIURL = environment.hrApiUrl;
  private IT_APIURL = environment.itApiUrl;

  constructor(private http: HttpClient) { }

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.HR_APIURL}/employees`);
  }
  getEmployeeById(employeeId: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.HR_APIURL}/employees/${employeeId}`);
  }
  startOnboarding(employeeId: number): Observable<String> {
    return this.http.post<String>(`${this.HR_APIURL}/onboarding/assign/${employeeId}`, {});
  }
  addEmployee(employee: NewEmployeePayload): Observable<Employee> {
    return this.http.post<Employee>(`${this.HR_APIURL}/employees`, employee);
  }
  deleteEmployee(employeeId: number): Observable<void> {
    return this.http.delete<void>(`${this.HR_APIURL}/employees/${employeeId}`);
  }
  getTasksForEmployee(employeeId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.HR_APIURL}/onboarding/employee/${employeeId}`);
  }
  completeTask(taskId: number, status: string): Observable<any> {
    return this.http.put(`${this.HR_APIURL}/onboarding/status/${taskId}?status=${status}`, {});
  }
  updateEmployee(id: number, employee: Partial<Employee>) {
    return this.http.put<Employee>(`${this.HR_APIURL}/employees/${id}`, employee);
  }

  getUpcomingreview(): Observable<any> {
    return this.http.get(`${this.HR_APIURL}/reviews/upcoming`);
  }

  getByUpcomingreviewEmployee(employeeId: number): Observable<any> {
    return this.http.get(`${this.HR_APIURL}/reviews/employee/${employeeId}`);
  }
  // Audit Logs
  getAuditLogs(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.HR_APIURL}/auditlog`);
  }

  // Offboarding
  offboardEmployee(employeeId: number): Observable<any> {
    return this.http.post(`${this.HR_APIURL}/employees/offboard/${employeeId}`, {});
  }

  createEmail(employeeId: number, data: Partial<Employee>) {
    return this.http.post(`${this.IT_APIURL}/itTask/createAcc/${employeeId}`, data);
  }

  getGovtDocument(employeeId: number): Observable<DocumentMeta> {
    return this.http.get<DocumentMeta>(`${this.IT_APIURL}/documents/employee/${employeeId}/document-metadata`);
  }

  uploadGovtDocument(employeeId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.IT_APIURL}/documents/upload/${employeeId}`, formData);
  }
  approveDocumment(id: number | undefined) {
    return this.http.post(`${this.IT_APIURL}/itTask/doc/${id}`, {});
  }
}
