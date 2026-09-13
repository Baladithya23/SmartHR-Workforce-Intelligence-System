package com.smarthr.dto;

import lombok.*;

import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SkillGapResponse {
    private Long employeeId;
    private String employeeName;
    private String designation;
    private List<String> employeeSkills;
    private List<String> requiredSkills;
    private List<String> matchingSkills;
    private List<String> missingSkills;
    private int matchPercentage;
}
