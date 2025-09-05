package com.backend.hr_service.service;

import com.backend.hr_service.config.AuthForwardingFilter;
import com.backend.hr_service.model.Employee;
import com.backend.hr_service.model.PerformanceReview;
import com.backend.hr_service.repository.PerformanceReviewRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class PerformanceReviewService {

    @Autowired
    PerformanceReviewRepository reviewRepo;

    @Autowired
    private AuditLogService logService;  // Inject audit log service

    public void scheduleReviewAfterOnboarding(Employee employee) {
        PerformanceReview review = new PerformanceReview();
        review.setEmployee(employee);
        review.setScheduledDate(LocalDate.now().plusDays(90));
        review.setStatus("PENDING");
        review.setNotes("We need to review the performance of " + employee.getFirstName() + " " + employee.getLastName() + ".");

        PerformanceReview savedReview = reviewRepo.save(review);

        // Audit log: create performance review
        logService.logAction(
                "PerformanceReview",
                String.valueOf(savedReview.getId()),
                "CREATE",
                AuthForwardingFilter.getCurrentUser(),
                savedReview
        );
    }

    public void deleteReview(Long employeeId) {
        reviewRepo.deleteByEmployeeId(employeeId);
    }


    public List<PerformanceReview> getReviews() {
        return reviewRepo.findAll();
    }

    public PerformanceReview findByEmployeeId(Long id) {
        return reviewRepo.findByEmployeeId(id);
    }
}

