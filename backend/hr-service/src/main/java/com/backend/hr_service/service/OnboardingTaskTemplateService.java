package com.backend.hr_service.service;
import com.backend.hr_service.config.AuthForwardingFilter;
import com.backend.hr_service.model.OnboardingTaskTemplate;
import com.backend.hr_service.dto.OnboardingTaskTemplateDTO;
import com.backend.hr_service.repository.OnboardingTaskTemplateRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@Transactional
public class OnboardingTaskTemplateService {

    @Autowired
    private OnboardingTaskTemplateRepository repo;

    @Autowired
    private AuditLogService logService;  // Inject audit service

    public OnboardingTaskTemplate create(OnboardingTaskTemplateDTO dto) {
        OnboardingTaskTemplate template = OnboardingTaskTemplate.builder()
                .department(dto.getDepartment())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .orderIndex(dto.getOrderIndex())
                .formlyConfigJson(dto.getFormlyConfigJson())
                .build();

        OnboardingTaskTemplate savedTemplate = repo.save(template);

        // Audit log: create template
        logService.logAction(
                "OnboardingTaskTemplate",
                String.valueOf(savedTemplate.getId()),
                "CREATE",
                AuthForwardingFilter.getCurrentUser(),
                savedTemplate
        );

        return savedTemplate;
    }

    public List<OnboardingTaskTemplate> getByDepartment(String department) {
        return repo.findByDepartmentOrderByOrderIndex(department);
    }

    public OnboardingTaskTemplate update(Long id, OnboardingTaskTemplateDTO dto) {
        OnboardingTaskTemplate existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found"));

        existing.setDepartment(dto.getDepartment());
        existing.setTitle(dto.getTitle());
        existing.setDescription(dto.getDescription());
        existing.setOrderIndex(dto.getOrderIndex());
        existing.setFormlyConfigJson(dto.getFormlyConfigJson());

        OnboardingTaskTemplate updatedTemplate = repo.save(existing);

        // Audit log: update template
        logService.logAction(
                "OnboardingTaskTemplate",
                String.valueOf(updatedTemplate.getId()),
                "UPDATE",
                AuthForwardingFilter.getCurrentUser(),
                updatedTemplate
        );

        return updatedTemplate;
    }

    public void delete(Long id) {
        repo.deleteById(id);

        // Audit log: delete template
        logService.logAction(
                "OnboardingTaskTemplate",
                String.valueOf(id),
                "DELETE",
                AuthForwardingFilter.getCurrentUser(),
                Map.of("id", id)
        );
    }
}
