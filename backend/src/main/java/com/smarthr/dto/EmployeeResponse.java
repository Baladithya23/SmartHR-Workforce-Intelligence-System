package com.smarthr.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class EmployeeResponse {
    private Long employeeId;
    private String employeeName;
    private String email;
    private String phone;
    private String designation;
    private BigDecimal salary;
    private LocalDate joiningDate;
    private String status;
    private Long departmentId;
    private String departmentName;
    private List<String> skills;
}
