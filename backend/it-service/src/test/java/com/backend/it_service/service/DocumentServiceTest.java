package com.backend.it_service.service;

import com.backend.it_service.config.AuthForwardingFilter;
import com.backend.it_service.feign.HrClient;
import com.backend.it_service.model.AuditLog;
import com.backend.it_service.model.DocumentMetadata;
import com.backend.it_service.repository.DocumentMetadataRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.MockedStatic;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DocumentServiceTest {

    @Mock
    private DocumentMetadataRepository repository;

    @Mock
    private HrClient hrClient;

    @InjectMocks
    private DocumentService documentService;

    private static final String CURRENT_USER = "john.doe";

    @BeforeEach
    void setUp() {
        // No special setup needed here due to MockitoExtension
    }

    @Test
    void getDocumentByEmployee_returnsDocument() {
        Long employeeId = 123L;
        DocumentMetadata doc = new DocumentMetadata();
        doc.setEmployeeId(employeeId);

        when(repository.findByEmployeeId(employeeId)).thenReturn(doc);

        DocumentMetadata result = documentService.getDocumentByEmployee(employeeId);

        assertNotNull(result);
        assertEquals(employeeId, result.getEmployeeId());
        verify(repository).findByEmployeeId(employeeId);
    }

    @Test
    void storeDocument_success_savesFileAndLogs() throws IOException {
        Long employeeId = 123L;
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.pdf",
                "application/pdf",
                "dummy content".getBytes()
        );

        when(repository.findByEmployeeId(employeeId)).thenReturn(null);

        // Mock saving metadata
        ArgumentCaptor<DocumentMetadata> metadataCaptor = ArgumentCaptor.forClass(DocumentMetadata.class);
        when(repository.save(metadataCaptor.capture())).thenAnswer(invocation -> {
            DocumentMetadata md = invocation.getArgument(0);
            md.setId(1L);
            return md;
        });

        try (MockedStatic<AuthForwardingFilter> mockedStatic = mockStatic(AuthForwardingFilter.class)) {
            mockedStatic.when(AuthForwardingFilter::getCurrentUser).thenReturn(CURRENT_USER);

            DocumentMetadata saved = documentService.storeDocument(employeeId, file);

            assertNotNull(saved);
            assertEquals(employeeId, saved.getEmployeeId());
            assertEquals("test.pdf", saved.getOriginalFileName());
            assertEquals("application/pdf", saved.getFileType());
            assertTrue(saved.getFileSize() > 0);
            assertNotNull(saved.getStoredFileName());
            assertNotNull(saved.getUploadedAt());

            // Verify repo interactions
            verify(repository).findByEmployeeId(employeeId);
            verify(repository).save(any());

            // Verify audit log call
            ArgumentCaptor<AuditLog> logCaptor = ArgumentCaptor.forClass(AuditLog.class);
            verify(hrClient).createLog(logCaptor.capture());

            AuditLog log = logCaptor.getValue();
            assertEquals("DocumentMetadata", log.getEntityName());
            assertEquals(String.valueOf(saved.getId()), log.getEntityId());
            assertEquals("CREATE", log.getAction());
            assertEquals(CURRENT_USER, log.getActor());
            assertEquals(saved, log.getPayload());
        }
    }

    @Test
    void storeDocument_duplicateDocument_throwsException() {
        Long employeeId = 123L;
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.pdf",
                "application/pdf",
                "dummy".getBytes()
        );

        DocumentMetadata existing = new DocumentMetadata();
        when(repository.findByEmployeeId(employeeId)).thenReturn(existing);

        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> documentService.storeDocument(employeeId, file));

        assertEquals("A document for this employee already exists.", ex.getMessage());
        verify(repository).findByEmployeeId(employeeId);
        verify(repository, never()).save(any());
        verifyNoInteractions(hrClient);
    }

    @Test
    void storeDocument_emptyFile_throwsException() {
        Long employeeId = 123L;
        MockMultipartFile emptyFile = new MockMultipartFile(
                "file",
                "empty.pdf",
                "application/pdf",
                new byte[0]
        );

        when(repository.findByEmployeeId(employeeId)).thenReturn(null);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> documentService.storeDocument(employeeId, emptyFile));

        assertEquals("File is empty", ex.getMessage());
        verify(repository).findByEmployeeId(employeeId);
        verify(repository, never()).save(any());
        verifyNoInteractions(hrClient);
    }

    @Test
    void storeDocument_invalidFileType_throwsException() {
        Long employeeId = 123L;
        MockMultipartFile invalidFile = new MockMultipartFile(
                "file",
                "test.exe",
                "application/octet-stream",
                "data".getBytes()
        );

        when(repository.findByEmployeeId(employeeId)).thenReturn(null);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> documentService.storeDocument(employeeId, invalidFile));

        assertEquals("Invalid file type", ex.getMessage());
        verify(repository).findByEmployeeId(employeeId);
        verify(repository, never()).save(any());
        verifyNoInteractions(hrClient);
    }

    @Test
    void storeDocument_fileSizeTooLarge_throwsException() {
        Long employeeId = 123L;
        byte[] largeData = new byte[6 * 1024 * 1024]; // 6 MB > 5 MB limit
        MockMultipartFile largeFile = new MockMultipartFile(
                "file",
                "large.pdf",
                "application/pdf",
                largeData
        );

        when(repository.findByEmployeeId(employeeId)).thenReturn(null);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> documentService.storeDocument(employeeId, largeFile));

        assertEquals("File exceeds size limit", ex.getMessage());
        verify(repository).findByEmployeeId(employeeId);
        verify(repository, never()).save(any());
        verifyNoInteractions(hrClient);
    }
}
