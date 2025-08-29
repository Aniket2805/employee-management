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
public class OnboardingTaskTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String department;

    private String title;
    private String description;

    private Integer orderIndex;

    @Type(JsonType.class)
    @Column(columnDefinition = "json")
    private Map<String,Object> formlyConfigJson;
}