package com.backend.hr_service.service;

import com.backend.hr_service.model.AuditLog;
import com.backend.hr_service.repository.AuditLogRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository repo;

    public List<AuditLog> getAll() {
        return repo.findAll();
    }

    public AuditLog createLog(AuditLog log) {
        return repo.save(log);
    }

    public void logAction(String entityName, String entityId, String action, String actor, Object payload) {
        AuditLog auditLog = new AuditLog();
        auditLog.setEntityName(entityName);
        auditLog.setEntityId(entityId);
        auditLog.setAction(action);
        auditLog.setActor(actor);
        auditLog.setPayload(convertObjectToMap(payload));
        repo.save(auditLog);
    }

    private Map<String, Object> convertObjectToMap(Object object) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.convertValue(object, new TypeReference<>() {});
        } catch (Exception e) {
            return Map.of("error", "Serialization failed");
        }
    }
}
