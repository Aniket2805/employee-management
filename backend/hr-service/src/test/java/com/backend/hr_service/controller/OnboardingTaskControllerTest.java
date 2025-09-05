package com.backend.hr_service.controller;

import com.backend.hr_service.config.SecurityConfig;
import com.backend.hr_service.feign.AuthClient;
import com.backend.hr_service.model.OnboardingTask;
import com.backend.hr_service.model.TaskStatus;
import com.backend.hr_service.service.OnboardingTaskService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(OnboardingTaskController.class)
@Import(SecurityConfig.class)
class OnboardingTaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private OnboardingTaskService taskService;

    @MockitoBean
    private AuthClient authClient;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(roles = "HR")
    void testAssignTasksToEmployee() throws Exception {
        Long employeeId = 1L;

        doNothing().when(taskService).assignTasksToEmployee(employeeId);

        mockMvc.perform(post("/api/onboarding/assign/{employeeId}", employeeId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.MSG").value("Tasks assigned."));
    }

    @Test
    @WithMockUser(roles = "HR")
    void testGetEmployeeTasks() throws Exception {
        Long employeeId = 1L;

        List<Map<String, Object>> mockTasks = List.of(
                Map.of("title", "Submit Docs", "status", "IN_PROGRESS"),
                Map.of("title", "Orientation", "status", "PENDING")
        );

        when(taskService.getTasksForEmployee(employeeId)).thenReturn(mockTasks);

        mockMvc.perform(get("/api/onboarding/employee/{employeeId}", employeeId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Submit Docs"))
                .andExpect(jsonPath("$[1].status").value("PENDING"));
    }

    @Test
    @WithMockUser(roles = "HR")
    void testUpdateTaskStatus() throws Exception {
        Long taskId = 1L;
        TaskStatus newStatus = TaskStatus.COMPLETED;

        OnboardingTask updatedTask = new OnboardingTask();
        updatedTask.setId(taskId);
        updatedTask.setStatus(newStatus);

        when(taskService.updateTaskStatus(taskId, newStatus)).thenReturn(updatedTask);

        mockMvc.perform(put("/api/onboarding/status/{taskId}", taskId)
                        .param("status", newStatus.name()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }

    @Test
    @WithMockUser(roles = "HR")
    void testDeleteAllTasksByEmpId() throws Exception {
        Long empId = 1L;
        Map<String, String> response = Map.of("message", "Deleted all tasks");

        when(taskService.deleteAllTasksByEmpId(empId)).thenReturn(response);

        mockMvc.perform(put("/api/onboarding/employee/{employeeId}", empId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Deleted all tasks"));
    }
}