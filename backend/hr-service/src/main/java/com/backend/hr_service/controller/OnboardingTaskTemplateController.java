package com.backend.hr_service.controller;
import com.backend.hr_service.model.OnboardingTaskTemplate;
import com.backend.hr_service.dto.OnboardingTaskTemplateDTO;
import com.backend.hr_service.service.OnboardingTaskTemplateService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/task-templates")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin
@PreAuthorize("hasRole('HR')")
public class OnboardingTaskTemplateController {

    @Autowired
    private OnboardingTaskTemplateService service;

    // Create new template
    @PostMapping
    public ResponseEntity<OnboardingTaskTemplate> create(@RequestBody OnboardingTaskTemplateDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    // View templates by department
    @GetMapping("/{department}")
    public ResponseEntity<List<OnboardingTaskTemplate>> getByDepartment(@PathVariable String department) {
        return ResponseEntity.ok(service.getByDepartment(department));
    }

    // Update template
    @PutMapping("/{id}")
    public ResponseEntity<OnboardingTaskTemplate> update(@PathVariable Long id,
                                                         @RequestBody OnboardingTaskTemplateDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    // Delete template
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok("Template deleted Successfully");
    }
}