package com.smarthr.service;

import com.smarthr.dto.EmployeeRequest;
import com.smarthr.dto.EmployeeResponse;
import com.smarthr.dto.EmployeeStatsResponse;
import com.smarthr.entity.Department;
import com.smarthr.entity.Employee;
import com.smarthr.entity.Skill;
import com.smarthr.exception.DuplicateEmailException;
import com.smarthr.exception.ResourceNotFoundException;
import com.smarthr.repository.DepartmentRepository;
import com.smarthr.repository.EmployeeRepository;
import com.smarthr.repository.SkillRepository;
import com.smarthr.util.AuditLogger;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository   employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final SkillRepository      skillRepository;
    private final AuditLogger          auditLogger;

    // ── Get all (paginated) ───────────────────────────────────────────────
    @Transactional(readOnly = true)
    public Page<EmployeeResponse> getAllEmployees(Pageable pageable) {
        return employeeRepository.findAll(pageable).map(this::toResponse);
    }

    // ── Get all (flat list for backward-compat) ───────────────────────────
    @Transactional(readOnly = true)
    public List<EmployeeResponse> getAllEmployeesList() {
        return employeeRepository.findAll().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    // ── Get by ID ─────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public EmployeeResponse getEmployeeById(Long id) {
        return toResponse(findById(id));
    }

    // ── Create ────────────────────────────────────────────────────────────
    @Transactional
    public EmployeeResponse createEmployee(EmployeeRequest request, String performedBy) {
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Employee with email '" + request.getEmail() + "' already exists");
        }

        Employee employee = buildEmployee(new Employee(), request);
        employee = employeeRepository.save(employee);

        auditLogger.log("EMPLOYEE_CREATED", performedBy,
            employee.getEmployeeName() + " (" + employee.getEmail() + ")",
            "New employee added with designation: " + employee.getDesignation());

        return toResponse(employee);
    }

    // ── Update ────────────────────────────────────────────────────────────
    @Transactional
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request, String performedBy) {
        Employee employee = findById(id);

        // Check email uniqueness (allow own email)
        if (!employee.getEmail().equalsIgnoreCase(request.getEmail()) &&
            employeeRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email '" + request.getEmail() + "' is already in use");
        }

        buildEmployee(employee, request);
        employee = employeeRepository.save(employee);

        auditLogger.log("EMPLOYEE_UPDATED", performedBy,
            employee.getEmployeeName() + " (" + employee.getEmail() + ")",
            "Employee record updated");

        return toResponse(employee);
    }

    // ── Delete ────────────────────────────────────────────────────────────
    @Transactional
    public void deleteEmployee(Long id, String performedBy) {
        Employee employee = findById(id);
        String target = employee.getEmployeeName() + " (" + employee.getEmail() + ")";
        employeeRepository.delete(employee);
        auditLogger.log("EMPLOYEE_DELETED", performedBy, target, "Employee record permanently deleted");
    }

    // ── Search ────────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public Page<EmployeeResponse> searchEmployees(String name, String dept, String designation,
                                                    BigDecimal minSalary, BigDecimal maxSalary,
                                                    Pageable pageable) {
        return employeeRepository.searchEmployees(
            blankToNull(name), blankToNull(dept), blankToNull(designation),
            minSalary, maxSalary, pageable
        ).map(this::toResponse);
    }

    // ── Stats ─────────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public EmployeeStatsResponse getStats() {
        long total = employeeRepository.count();
        BigDecimal sum = employeeRepository.sumSalaries();
        BigDecimal avg = employeeRepository.avgSalary();
        return EmployeeStatsResponse.builder()
            .totalEmployees(total)
            .totalSalaryBudget(sum != null ? sum : BigDecimal.ZERO)
            .averageSalary(avg != null ? avg : BigDecimal.ZERO)
            .build();
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    private Employee buildEmployee(Employee employee, EmployeeRequest req) {
        employee.setEmployeeName(req.getEmployeeName());
        employee.setEmail(req.getEmail());
        employee.setPhone(req.getPhone());
        employee.setDesignation(req.getDesignation());
        employee.setSalary(req.getSalary());
        employee.setJoiningDate(req.getJoiningDate() != null ? req.getJoiningDate() : LocalDate.now());
        employee.setStatus(req.getStatus() != null ? req.getStatus() : "ACTIVE");

        // Resolve department
        if (req.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(req.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + req.getDepartmentId()));
            employee.setDepartment(dept);
        }

        // Resolve skills
        if (req.getSkills() != null) {
            Set<Skill> skills = new HashSet<>();
            for (String skillName : req.getSkills()) {
                Skill skill = skillRepository.findBySkillNameIgnoreCase(skillName.trim())
                    .orElseGet(() -> skillRepository.save(Skill.builder().skillName(skillName.trim()).build()));
                skills.add(skill);
            }
            employee.setSkills(skills);
        }

        return employee;
    }

    public EmployeeResponse toResponse(Employee e) {
        return EmployeeResponse.builder()
            .employeeId(e.getEmployeeId())
            .employeeName(e.getEmployeeName())
            .email(e.getEmail())
            .phone(e.getPhone())
            .designation(e.getDesignation())
            .salary(e.getSalary())
            .joiningDate(e.getJoiningDate())
            .status(e.getStatus())
            .departmentId(e.getDepartment() != null ? e.getDepartment().getDepartmentId() : null)
            .departmentName(e.getDepartment() != null ? e.getDepartment().getDepartmentName() : null)
            .skills(e.getSkills().stream().map(Skill::getSkillName).sorted().collect(Collectors.toList()))
            .build();
    }

    private Employee findById(Long id) {
        return employeeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    private String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s;
    }
}
