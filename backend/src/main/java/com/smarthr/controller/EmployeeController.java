package com.smarthr.controller;

import com.smarthr.dto.EmployeeRequest;
import com.smarthr.dto.EmployeeResponse;
import com.smarthr.dto.EmployeeStatsResponse;
import com.smarthr.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    /** GET /api/employees — full list (no pagination) */
    @GetMapping
    public ResponseEntity<List<EmployeeResponse>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployeesList());
    }

    /** GET /api/employees/paged?page=0&size=10&sort=employeeName */
    @GetMapping("/paged")
    public ResponseEntity<Page<EmployeeResponse>> getAllPaged(
        @RequestParam(defaultValue = "0")           int page,
        @RequestParam(defaultValue = "10")          int size,
        @RequestParam(defaultValue = "employeeName") String sort,
        @RequestParam(defaultValue = "asc")         String dir
    ) {
        Sort.Direction direction = dir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort));
        return ResponseEntity.ok(employeeService.getAllEmployees(pageable));
    }

    /** GET /api/employees/stats */
    @GetMapping("/stats")
    public ResponseEntity<EmployeeStatsResponse> getStats() {
        return ResponseEntity.ok(employeeService.getStats());
    }

    /** GET /api/employees/search */
    @GetMapping("/search")
    public ResponseEntity<Page<EmployeeResponse>> search(
        @RequestParam(required = false) String name,
        @RequestParam(required = false) String dept,
        @RequestParam(required = false) String designation,
        @RequestParam(required = false) BigDecimal minSalary,
        @RequestParam(required = false) BigDecimal maxSalary,
        @RequestParam(defaultValue = "0")  int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(
            employeeService.searchEmployees(name, dept, designation, minSalary, maxSalary, pageable)
        );
    }

    /** GET /api/employees/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    /** POST /api/employees */
    @PostMapping
    public ResponseEntity<EmployeeResponse> create(
        @Valid @RequestBody EmployeeRequest request,
        Authentication auth
    ) {
        String performer = auth != null ? auth.getName() : "system";
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(employeeService.createEmployee(request, performer));
    }

    /** PUT /api/employees/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<EmployeeResponse> update(
        @PathVariable Long id,
        @Valid @RequestBody EmployeeRequest request,
        Authentication auth
    ) {
        String performer = auth != null ? auth.getName() : "system";
        return ResponseEntity.ok(employeeService.updateEmployee(id, request, performer));
    }

    /** DELETE /api/employees/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        String performer = auth != null ? auth.getName() : "system";
        employeeService.deleteEmployee(id, performer);
        return ResponseEntity.noContent().build();
    }
}
