package com.backend.hr_service.service;

import static org.junit.jupiter.api.Assertions.*;
import com.backend.hr_service.config.AuthForwardingFilter;
import com.backend.hr_service.model.Employee;
import com.backend.hr_service.model.PerformanceReview;
import com.backend.hr_service.repository.PerformanceReviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.time.LocalDate;
import java.util.List;
import static org.mockito.Mockito.*;


class PerformanceReviewServiceTest {

    @InjectMocks
    private PerformanceReviewService reviewService;

    @Mock
    private PerformanceReviewRepository reviewRepo;

    @Mock
    private AuditLogService auditLogService;

    @Captor
    private ArgumentCaptor<PerformanceReview> reviewCaptor;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testScheduleReviewAfterOnboarding_SavesReviewAndLogsAction() {
        Employee emp = new Employee();
        emp.setId(1L);
        emp.setFirstName("John");
        emp.setLastName("Doe");

        PerformanceReview savedReview = new PerformanceReview();
        savedReview.setId(100L);
        savedReview.setEmployee(emp);
        savedReview.setScheduledDate(LocalDate.now().plusDays(90));
        savedReview.setStatus("PENDING");

        when(reviewRepo.save(any(PerformanceReview.class))).thenReturn(savedReview);
        mockStatic(AuthForwardingFilter.class).when(AuthForwardingFilter::getCurrentUser).thenReturn("test-user");

        reviewService.scheduleReviewAfterOnboarding(emp);

        verify(reviewRepo).save(reviewCaptor.capture());
        PerformanceReview captured = reviewCaptor.getValue();

        assertEquals(emp, captured.getEmployee());
        assertEquals("PENDING", captured.getStatus());
        assertEquals(LocalDate.now().plusDays(90), captured.getScheduledDate());
        assertTrue(captured.getNotes().contains("John"));

        verify(auditLogService).logAction(
                eq("PerformanceReview"),
                eq(String.valueOf(savedReview.getId())),
                eq("CREATE"),
                eq("test-user"),
                eq(savedReview)
        );
    }

    @Test
    void testDeleteReview_DeletesByEmployeeId() {
        Long empId = 5L;

        reviewService.deleteReview(empId);

        verify(reviewRepo).deleteByEmployeeId(empId);
    }

    @Test
    void testGetReviews_ReturnsList() {
        List<PerformanceReview> mockList = List.of(new PerformanceReview(), new PerformanceReview());

        when(reviewRepo.findAll()).thenReturn(mockList);

        List<PerformanceReview> result = reviewService.getReviews();

        assertEquals(2, result.size());
        verify(reviewRepo).findAll();
    }

    @Test
    void testFindByEmployeeId_ReturnsReview() {
        Long empId = 7L;
        PerformanceReview review = new PerformanceReview();
        review.setId(1L);

        when(reviewRepo.findByEmployeeId(empId)).thenReturn(review);

        PerformanceReview result = reviewService.findByEmployeeId(empId);

        assertEquals(1L, result.getId());
        verify(reviewRepo).findByEmployeeId(empId);
    }
}
