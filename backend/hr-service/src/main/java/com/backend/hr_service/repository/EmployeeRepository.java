package com.backend.hr_service.repository;
import com.backend.hr_service.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByEmail(String email);

    List<Employee> findByDepartment(String department);

    @Modifying
    @Query("UPDATE Employee e SET e.mentor = null WHERE e.mentor.id = :mentorId")
    void clearMentorReference(@Param("mentorId") Long mentorId);

    @Query("SELECT e.mentor.id, COUNT(e) FROM Employee e WHERE e.mentor IS NOT NULL GROUP BY e.mentor.id")
    List<Object[]> countMenteesByMentor();

    List<Employee> findByDepartmentAndIsMentorTrue(String department);
}