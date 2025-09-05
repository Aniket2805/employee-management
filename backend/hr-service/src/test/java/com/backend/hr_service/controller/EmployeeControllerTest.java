package com.backend.hr_service.controller;
import com.backend.hr_service.config.SecurityConfig;
import com.backend.hr_service.feign.AuthClient;
import com.backend.hr_service.model.Employee;
import com.backend.hr_service.dto.EmployeeDTO;
import com.backend.hr_service.service.EmployeeService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(controllers = EmployeeController.class)
@Import(SecurityConfig.class)  // if you have a custom security config
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private EmployeeService employeeService;

    @MockitoBean
    private AuthClient authClient;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(roles = "HR")
    void testGetAllEmployees() throws Exception {
        Employee emp = new Employee();
        emp.setId(1L);
        emp.setFirstName("John");
        emp.setLastName("Doe");

        when(employeeService.getAll()).thenReturn(List.of(emp));

        mockMvc.perform(get("/api/employees"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].firstName").value("John"));
    }

    @Test
    @WithMockUser(roles = "HR")
    void testCreateEmployee() throws Exception {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setFirstName("Alice");

        Employee emp = new Employee();
        emp.setId(1L);
        emp.setFirstName("Alice");

        when(employeeService.create(dto)).thenReturn(emp);

        mockMvc.perform(post("/api/employees")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Alice"));
    }
}
