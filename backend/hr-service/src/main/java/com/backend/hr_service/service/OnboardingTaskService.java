package com.backend.hr_service.service;
import com.backend.hr_service.config.AuthForwardingFilter;
import com.backend.hr_service.dto.OnboardingTaskDTO;
import com.backend.hr_service.model.*;
import com.backend.hr_service.repository.EmployeeRepository;
import com.backend.hr_service.repository.OnboardingTaskRepository;
import com.backend.hr_service.repository.OnboardingTaskTemplateRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class OnboardingTaskService {

    @Autowired
    private OnboardingTaskTemplateRepository templateRepo;

    @Autowired
    private OnboardingTaskRepository taskRepo;

    @Autowired
    private EmployeeRepository employeeRepo;

    @Autowired
    private PerformanceReviewService performanceReviewService;

    @Autowired
    private AuditLogService logService;  // Inject audit service

    public void assignTasksToEmployee(Long employeeId) {
        Employee employee = employeeRepo.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        employee.setOnboardingStatus(OnboardingStatus.IN_PROGRESS);
        employeeRepo.save(employee);

        boolean alreadyAssigned = taskRepo.existsByEmployeeAndDepartment(employee, employee.getOnboardingStage());
        if (alreadyAssigned)
            throw new RuntimeException("Onboarding is already started for the employee ID: " + employee.getId());

        // Fetch all relevant task templates
        List<OnboardingTaskTemplate> templates = templateRepo
                .findByDepartmentOrderByOrderIndexAsc(employee.getOnboardingStage());

        // Map templates to tasks
        List<OnboardingTask> tasks = templates.stream().map(template -> OnboardingTask.builder()
                .title(template.getTitle())
                .description(template.getDescription())
                .orderIndex(template.getOrderIndex())
                .department(template.getDepartment())
                .formlyConfigJson(template.getFormlyConfigJson())
                .status(TaskStatus.PENDING)
                .employee(employee)
                .build()
        ).collect(Collectors.toList());

        // Set first task to IN_PROGRESS
        if (!tasks.isEmpty()) {
            tasks.getFirst().setStatus(TaskStatus.IN_PROGRESS);
        }
        taskRepo.saveAll(tasks);

        Map<String, Object> payloadMap = new HashMap<>();
        payloadMap.put("tasks", tasks);
        // Audit log: assigned tasks to employee
        logService.logAction(
                "OnboardingTask",
                "EMPLOYEE_" + employeeId,  // Using employeeId as reference for bulk task assignment
                "ASSIGN_TASKS",
                AuthForwardingFilter.getCurrentUser(),
                payloadMap
        );
    }

    public List<Map<String, Object>> getTasksForEmployee(Long employeeId) {
        Employee employee = employeeRepo.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        List<OnboardingTask> tasks = taskRepo.findByEmployeeOrderByOrderIndex(employee);
        List<Map<String, Object>> assignedTasks = new ArrayList<>();

        for (OnboardingTask task : tasks) {
            Map<String, Object> taskMap = new HashMap<>();
            taskMap.put("taskId", task.getId());
            taskMap.put("title", task.getTitle());
            taskMap.put("status", task.getStatus());
            taskMap.put("orderIndex", task.getOrderIndex());
            taskMap.put("description", task.getDescription());
            taskMap.put("department", task.getDepartment());
            taskMap.put("formlyConfigJson", task.getFormlyConfigJson());

            assignedTasks.add(taskMap);
        }
        return assignedTasks;
    }

    public OnboardingTask updateTaskStatus(Long taskId, TaskStatus newStatus) {
        OnboardingTask currentTask = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (currentTask.getStatus() == TaskStatus.COMPLETED) {
            throw new RuntimeException("Task already completed.");
        }

        if (!Objects.equals(currentTask.getDepartment(), currentTask.getEmployee().getOnboardingStage())) {
            throw new IllegalStateException("The task's department does not match the employee's current onboarding stage.");
        }

        if (currentTask.getStatus() == TaskStatus.IN_PROGRESS && newStatus != TaskStatus.COMPLETED) {
            throw new RuntimeException("The task status cannot be changed to lower value.");
        }

        // Enforce sequential task order
        List<OnboardingTask> allTasks = taskRepo
                .findByEmployeeAndDepartmentOrderByOrderIndex(currentTask.getEmployee(), currentTask.getDepartment());

        for (OnboardingTask task : allTasks) {
            if (task.getOrderIndex() < currentTask.getOrderIndex() &&
                    task.getStatus() != TaskStatus.COMPLETED) {
                throw new RuntimeException("Previous task \"" + task.getTitle() + "\" is not completed yet.");
            }
        }

        currentTask.setStatus(newStatus);

        if (newStatus == TaskStatus.COMPLETED) {
            allTasks.stream()
                    .filter(task -> task.getOrderIndex() > currentTask.getOrderIndex()) // find next task
                    .filter(task -> task.getStatus() == TaskStatus.PENDING)
                    .findFirst()
                    .ifPresent(nextTask -> {
                        nextTask.setStatus(TaskStatus.IN_PROGRESS);
                        taskRepo.save(nextTask);
                    });
        }

        setOnboardingStage(currentTask.getEmployee());

        OnboardingTask savedTask = taskRepo.save(currentTask);

        // Audit log: task status update
        logService.logAction(
                "OnboardingTask",
                String.valueOf(savedTask.getId()),
                "UPDATE_STATUS",
                AuthForwardingFilter.getCurrentUser(),
                savedTask
        );

        return savedTask;
    }

    public void setOnboardingStage(Employee employee) {
        List<String> departmentSequence = List.of("HR", "IT");

        for (String department : departmentSequence) {
            List<OnboardingTask> tasks = taskRepo.findByEmployeeAndDepartment(employee, department);

            boolean allCompleted = tasks.stream()
                    .allMatch(task -> task.getStatus() == TaskStatus.COMPLETED);

            if (tasks.isEmpty() || !allCompleted) {
                employee.setOnboardingStage(department);
                employeeRepo.save(employee);
                if (!taskRepo.existsByEmployeeAndDepartment(employee, department)) {
                    assignTasksToEmployee(employee.getId());
                }
                return;
            }
        }

        employee.setOnboardingStage("DONE");
        employee.setOnboardingStatus(OnboardingStatus.COMPLETED);
        employeeRepo.save(employee);

        if (employee.getOnboardingStage().equals("DONE") &&
                employee.getOnboardingStatus() == OnboardingStatus.COMPLETED) {
            performanceReviewService.scheduleReviewAfterOnboarding(employee);
        }
    }

    public Map<String, String> deleteAllTasksByEmpId(Long employeeId) {
        taskRepo.deleteAllByEmployeeId(employeeId);

        // Audit log: deleted all tasks for employee
//        logService.logAction(
//                "OnboardingTask",
//                "EMPLOYEE_" + employeeId,
//                "DELETE_ALL",
//                AuthForwardingFilter.getCurrentUser(),
//                Map.of("employeeId", employeeId)
//        );

        Map<String, String> res = new HashMap<>();
        res.put("msg", "Tasks Deleted Successfully");
        return res;
    }
}
