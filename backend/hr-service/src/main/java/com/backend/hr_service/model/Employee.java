package com.backend.hr_service.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;

    private String lastName;

    @Column(unique = true)
    private String email;

    private  String password;

    private String department;

    private String onboardingStage;

    @Enumerated(EnumType.STRING)
    private OnboardingStatus onboardingStatus;

    private Boolean active;

    private Boolean isMentor;

    // Self-referencing mentor field
    @ManyToOne
    @JoinColumn(name = "mentor_id")
    private Employee mentor;
}
