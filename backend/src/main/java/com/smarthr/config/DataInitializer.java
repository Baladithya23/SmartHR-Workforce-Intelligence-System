package com.smarthr.config;

import com.smarthr.entity.*;
import com.smarthr.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository       roleRepository;
    private final UserRepository       userRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository   employeeRepository;
    private final SkillRepository      skillRepository;
    private final PasswordEncoder      passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (roleRepository.count() > 0) {
            log.info("Sample data already present – skipping initialization.");
            return;
        }
        log.info("Initializing sample data for SmartHR...");

        // ── 1. Roles ────────────────────────────────────────────────────
        Role adminRole    = roleRepository.save(Role.builder().name("ROLE_ADMIN").build());
        Role hrRole       = roleRepository.save(Role.builder().name("ROLE_HR").build());
        Role employeeRole = roleRepository.save(Role.builder().name("ROLE_EMPLOYEE").build());

        // ── 2. Users ─────────────────────────────────────────────────────
        userRepository.save(User.builder()
            .username("admin")
            .email("admin@smarthr.com")
            .password(passwordEncoder.encode("admin123"))
            .roles(Set.of(adminRole))
            .build());

        userRepository.save(User.builder()
            .username("hruser")
            .email("hr@smarthr.com")
            .password(passwordEncoder.encode("hr1234"))
            .roles(Set.of(hrRole))
            .build());

        userRepository.save(User.builder()
            .username("emp1")
            .email("emp1@smarthr.com")
            .password(passwordEncoder.encode("emp123"))
            .roles(Set.of(employeeRole))
            .build());

        // ── 3. Departments ───────────────────────────────────────────────
        Department itDept = departmentRepository.save(Department.builder()
            .departmentName("IT")
            .description("Information Technology – product engineering, DevOps, and infrastructure")
            .location("Floor 3, Block A").build());

        Department hrDept = departmentRepository.save(Department.builder()
            .departmentName("HR")
            .description("Human Resources – recruitment, payroll, and employee relations")
            .location("Floor 1, Block B").build());

        Department financeDept = departmentRepository.save(Department.builder()
            .departmentName("Finance")
            .description("Finance & Accounting – budgets, audits, and financial reporting")
            .location("Floor 2, Block C").build());

        Department salesDept = departmentRepository.save(Department.builder()
            .departmentName("Sales")
            .description("Sales & Business Development – client acquisition and revenue growth")
            .location("Floor 2, Block A").build());

        // ── 4. Skills ─────────────────────────────────────────────────────
        Map<String, Skill> skillMap = new HashMap<>();
        for (String name : List.of(
            "Java","Spring Boot","React","SQL","REST APIs","Git","Maven",
            "HTML","CSS","JavaScript","Docker","Python","Excel","Recruitment",
            "HR Policies","Communication","Accounting","Tally","GST",
            "CRM","Negotiation","Market Research","DevOps","Agile","JIRA"
        )) {
            skillMap.put(name, skillRepository.save(Skill.builder().skillName(name).build()));
        }

        // ── 5. Employees ─────────────────────────────────────────────────
        createEmployee("Arjun Sharma",  "arjun@smarthr.com",  "+91-9876543210",
            "Backend Developer",    itDept, new BigDecimal("85000"),
            LocalDate.of(2022, 3, 15), "ACTIVE",
            skills(skillMap, "Java","Spring Boot","SQL","REST APIs","Git"));

        createEmployee("Priya Patel",   "priya@smarthr.com",   "+91-9876543211",
            "Full Stack Developer", itDept, new BigDecimal("92000"),
            LocalDate.of(2021, 7, 1),  "ACTIVE",
            skills(skillMap, "Java","Spring Boot","React","SQL","Git","Maven"));

        createEmployee("Rahul Verma",   "rahul@smarthr.com",   "+91-9876543212",
            "Frontend Developer",   itDept, new BigDecimal("78000"),
            LocalDate.of(2023, 1, 10), "ACTIVE",
            skills(skillMap, "React","JavaScript","HTML","CSS"));

        createEmployee("Sneha Reddy",   "sneha@smarthr.com",   "+91-9876543213",
            "HR Manager",           hrDept, new BigDecimal("70000"),
            LocalDate.of(2020, 5, 20), "ACTIVE",
            skills(skillMap, "Recruitment","HR Policies","Communication","Excel"));

        createEmployee("Vikram Singh",  "vikram@smarthr.com",  "+91-9876543214",
            "HR Executive",         hrDept, new BigDecimal("55000"),
            LocalDate.of(2023, 8, 1),  "ACTIVE",
            skills(skillMap, "Recruitment","Communication","Excel"));

        createEmployee("Ananya Gupta",  "ananya@smarthr.com",  "+91-9876543215",
            "Finance Manager",      financeDept, new BigDecimal("95000"),
            LocalDate.of(2019, 11, 5), "ACTIVE",
            skills(skillMap, "Accounting","Tally","Excel","GST"));

        createEmployee("Kiran Kumar",   "kiran@smarthr.com",   "+91-9876543216",
            "Sales Manager",        salesDept, new BigDecimal("88000"),
            LocalDate.of(2021, 2, 14), "ACTIVE",
            skills(skillMap, "CRM","Negotiation","Communication","Market Research","Excel"));

        createEmployee("Meera Joshi",   "meera@smarthr.com",   "+91-9876543217",
            "Sales Executive",      salesDept, new BigDecimal("52000"),
            LocalDate.of(2024, 4, 1),  "ACTIVE",
            skills(skillMap, "CRM","Communication","Excel"));

        log.info("Sample data initialization complete ✓");
        log.info("===========================================");
        log.info("Login credentials:");
        log.info("  ADMIN    → username: admin    | password: admin123");
        log.info("  HR       → username: hruser   | password: hr1234");
        log.info("  EMPLOYEE → username: emp1     | password: emp123");
        log.info("===========================================");
    }

    private void createEmployee(String name, String email, String phone,
                                 String designation, Department dept,
                                 BigDecimal salary, LocalDate joiningDate,
                                 String status, Set<Skill> skills) {
        employeeRepository.save(Employee.builder()
            .employeeName(name)
            .email(email)
            .phone(phone)
            .designation(designation)
            .salary(salary)
            .joiningDate(joiningDate)
            .status(status)
            .department(dept)
            .skills(skills)
            .build());
    }

    private Set<Skill> skills(Map<String, Skill> skillMap, String... names) {
        Set<Skill> set = new HashSet<>();
        for (String n : names) {
            if (skillMap.containsKey(n)) set.add(skillMap.get(n));
        }
        return set;
    }
}
