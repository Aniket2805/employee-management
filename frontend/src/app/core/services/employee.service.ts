import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, NewEmployeePayload } from '../../models/employee.model';
import { DocumentMeta } from '../../models/document.model';
import { Task } from '../../models/task.model';
import { AuditLog } from '../../models/auditlog.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private HR_API_URL = "https://hr-service.up.railway.app/api";
  private IT_API_URL = "https://it-service.up.railway.app/api";

  constructor(private http: HttpClient) { }

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.HR_API_URL}/employees`);
  }
  getEmployeeById(employeeId: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.HR_API_URL}/employees/${employeeId}`);
  }
  startOnboarding(employeeId: number): Observable<String> {
    return this.http.post<String>(`${this.HR_API_URL}/onboarding/assign/${employeeId}`, {});
  }
  addEmployee(employee: NewEmployeePayload): Observable<Employee> {
    return this.http.post<Employee>(`${this.HR_API_URL}/employees`, employee);
  }
  deleteEmployee(employeeId: number): Observable<void> {
    return this.http.delete<void>(`${this.HR_API_URL}/employees/${employeeId}`);
  }
  getTasksForEmployee(employeeId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.HR_API_URL}/onboarding/employee/${employeeId}`);
  }
  completeTask(taskId: number, status: string): Observable<any> {
    return this.http.put(`${this.HR_API_URL}/onboarding/status/${taskId}?status=${status}`, {});
  }
  updateEmployee(id: number, employee: Partial<Employee>) {
    return this.http.put<Employee>(`${this.HR_API_URL}/employees/${id}`, employee);
  }

  getUpcomingreview(): Observable<any> {
    return this.http.get(`${this.HR_API_URL}/reviews/upcoming`);
  }

  getByUpcomingreviewEmployee(employeeId: number): Observable<any> {
    return this.http.get(`${this.HR_API_URL}/reviews/employee/${employeeId}`);
  }
  // Audit Logs
  getAuditLogs(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.HR_API_URL}/auditlog`);
  }

  // Offboarding
  offboardEmployee(employeeId: number): Observable<any> {
    return this.http.post(`${this.HR_API_URL}/employees/offboard/${employeeId}`, {});
  }

  createEmail(employeeId: number, data: Partial<Employee>) {
    return this.http.post(`${this.IT_API_URL}/itTask/createAcc/${employeeId}`, data);
  }

  getGovtDocument(employeeId: number): Observable<DocumentMeta> {
    return this.http.get<DocumentMeta>(`${this.IT_API_URL}/documents/employee/${employeeId}/document-metadata`);
  }

  uploadGovtDocument(employeeId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.IT_API_URL}/documents/upload/${employeeId}`, formData);
  }
  approveDocumment(id: number | undefined) {
    return this.http.post(`${this.IT_API_URL}/itTask/doc/${id}`, {});
  }
}
