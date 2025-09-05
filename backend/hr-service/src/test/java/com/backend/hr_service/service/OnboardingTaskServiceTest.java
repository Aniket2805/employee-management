package com.backend.hr_service.service;

import static org.junit.jupiter.api.Assertions.*;

import com.backend.hr_service.model.*;
import com.backend.hr_service.repository.EmployeeRepository;
import com.backend.hr_service.repository.OnboardingTaskRepository;
import com.backend.hr_service.repository.OnboardingTaskTemplateRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OnboardingTaskServiceTest {

    @InjectMocks
    private OnboardingTaskService taskService;

    @Mock
    private OnboardingTaskTemplateRepository templateRepo;

    @Mock
    private OnboardingTaskRepository taskRepo;

    @Mock
    private EmployeeRepository employeeRepo;

    @Mock
    private PerformanceReviewService performanceReviewService;

    @Mock
    private AuditLogService logService;

    private Employee employee;
    private OnboardingTaskTemplate template;

    @BeforeEach
    void setUp() {
        employee = Employee.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .onboardingStage("HR")
                .department("HR")
                .isMentor(true)
                .mentor(null)
                .active(true)
                .onboardingStatus(OnboardingStatus.PENDING)
                .build();

        template = OnboardingTaskTemplate.builder()
                .id(1L)
                .title("Submit Documents")
                .description("Submit your ID proofs")
                .department("HR")
                .orderIndex(1)
                .formlyConfigJson(new HashMap<>())
                .build();
    }

    @Test
    void testAssignTasksToEmployee_AssignsTasksSuccessfully() {
        when(employeeRepo.findById(1L)).thenReturn(Optional.of(employee));
        when(taskRepo.existsByEmployeeAndDepartment(any(), any())).thenReturn(false);
        when(templateRepo.findByDepartmentOrderByOrderIndexAsc("HR")).thenReturn(List.of(template));

        taskService.assignTasksToEmployee(1L);

        verify(taskRepo).saveAll(anyList());
        verify(logService).logAction(eq("OnboardingTask"), anyString(), eq("ASSIGN_TASKS"), anyString(), any());
    }

    @Test
    void testAssignTasksToEmployee_AlreadyAssigned_ThrowsException() {
        when(employeeRepo.findById(1L)).thenReturn(Optional.of(employee));
        when(taskRepo.existsByEmployeeAndDepartment(any(), any())).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                taskService.assignTasksToEmployee(1L));
        assertTrue(exception.getMessage().contains("Onboarding is already started"));
    }

    @Test
    void testGetTasksForEmployee_ReturnsTaskList() {
        OnboardingTask task = OnboardingTask.builder()
                .id(100L)
                .title("Submit Docs")
                .description("Upload PDFs")
                .status(TaskStatus.IN_PROGRESS)
                .orderIndex(1)
                .department("HR")
                .formlyConfigJson(new HashMap<>())
                .employee(employee)
                .build();

        when(employeeRepo.findById(1L)).thenReturn(Optional.of(employee));
        when(taskRepo.findByEmployeeOrderByOrderIndex(employee)).thenReturn(List.of(task));

        List<Map<String, Object>> result = taskService.getTasksForEmployee(1L);

        assertEquals(1, result.size());
        assertEquals("Submit Docs", result.getFirst().get("title"));
    }

    @Test
    void testUpdateTaskStatus_SetsCompletedAndStartsNext() {
        // Arrange
        Employee emp = employee;
        emp.setOnboardingStage("HR");

        OnboardingTask task1 = OnboardingTask.builder()
                .id(1L).employee(emp).department("HR").orderIndex(1)
                .formlyConfigJson(new HashMap<>())
                .description("hjj")
                .status(TaskStatus.IN_PROGRESS)
                .title("Submit Docs").build();

        OnboardingTask task2 = OnboardingTask.builder()
                .id(2L).employee(emp).department("HR").orderIndex(2)
                .formlyConfigJson(new HashMap<>())
                .description("hjhj")
                .status(TaskStatus.PENDING)
                .title("Orientation").build();

        // Stubbing
        when(taskRepo.findById(1L)).thenReturn(Optional.of(task1));
        when(taskRepo.findByEmployeeAndDepartmentOrderByOrderIndex(emp, "HR"))
                .thenReturn(List.of(task1, task2));
        when(taskRepo.findByEmployeeAndDepartment(emp, "HR"))
                .thenReturn(List.of(task1, task2));
        when(taskRepo.existsByEmployeeAndDepartment(emp, "HR")).thenReturn(true); // prevents assignTasksToEmployee
        when(employeeRepo.save(emp)).thenReturn(emp);  // employee update
        when(taskRepo.save(task1)).thenReturn(task1);
        when(taskRepo.save(task2)).thenReturn(task2); // task2 will be set to IN_PROGRESS

        // Act
        OnboardingTask updated = taskService.updateTaskStatus(1L, TaskStatus.COMPLETED);

        // Assert
        assertEquals(TaskStatus.COMPLETED, updated.getStatus());
        assertEquals(TaskStatus.IN_PROGRESS, task2.getStatus());

        verify(taskRepo).save(task2); // Verify the second task was updated
        verify(taskRepo).save(task1); // Also confirm task1 was saved as COMPLETED
        verify(employeeRepo).save(emp); // Confirm employee onboardingStage updated
    }


    @Test
    void testUpdateTaskStatus_PreviousNotCompleted_Throws() {
        Employee emp = employee;
        emp.setOnboardingStage("HR");

        OnboardingTask prev = OnboardingTask.builder()
                .orderIndex(1).status(TaskStatus.PENDING).department("HR").employee(emp).build();

        OnboardingTask current = OnboardingTask.builder()
                .id(2L).orderIndex(2).status(TaskStatus.IN_PROGRESS)
                .employee(emp).department("HR").build();

        when(taskRepo.findById(2L)).thenReturn(Optional.of(current));
        when(taskRepo.findByEmployeeAndDepartmentOrderByOrderIndex(emp, "HR"))
                .thenReturn(List.of(prev, current));

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                taskService.updateTaskStatus(2L, TaskStatus.COMPLETED));
        assertTrue(ex.getMessage().contains("Previous task"));
    }

    @Test
    void testDeleteAllTasksByEmpId_DeletesSuccessfully() {
        Map<String, String> result = taskService.deleteAllTasksByEmpId(1L);

        verify(taskRepo).deleteAllByEmployeeId(1L);
        assertEquals("Tasks Deleted Successfully", result.get("msg"));
    }
}