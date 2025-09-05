package com.backend.it_service.controller;
import com.backend.it_service.config.SecurityConfig;
import com.backend.it_service.dto.EmployeeAccDTO;
import com.backend.it_service.dto.ResponseDTO;
import com.backend.it_service.feign.AuthClient;
import com.backend.it_service.feign.HrClient;
import com.backend.it_service.model.DocumentMetadata;
import com.backend.it_service.service.ItService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.mockito.ArgumentMatchers.*;

@WebMvcTest(ItTasksController.class)
@Import(SecurityConfig.class)
class ItTasksControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ItService itService;

    @MockitoBean
    private AuthClient authClient;

    @MockitoBean
    private HrClient hrClient;

    @Autowired
    private ObjectMapper objectMapper;

    private DocumentMetadata documentMetadata;
    private EmployeeAccDTO employeeAccDTO;

    @BeforeEach
    void setUp() {
        documentMetadata = DocumentMetadata.builder()
                .id(1L)
                .employeeId(100L)
                .originalFileName("document.pdf")
                .storedFileName("12345_document.pdf")
                .fileType("application/pdf")
                .fileSize(2048L)
                .uploadedAt(LocalDateTime.now())
                .isApproved(true)
                .build();

        employeeAccDTO = new EmployeeAccDTO();
        employeeAccDTO.setEmail("john.doe@example.com");
        employeeAccDTO.setFullName("John Doe");
        employeeAccDTO.setPassword("securePassword123");
    }

    @Test
    @WithMockUser(roles = "IT")
    void approveDocument_shouldReturnApprovedMetadata() throws Exception {
        Mockito.when(itService.approveDocument(1L)).thenReturn(documentMetadata);

        mockMvc.perform(post("/api/itTask/doc/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.approved").value(true))
                .andExpect(jsonPath("$.originalFileName").value("document.pdf"));
    }

    @Test
    @WithMockUser(roles = "IT")
    void createOfficialAccount_shouldReturnSuccessMessage() throws Exception {
        ResponseDTO<String> response = new ResponseDTO<>(true, "Official Account created Successfully");

        Mockito.when(itService.createOfficialAccount(anyLong(), anyString(), anyString(), anyString()))
                .thenReturn(response);

        mockMvc.perform(post("/api/itTask/createAcc/100")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(employeeAccDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Official Account created Successfully"));
    }
}
