package com.smarthr.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String action;          // EMPLOYEE_CREATED | EMPLOYEE_UPDATED | EMPLOYEE_DELETED

    @Column(nullable = false, length = 100)
    private String performedBy;     // username of who did the action

    @Column(length = 150)
    private String targetEmployee;  // name / email of affected employee

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(length = 500)
    private String details;         // optional extra context
}
