package com.backend.hr_service.controller;
import com.backend.hr_service.model.PerformanceReview;
import com.backend.hr_service.service.PerformanceReviewService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(PerformanceReviewController.class)
class PerformanceReviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PerformanceReviewService reviewService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldReturnUpcomingReviews() throws Exception {
        PerformanceReview review = new PerformanceReview();
        review.setId(1L);
        review.setScheduledDate(LocalDate.now().plusDays(90));
        review.setStatus("PENDING");

        when(reviewService.getReviews()).thenReturn(List.of(review));

        mockMvc.perform(get("/api/reviews/upcoming"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].status").value("PENDING"));
    }

    @Test
    void shouldReturnReviewByEmployeeId() throws Exception {
        PerformanceReview review = new PerformanceReview();
        review.setId(2L);
        review.setScheduledDate(LocalDate.now().plusDays(60));
        review.setStatus("PENDING");

        when(reviewService.findByEmployeeId(2L)).thenReturn(review);

        mockMvc.perform(get("/api/reviews/employee/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }
}
