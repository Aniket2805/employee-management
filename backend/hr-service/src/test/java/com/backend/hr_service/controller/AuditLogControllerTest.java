package com.backend.hr_service.controller;

import com.backend.hr_service.feign.AuthClient;
import com.backend.hr_service.model.AuditLog;
import com.backend.hr_service.service.AuditLogService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;

import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuditLogController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuditLogControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuditLogService auditLogService;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthClient authClient;

    @Test
    @WithMockUser(roles = "HR")
    void shouldReturnAllAuditLogs() throws Exception {
        AuditLog log = new AuditLog();
        log.setId(1L);
        log.setEntityName("Employee");
        log.setEntityId("123");
        log.setAction("CREATE");
        log.setActor("john.doe");
        log.setPayload(Map.of("field", "value"));
        log.setTimestamp(LocalDateTime.now());

        when(auditLogService.getAll()).thenReturn(List.of(log));

        mockMvc.perform(get("/api/auditlog"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1))
                .andExpect(jsonPath("$[0].entityName").value("Employee"))
                .andExpect(jsonPath("$[0].action").value("CREATE"));
    }

    @Test
    @WithMockUser
    void shouldCreateAuditLog() throws Exception {
        AuditLog log = new AuditLog();
        log.setId(1L);
        log.setEntityName("Employee");
        log.setEntityId("123");
        log.setAction("CREATE");
        log.setActor("john.doe");
        log.setPayload(Map.of("field", "value"));
        log.setTimestamp(LocalDateTime.now());

        when(auditLogService.createLog(any(AuditLog.class))).thenReturn(log);

        mockMvc.perform(post("/api/auditlog")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(log)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.entityName").value("Employee"))
                .andExpect(jsonPath("$.action").value("CREATE"));
    }

}
