package com.backend.hr_service.dto;

import lombok.Data;

import java.util.Map;

@Data
public class OnboardingTaskTemplateDTO {
    private String department;
    private String title;
    private String description;
    private Integer orderIndex;
    private Map<String,Object> formlyConfigJson;
}
