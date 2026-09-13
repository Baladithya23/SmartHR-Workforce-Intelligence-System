package com.smarthr.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AuditLogResponse {
    private Long id;
    private String action;
    private String performedBy;
    private String targetEmployee;
    private LocalDateTime timestamp;
    private String details;
}
