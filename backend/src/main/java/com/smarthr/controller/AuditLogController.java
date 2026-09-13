package com.smarthr.controller;

import com.smarthr.dto.AuditLogResponse;
import com.smarthr.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    /**
     * GET /api/audit-logs
     * Returns all audit log entries (ADMIN only – enforced in SecurityConfig).
     */
    @GetMapping
    public ResponseEntity<List<AuditLogResponse>> getAll() {
        return ResponseEntity.ok(auditLogService.getAllLogs());
    }
}
