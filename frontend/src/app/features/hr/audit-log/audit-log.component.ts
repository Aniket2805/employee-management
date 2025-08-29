import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrettyJsonPipe } from './pretty-json.pipe';
import { Store } from '@ngrx/store';
import { selectAuditLogsData, selectAuditLogsLoading, selectAuditLogsError } from '../../../store/employee/employee.selectors';
import { loadAuditLogs } from '../../../store/employee/employee.actions';
import { AuditLog } from '../../../models/auditlog.model';

@Component({
    selector: 'app-audit-log',
    standalone: true,
    imports: [CommonModule, PrettyJsonPipe],
    templateUrl: './audit-log.component.html',
    styleUrls: ['./audit-log.component.scss']
})
export class AuditLogComponent implements OnInit {
    private store = inject(Store);
    auditLogs: AuditLog[] = [];
    loading = false;
    error: string | null = null;

    ngOnInit(): void {
        this.store.dispatch(loadAuditLogs());
        this.store.select(selectAuditLogsData).subscribe(logs => this.auditLogs = logs);
        this.store.select(selectAuditLogsLoading).subscribe(l => this.loading = l);
        this.store.select(selectAuditLogsError).subscribe(e => this.error = e);
    }
}
