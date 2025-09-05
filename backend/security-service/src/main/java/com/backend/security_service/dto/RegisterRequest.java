package com.backend.security_service.dto;

import com.backend.security_service.model.Roles;

public record RegisterRequest(String email, String password, String fullName, Roles role, Long employeeId) {}

