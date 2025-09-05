package com.backend.security_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "users")
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    String fullName;
    Roles role;
    String email;
    Long employeeId;
    String password;
    Boolean isActive;

    public Users(String fullName, String email, String password, Roles role) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role=role;
        this.isActive=true;
    }
    public Users(String fullName, String email, String password,Roles role, Long employeeId) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role=role;
        this.employeeId=employeeId;
        this.isActive=true;
    }
}
