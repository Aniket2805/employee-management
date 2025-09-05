package com.backend.it_service.controller;

import com.backend.it_service.config.SecurityConfig;
import com.backend.it_service.feign.AuthClient;
import com.backend.it_service.feign.HrClient;
import com.backend.it_service.model.DocumentMetadata;
import com.backend.it_service.service.DocumentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.io.File;
import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DocumentController.class)
@Import(SecurityConfig.class)
public class DocumentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthClient authClient;

    @MockitoBean
    private HrClient hrClient;

    @MockitoBean
    private DocumentService documentService;

    private DocumentMetadata sampleMetadata;
    private final String FILE_PATH = "uploads/366a514e-da3e-446c-bfc3-50ee7b781d55_Aniket_Angular_Java_CTUD_POC_Document (1).pdf";

    @BeforeEach
    public void setUp() {
        sampleMetadata = DocumentMetadata.builder()
                .id(1L)
                .employeeId(100L)
                .originalFileName("Aniket_Angular_Java_CTUD_POC_Document (1).pdf")
                .storedFileName("366a514e-da3e-446c-bfc3-50ee7b781d55_Aniket_Angular_Java_CTUD_POC_Document (1).pdf")
                .fileType("application/pdf")
                .fileSize(1024L)
                .uploadedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @WithMockUser(roles = {"EMPLOYEE"})
    public void getDocumentMetadata_success_returnsMetadata() throws Exception {
        Mockito.when(documentService.getDocumentByEmployee(100L)).thenReturn(sampleMetadata);

        mockMvc.perform(get("/api/documents/employee/100/document-metadata"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.employeeId").value(100))
                .andExpect(jsonPath("$.fileType").value("application/pdf"));
    }

    @Test
    @WithMockUser(roles = {"EMPLOYEE"})
    public void getDocumentByEmployee_success_returnsFile() throws Exception {
        File file = new File(FILE_PATH);
        if (!file.exists()) {
            throw new IllegalStateException("❌ Test file not found: " + FILE_PATH);
        }

        Mockito.when(documentService.getDocumentByEmployee(anyLong())).thenReturn(sampleMetadata);

        mockMvc.perform(get("/api/documents/employee/100"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=\"Aniket_Angular_Java_CTUD_POC_Document (1).pdf\""))
                .andExpect(content().contentType("application/pdf"));
    }

    @Test
    @WithMockUser(roles = {"EMPLOYEE"})
    public void uploadDocument_success() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.pdf",
                "application/pdf",
                "Dummy content".getBytes()
        );

        Mockito.when(documentService.storeDocument(anyLong(), any())).thenReturn(sampleMetadata);

        mockMvc.perform(multipart("/api/documents/upload/100").file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Upload successful"))
                .andExpect(jsonPath("$.fileType").value("application/pdf"));
    }

    @Test
    @WithMockUser(roles = {"EMPLOYEE"})
    public void getDocumentByEmployee_fileNotFound_returns404() throws Exception {
        DocumentMetadata notExisting = sampleMetadata.toBuilder()
                .storedFileName("non_existing_file.pdf")
                .build();

        Mockito.when(documentService.getDocumentByEmployee(anyLong())).thenReturn(notExisting);

        mockMvc.perform(get("/api/documents/employee/100"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = {"EMPLOYEE"})
    public void uploadDocument_invalidType_returnsBadRequest() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.exe",
                "application/octet-stream",
                "Invalid content".getBytes()
        );

        Mockito.when(documentService.storeDocument(anyLong(), any()))
                .thenThrow(new IllegalArgumentException("Invalid file type"));

        mockMvc.perform(multipart("/api/documents/upload/100").file(file))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Upload failed: Invalid file type"));
    }
}
