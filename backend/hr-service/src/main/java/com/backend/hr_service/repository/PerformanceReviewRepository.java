package com.backend.hr_service.repository;

import com.backend.hr_service.model.Employee;
import com.backend.hr_service.model.PerformanceReview;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface PerformanceReviewRepository extends JpaRepository<PerformanceReview, Long> {

    // Named query style
    List<PerformanceReview> findByScheduledDateBetween(LocalDate from, LocalDate to);

    @Query("SELECT pr FROM PerformanceReview pr WHERE pr.employee.id = :employeeId")
    PerformanceReview findByEmployeeId(@Param("employeeId") Long employeeId);

    @Modifying
    @Transactional
    @Query("DELETE FROM PerformanceReview pr WHERE pr.employee.id = :employeeId")
    void deleteByEmployeeId(@Param("employeeId") Long employeeId);
}
