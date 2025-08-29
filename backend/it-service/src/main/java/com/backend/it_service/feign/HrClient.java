package com.backend.it_service.feign;

import com.backend.it_service.model.AuditLog;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "hr-service")
public interface HrClient {

    @PostMapping("/api/employees/account/{id}")
    public ResponseEntity<String> updateAccDetail(@PathVariable Long id, @RequestParam String email, @RequestParam String password);

    @PostMapping("/api/auditlog")
    public ResponseEntity<AuditLog> createLog(@RequestBody AuditLog log);
}
