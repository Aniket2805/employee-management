package com.backend.it_service.service;
import com.backend.it_service.dto.ResponseDTO;
import com.backend.it_service.feign.AuthClient;
import com.backend.it_service.feign.HrClient;
import com.backend.it_service.model.AuditLog;
import com.backend.it_service.model.DocumentMetadata;
import com.backend.it_service.model.Roles;
import com.backend.it_service.repository.DocumentMetadataRepository;
import com.backend.it_service.config.AuthForwardingFilter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.MockedStatic;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ItServiceTest {

    @Mock
    private DocumentMetadataRepository documentMetadataRepository;

    @Mock
    private AuthClient authClient;

    @Mock
    private HrClient hrClient;

    @InjectMocks
    private ItService itService;

    private static final String CURRENT_USER = "john.doe";

    @BeforeEach
    void setup() {
        // No-op for now, MockitoAnnotations.initMocks done by extension
    }

    @Test
    void approveDocument_success_updatesAndLogs() {
        Long docId = 1L;
        DocumentMetadata doc = new DocumentMetadata();
        doc.setId(docId);
        doc.setApproved(false);

        DocumentMetadata savedDoc = new DocumentMetadata();
        savedDoc.setId(docId);
        savedDoc.setApproved(true);

        when(documentMetadataRepository.findById(docId)).thenReturn(Optional.of(doc));
        when(documentMetadataRepository.save(any())).thenReturn(savedDoc);

        try (MockedStatic<AuthForwardingFilter> mockedStatic = mockStatic(AuthForwardingFilter.class)) {
            mockedStatic.when(AuthForwardingFilter::getCurrentUser).thenReturn(CURRENT_USER);

            DocumentMetadata result = itService.approveDocument(docId);

            assertNotNull(result);
            assertTrue(result.isApproved());

            // Verify repository calls
            verify(documentMetadataRepository).findById(docId);
            verify(documentMetadataRepository).save(any(DocumentMetadata.class));

            // Verify audit log creation
            ArgumentCaptor<AuditLog> logCaptor = ArgumentCaptor.forClass(AuditLog.class);
            verify(hrClient).createLog(logCaptor.capture());

            AuditLog capturedLog = logCaptor.getValue();
            assertEquals("DocumentMetadata", capturedLog.getEntityName());
            assertEquals(String.valueOf(docId), capturedLog.getEntityId());
            assertEquals("UPDATE", capturedLog.getAction());
            assertEquals(CURRENT_USER, capturedLog.getActor());
            assertEquals(savedDoc, capturedLog.getPayload());
        }
    }

    @Test
    void createOfficialAccount_callsServicesAndLogs() {
        Long id = 1L;
        String fullName = "John Doe";
        String email = "john.doe@example.com";
        String password = "securePassword";

        try (MockedStatic<AuthForwardingFilter> mockedStatic = mockStatic(AuthForwardingFilter.class)) {
            mockedStatic.when(AuthForwardingFilter::getCurrentUser).thenReturn(CURRENT_USER);

            ResponseDTO<String> response = itService.createOfficialAccount(id, fullName, email, password);

            assertTrue(response.isSuccess());
            assertEquals("Official Account created Successfully", response.getMessage());

            // Verify hrClient.updateAccDetail and authClient.registerUser called
            verify(hrClient).updateAccDetail(id, email, password);
            verify(authClient).registerUser(any());

            // Verify audit log creation
            ArgumentCaptor<AuditLog> logCaptor = ArgumentCaptor.forClass(AuditLog.class);
            verify(hrClient).createLog(logCaptor.capture());

            AuditLog capturedLog = logCaptor.getValue();
            assertEquals("OfficialAccount", capturedLog.getEntityName());
            assertEquals(String.valueOf(id), capturedLog.getEntityId());
            assertEquals("CREATE", capturedLog.getAction());
            assertEquals(CURRENT_USER, capturedLog.getActor());

            // Check payload contains expected data
            Map<String, Object> payload = (Map<String, Object>) capturedLog.getPayload();
            assertEquals(id, payload.get("id"));
            assertEquals(fullName, payload.get("fullName"));
            assertEquals(email, payload.get("email"));
            assertEquals(Roles.EMPLOYEE, payload.get("role"));
        }
    }

    @Test
    void approveDocument_notFound_throwsException() {
        Long docId = 42L;

        when(documentMetadataRepository.findById(docId)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> itService.approveDocument(docId));
        assertEquals("Document not found with id: " + docId, ex.getMessage());

        verify(documentMetadataRepository, times(1)).findById(docId);
        verify(documentMetadataRepository, never()).save(any());
        verifyNoInteractions(hrClient);
    }
}
