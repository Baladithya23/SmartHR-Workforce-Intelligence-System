package com.smarthr.service;

import com.smarthr.dto.SkillGapResponse;
import com.smarthr.entity.Employee;
import com.smarthr.entity.Skill;
import com.smarthr.exception.ResourceNotFoundException;
import com.smarthr.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillGapService {

    private final EmployeeRepository employeeRepository;

    /**
     * Maps each designation to a list of required skill names.
     * This is maintained as business logic – no AI/ML required.
     */
    private static final Map<String, List<String>> DESIGNATION_SKILLS = new LinkedHashMap<>();

    static {
        DESIGNATION_SKILLS.put("backend developer",    List.of("Java", "Spring Boot", "SQL", "REST APIs", "Maven"));
        DESIGNATION_SKILLS.put("frontend developer",   List.of("React", "JavaScript", "HTML", "CSS", "REST APIs"));
        DESIGNATION_SKILLS.put("full stack developer", List.of("Java", "Spring Boot", "React", "SQL", "REST APIs", "Git"));
        DESIGNATION_SKILLS.put("software engineer",    List.of("Java", "SQL", "Git", "REST APIs", "Design Patterns"));
        DESIGNATION_SKILLS.put("devops engineer",      List.of("Docker", "Kubernetes", "CI/CD", "Linux", "Git"));
        DESIGNATION_SKILLS.put("data analyst",         List.of("SQL", "Python", "Excel", "Power BI", "Statistics"));
        DESIGNATION_SKILLS.put("data scientist",       List.of("Python", "SQL", "Machine Learning", "Statistics", "TensorFlow"));
        DESIGNATION_SKILLS.put("hr manager",           List.of("Recruitment", "HR Policies", "Communication", "MS Office", "Payroll"));
        DESIGNATION_SKILLS.put("hr executive",         List.of("Recruitment", "HR Policies", "Communication", "MS Office"));
        DESIGNATION_SKILLS.put("finance manager",      List.of("Accounting", "Tally", "MS Excel", "Financial Analysis", "GST"));
        DESIGNATION_SKILLS.put("accountant",           List.of("Accounting", "Tally", "MS Excel", "GST"));
        DESIGNATION_SKILLS.put("sales manager",        List.of("CRM", "Negotiation", "Communication", "Market Research", "MS Excel"));
        DESIGNATION_SKILLS.put("sales executive",      List.of("CRM", "Negotiation", "Communication", "MS Excel"));
        DESIGNATION_SKILLS.put("project manager",      List.of("Project Planning", "Communication", "Risk Management", "Git", "Agile"));
        DESIGNATION_SKILLS.put("qa engineer",          List.of("Manual Testing", "Selenium", "SQL", "JIRA", "Test Planning"));
        DESIGNATION_SKILLS.put("ui/ux designer",       List.of("Figma", "Adobe XD", "Prototyping", "CSS", "User Research"));
    }

    @Transactional(readOnly = true)
    public SkillGapResponse analyzeSkillGap(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        List<String> employeeSkills = employee.getSkills().stream()
            .map(Skill::getSkillName)
            .collect(Collectors.toList());

        // Find required skills for this designation (case-insensitive match)
        List<String> requiredSkills = findRequiredSkills(employee.getDesignation());

        // Calculate matching and missing
        Set<String> empSkillsLower = employeeSkills.stream()
            .map(String::toLowerCase)
            .collect(Collectors.toSet());

        List<String> matching = requiredSkills.stream()
            .filter(s -> empSkillsLower.contains(s.toLowerCase()))
            .collect(Collectors.toList());

        List<String> missing = requiredSkills.stream()
            .filter(s -> !empSkillsLower.contains(s.toLowerCase()))
            .collect(Collectors.toList());

        int percentage = requiredSkills.isEmpty() ? 100
            : (int) Math.round((matching.size() * 100.0) / requiredSkills.size());

        return SkillGapResponse.builder()
            .employeeId(employee.getEmployeeId())
            .employeeName(employee.getEmployeeName())
            .designation(employee.getDesignation())
            .employeeSkills(employeeSkills)
            .requiredSkills(requiredSkills)
            .matchingSkills(matching)
            .missingSkills(missing)
            .matchPercentage(percentage)
            .build();
    }

    private List<String> findRequiredSkills(String designation) {
        if (designation == null) return List.of();
        String key = designation.toLowerCase().trim();
        // Try exact match first
        if (DESIGNATION_SKILLS.containsKey(key)) {
            return DESIGNATION_SKILLS.get(key);
        }
        // Partial match (e.g. "Senior Backend Developer" → "backend developer")
        for (Map.Entry<String, List<String>> entry : DESIGNATION_SKILLS.entrySet()) {
            if (key.contains(entry.getKey()) || entry.getKey().contains(key)) {
                return entry.getValue();
            }
        }
        // Default: basic professional skills
        return List.of("Communication", "MS Office", "Problem Solving", "Teamwork");
    }
}
