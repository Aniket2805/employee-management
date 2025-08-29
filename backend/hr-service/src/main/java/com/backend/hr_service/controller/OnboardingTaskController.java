package com.backend.hr_service.controller;
import com.backend.hr_service.model.OnboardingTask;
import com.backend.hr_service.service.OnboardingTaskService;
import com.backend.hr_service.model.TaskStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/onboarding")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin
@Tag(name = "Onboarding Tasks", description = "API for managing onboarding tasks")
public class OnboardingTaskController {

    @Autowired
    private OnboardingTaskService taskService;

    @Operation(summary = "Assign onboarding tasks to an employee")
    @PostMapping("/assign/{employeeId}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<Map<String,String>> assignTasks(@PathVariable Long employeeId) {
        taskService.assignTasksToEmployee(employeeId);
        Map<String,String>res=new HashMap<>();
        res.put("MSG","Tasks assigned.");
        return ResponseEntity.ok(res);
    }

    @PreAuthorize("hasRole('HR') or hasRole('IT') or hasRole('EMPLOYEE')")
    @Operation(summary = "Get all onboarding tasks assigned to an employee")
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Map<String, Object>>> getEmployeeTasks(@PathVariable Long employeeId) {
        return ResponseEntity.ok(taskService.getTasksForEmployee(employeeId));
    }

    @PreAuthorize("hasRole('HR') or hasRole('IT') or hasRole('EMPLOYEE')")
    @Operation(summary = "Update status of an onboarding task")
    @PutMapping("/status/{taskId}")
    public ResponseEntity<OnboardingTask> updateTaskStatus(@PathVariable Long taskId,
                                                           @RequestParam TaskStatus status) {
        return ResponseEntity.ok(taskService.updateTaskStatus(taskId, status));
    }

    @PreAuthorize("hasRole('HR') or hasRole('IT') or hasRole('EMPLOYEE')")
    @Operation(summary = "Update status of an onboarding task")
    @PutMapping("/employee/{employeeId}")
    public ResponseEntity<Map<String,String>> deleteAllTasksByEmpId(@PathVariable Long employeeId) {
        return ResponseEntity.ok(taskService.deleteAllTasksByEmpId(employeeId));
    }

}