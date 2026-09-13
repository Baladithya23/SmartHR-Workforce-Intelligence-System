package com.smarthr.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class EmployeeRequest {

    @NotBlank(message = "Employee name is required")
    @Size(max = 100)
    private String employeeName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    private String email;

    @Size(max = 20)
    private String phone;

    @NotBlank(message = "Designation is required")
    @Size(max = 100)
    private String designation;

    @NotNull(message = "Salary is required")
    @DecimalMin(value = "1.0", message = "Salary must be greater than 0")
    private BigDecimal salary;

    private LocalDate joiningDate;

    /** ACTIVE | INACTIVE | ON_LEAVE */
    private String status;

    /** Department ID */
    private Long departmentId;

    /** List of skill names e.g. ["Java","Spring Boot","React"] */
    private List<String> skills;
}
