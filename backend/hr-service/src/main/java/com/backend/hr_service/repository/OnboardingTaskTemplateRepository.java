package com.backend.hr_service.repository;
import com.backend.hr_service.model.Employee;
import com.backend.hr_service.model.OnboardingTaskTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OnboardingTaskTemplateRepository extends JpaRepository<OnboardingTaskTemplate, Long> {
    List<OnboardingTaskTemplate> findByDepartmentOrderByOrderIndex(String department);
    Optional<OnboardingTaskTemplate> findByTitleAndDepartment(String title, String department);
    List<OnboardingTaskTemplate> findByDepartmentOrderByOrderIndexAsc(String department);
}
