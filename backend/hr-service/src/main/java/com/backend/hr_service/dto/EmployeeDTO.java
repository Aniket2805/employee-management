package com.backend.hr_service.dto;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeDTO {
    private String firstName;
    private String lastName;
    private String department;
    private Boolean isMentor;
}