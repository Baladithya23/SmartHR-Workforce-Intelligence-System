package com.smarthr.repository;

import com.smarthr.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    boolean existsByEmail(String email);
    Optional<Employee> findByEmail(String email);

    @Query("SELECT COUNT(e) FROM Employee e WHERE e.department.departmentId = :deptId")
    long countByDepartmentId(@Param("deptId") Long deptId);

    @Query("SELECT e FROM Employee e WHERE e.department.departmentId = :deptId")
    List<Employee> findByDepartmentId(@Param("deptId") Long deptId);

    @Query("""
        SELECT e FROM Employee e
        WHERE (:name IS NULL OR LOWER(e.employeeName) LIKE LOWER(CONCAT('%', :name, '%')))
          AND (:dept IS NULL OR LOWER(e.department.departmentName) LIKE LOWER(CONCAT('%', :dept, '%')))
          AND (:designation IS NULL OR LOWER(e.designation) LIKE LOWER(CONCAT('%', :designation, '%')))
          AND (:minSalary IS NULL OR e.salary >= :minSalary)
          AND (:maxSalary IS NULL OR e.salary <= :maxSalary)
        """)
    Page<Employee> searchEmployees(
        @Param("name") String name,
        @Param("dept") String dept,
        @Param("designation") String designation,
        @Param("minSalary") BigDecimal minSalary,
        @Param("maxSalary") BigDecimal maxSalary,
        Pageable pageable
    );

    @Query("SELECT SUM(e.salary) FROM Employee e")
    BigDecimal sumSalaries();

    @Query("SELECT AVG(e.salary) FROM Employee e")
    BigDecimal avgSalary();

    @Query("SELECT e FROM Employee e ORDER BY e.salary DESC")
    List<Employee> findTopBySalaryDesc(Pageable pageable);

    @Query("SELECT e FROM Employee e ORDER BY e.joiningDate DESC")
    List<Employee> findRecentlyJoined(Pageable pageable);

    @Query("SELECT e.department.departmentName, COUNT(e) FROM Employee e GROUP BY e.department.departmentName")
    List<Object[]> countByDepartmentName();
}
