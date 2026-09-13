package com.smarthr.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DepartmentRequest {

    @NotBlank(message = "Department name is required")
    @Size(max = 100)
    private String departmentName;

    @Size(max = 500)
    private String description;

    @Size(max = 100)
    private String location;
}
