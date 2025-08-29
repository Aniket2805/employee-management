package com.backend.it_service.dto;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeAccDTO {
    private String fullName;
    private String email;
    private String password;
}
