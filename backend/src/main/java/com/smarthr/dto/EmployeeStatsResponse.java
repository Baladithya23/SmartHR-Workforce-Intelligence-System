package com.smarthr.dto;

import lombok.*;

import java.math.BigDecimal;

/**
 * Lightweight stats summary used by the legacy /employees/stats endpoint
 * (keeps backward-compatible with the existing frontend Dashboard call).
 */
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class EmployeeStatsResponse {
    private long totalEmployees;
    private BigDecimal totalSalaryBudget;
    private BigDecimal averageSalary;
}
