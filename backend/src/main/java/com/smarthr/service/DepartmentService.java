package com.smarthr.service;

import com.smarthr.dto.DepartmentRequest;
import com.smarthr.dto.DepartmentResponse;
import com.smarthr.entity.Department;
import com.smarthr.exception.ResourceNotFoundException;
import com.smarthr.repository.DepartmentRepository;
import com.smarthr.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository   employeeRepository;

    // ── Get all ───────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    // ── Get by ID ─────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public DepartmentResponse getDepartmentById(Long id) {
        Department dept = findById(id);
        return toResponse(dept);
    }

    // ── Count ─────────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public long getDepartmentCount() {
        return departmentRepository.count();
    }

    // ── Create ────────────────────────────────────────────────────────────
    @Transactional
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        Department dept = Department.builder()
            .departmentName(request.getDepartmentName())
            .description(request.getDescription())
            .location(request.getLocation())
            .build();
        return toResponse(departmentRepository.save(dept));
    }

    // ── Update ────────────────────────────────────────────────────────────
    @Transactional
    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        Department dept = findById(id);
        dept.setDepartmentName(request.getDepartmentName());
        dept.setDescription(request.getDescription());
        dept.setLocation(request.getLocation());
        return toResponse(departmentRepository.save(dept));
    }

    // ── Delete ────────────────────────────────────────────────────────────
    @Transactional
    public void deleteDepartment(Long id) {
        Department dept = findById(id);
        departmentRepository.delete(dept);
    }

    // ── Helpers ───────────────────────────────────────────────────────────
    private Department findById(Long id) {
        return departmentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
    }

    private DepartmentResponse toResponse(Department dept) {
        long count = employeeRepository.countByDepartmentId(dept.getDepartmentId());
        return DepartmentResponse.builder()
            .departmentId(dept.getDepartmentId())
            .departmentName(dept.getDepartmentName())
            .description(dept.getDescription())
            .location(dept.getLocation())
            .employeeCount(count)
            .build();
    }
}
