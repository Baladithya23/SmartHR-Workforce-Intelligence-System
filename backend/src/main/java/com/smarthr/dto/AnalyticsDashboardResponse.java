package com.smarthr.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AnalyticsDashboardResponse {
    private long totalEmployees;
    private long totalDepartments;
    private BigDecimal totalSalaryBudget;
    private BigDecimal averageSalary;
    private EmployeeResponse highestSalaryEmployee;
    private List<EmployeeResponse> recentlyJoined;
    private Map<String, Long> employeesPerDepartment;
}
