package com.backend.hr_service.controller;

import com.backend.hr_service.model.PerformanceReview;
import com.backend.hr_service.service.PerformanceReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin
public class PerformanceReviewController {

    @Autowired
    private PerformanceReviewService reviewService;

    @GetMapping("/upcoming")
    public ResponseEntity<List<PerformanceReview>> getUpcomingReviews() {
        return ResponseEntity.ok(reviewService.getReviews());
    }

    @GetMapping("/employee/{id}")
    public PerformanceReview getByEmployee(@PathVariable Long id) {
        return reviewService.findByEmployeeId(id);
    }
}
