package com.backend.securityService.dto;

import com.backend.securityService.model.Roles;

public record RegisterRequest(String email, String password, String fullName, Roles role, Long employeeId) {}

