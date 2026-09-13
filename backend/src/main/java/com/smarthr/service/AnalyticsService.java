package com.smarthr.service;

import com.smarthr.dto.AnalyticsDashboardResponse;
import com.smarthr.dto.EmployeeResponse;
import com.smarthr.entity.Employee;
import com.smarthr.repository.DepartmentRepository;
import com.smarthr.repository.EmployeeRepository;
import com.smarthr.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final EmployeeRepository   employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeService      employeeService;

    @Transactional(readOnly = true)
    public AnalyticsDashboardResponse getDashboard() {

        long totalEmployees   = employeeRepository.count();
        long totalDepartments = departmentRepository.count();

        BigDecimal totalSalary = employeeRepository.sumSalaries();
        if (totalSalary == null) totalSalary = BigDecimal.ZERO;

        BigDecimal avgSalary = employeeRepository.avgSalary();
        if (avgSalary == null) avgSalary = BigDecimal.ZERO;

        // Highest salary employee
        List<Employee> topSalaryList = employeeRepository.findTopBySalaryDesc(PageRequest.of(0, 1));
        EmployeeResponse highestSalaryEmployee = topSalaryList.isEmpty()
            ? null : employeeService.toResponse(topSalaryList.get(0));

        // Recently joined (last 5)
        List<EmployeeResponse> recentlyJoined = employeeRepository
            .findRecentlyJoined(PageRequest.of(0, 5)).stream()
            .map(employeeService::toResponse)
            .collect(Collectors.toList());

        // Employees per department
        Map<String, Long> empPerDept = new LinkedHashMap<>();
        for (Object[] row : employeeRepository.countByDepartmentName()) {
            empPerDept.put((String) row[0], (Long) row[1]);
        }

        return AnalyticsDashboardResponse.builder()
            .totalEmployees(totalEmployees)
            .totalDepartments(totalDepartments)
            .totalSalaryBudget(totalSalary)
            .averageSalary(avgSalary)
            .highestSalaryEmployee(highestSalaryEmployee)
            .recentlyJoined(recentlyJoined)
            .employeesPerDepartment(empPerDept)
            .build();
    }
}
