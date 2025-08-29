package com.backend.hr_service.model;
import com.vladmihalcea.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;

import java.util.Map;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OnboardingTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private String department;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    private Integer orderIndex;

    @Type(JsonType.class)
    @Column(columnDefinition = "json")
    private Map<String,Object> formlyConfigJson;

    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "employee_id")
    private Employee employee;
}