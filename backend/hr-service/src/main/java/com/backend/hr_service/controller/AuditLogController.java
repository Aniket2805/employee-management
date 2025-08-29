package com.backend.hr_service.controller;

import com.backend.hr_service.model.AuditLog;
import com.backend.hr_service.model.Employee;
import com.backend.hr_service.service.AuditLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auditlog")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin
@Tag(name = "Audit Logs", description = "API for Getting Audit Logs")
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    @Operation(summary = "Get all logs")
    @GetMapping
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<List<AuditLog>> getAll() {
        return ResponseEntity.ok(auditLogService.getAll());
    }

    @PostMapping
    public ResponseEntity<AuditLog> createLog(@RequestBody AuditLog log) {
        return ResponseEntity.ok(auditLogService.createLog(log));
    }

}
