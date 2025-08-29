package com.backend.hr_service.repository;
import com.backend.hr_service.model.Employee;
import com.backend.hr_service.model.OnboardingTask;
import com.backend.hr_service.model.TaskStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OnboardingTaskRepository extends JpaRepository<OnboardingTask, Long> {
    List<OnboardingTask> findByEmployeeOrderByOrderIndex(Employee employee);

    List<OnboardingTask> findByEmployeeAndDepartmentOrderByOrderIndex(Employee employee, String department);

    List<OnboardingTask> findByEmployeeAndDepartment(Employee employee, String department);

    boolean existsByEmployeeAndDepartment(Employee employee, String onboardingStage);

    @Modifying
    @Transactional
    @Query("DELETE FROM OnboardingTask ot WHERE ot.employee.id = :employeeId")
    void deleteAllByEmployeeId(@Param("employeeId") Long employeeId);
}
