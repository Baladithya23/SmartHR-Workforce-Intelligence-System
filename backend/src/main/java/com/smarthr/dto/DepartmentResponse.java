package com.smarthr.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DepartmentResponse {
    private Long departmentId;
    private String departmentName;
    private String description;
    private String location;
    private long employeeCount;
}
