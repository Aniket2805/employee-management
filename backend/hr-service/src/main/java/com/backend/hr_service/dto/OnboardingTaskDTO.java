package com.backend.hr_service.dto;

import lombok.*;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OnboardingTaskDTO {
    private String title;
    private String description;
    private String department;
    private String status;
    private Integer orderIndex;
    private Map<String, Object> formlyConfigJson;
}