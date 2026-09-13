package com.smarthr.service;

import com.smarthr.dto.AuditLogResponse;
import com.smarthr.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Transactional(readOnly = true)
    public List<AuditLogResponse> getAllLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc().stream()
            .map(log -> AuditLogResponse.builder()
                .id(log.getId())
                .action(log.getAction())
                .performedBy(log.getPerformedBy())
                .targetEmployee(log.getTargetEmployee())
                .timestamp(log.getTimestamp())
                .details(log.getDetails())
                .build())
            .collect(Collectors.toList());
    }
}
