package com.smarthr.util;

import com.smarthr.entity.AuditLog;
import com.smarthr.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class AuditLogger {

    private final AuditLogRepository auditLogRepository;

    public void log(String action, String performedBy, String targetEmployee, String details) {
        AuditLog log = AuditLog.builder()
            .action(action)
            .performedBy(performedBy)
            .targetEmployee(targetEmployee)
            .details(details)
            .timestamp(LocalDateTime.now())
            .build();
        auditLogRepository.save(log);
    }
}
