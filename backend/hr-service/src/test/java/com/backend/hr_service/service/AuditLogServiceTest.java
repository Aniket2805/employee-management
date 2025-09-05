package com.backend.hr_service.service;

import static org.junit.jupiter.api.Assertions.*;
import com.backend.hr_service.model.AuditLog;
import com.backend.hr_service.repository.AuditLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import java.util.*;
import static org.mockito.Mockito.*;

import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AuditLogServiceTest {

    @InjectMocks
    private AuditLogService auditLogService;

    @Mock
    private AuditLogRepository auditLogRepository;

    private AuditLog sampleLog;

    @BeforeEach
    void setUp() {
        sampleLog = new AuditLog();
        sampleLog.setId(1L);
        sampleLog.setEntityName("Employee");
        sampleLog.setEntityId("101");
        sampleLog.setAction("CREATE");
        sampleLog.setActor("admin");
        sampleLog.setPayload(Map.of("key", "value"));
    }

    @Test
    void testGetAll_ReturnsListOfLogs() {
        when(auditLogRepository.findAll()).thenReturn(List.of(sampleLog));

        List<AuditLog> result = auditLogService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Employee", result.getFirst().getEntityName());
        verify(auditLogRepository).findAll();
    }

    @Test
    void testCreateLog_SavesAndReturnsAuditLog() {
        when(auditLogRepository.save(sampleLog)).thenReturn(sampleLog);

        AuditLog result = auditLogService.createLog(sampleLog);

        assertNotNull(result);
        assertEquals("Employee", result.getEntityName());
        verify(auditLogRepository).save(sampleLog);
    }

    @Test
    void testLogAction_SerializesPayloadAndSavesAuditLog() {
        // Given a sample payload object
        Object payload = Map.of("firstName", "John", "lastName", "Doe");

        // No need to stub save — just verify it’s called
        auditLogService.logAction("Employee", "123", "CREATE", "admin", payload);

        // Capture what was saved
        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);
        verify(auditLogRepository).save(captor.capture());

        AuditLog savedLog = captor.getValue();

        assertEquals("Employee", savedLog.getEntityName());
        assertEquals("123", savedLog.getEntityId());
        assertEquals("CREATE", savedLog.getAction());
        assertEquals("admin", savedLog.getActor());
        assertNotNull(savedLog.getPayload());
        assertEquals("John", savedLog.getPayload().get("firstName"));
    }

    @Test
    void testLogAction_WithInvalidPayload_DoesNotCrash() {
        Object unserializable = new Object() {
            private final Object self = this;
        };

        auditLogService.logAction("Employee", "123", "CREATE", "admin", unserializable);

        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);
        verify(auditLogRepository).save(captor.capture());

        AuditLog log = captor.getValue();
        assertTrue(log.getPayload().containsKey("error"));
        assertEquals("Serialization failed", log.getPayload().get("error"));
    }
}