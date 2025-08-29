package com.backend.hr_service.model;

import com.vladmihalcea.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "audit_logs")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String entityName;
    private String entityId;
    private String action; // e.g., CREATE, UPDATE, DELETE

    private String actor; // extracted from JWT

    @Type(JsonType.class)
    @Column(columnDefinition = "json")
    private Map<String,Object> payload; // optional: serialized JSON of the entity or changes

    private LocalDateTime timestamp = LocalDateTime.now();

}

