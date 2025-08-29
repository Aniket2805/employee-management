package com.backend.it_service.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AuditLog {

    private String entityName;
    private String entityId;
    private String action;
    private String actor;

    Object payload;
}

