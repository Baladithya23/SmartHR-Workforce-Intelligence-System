package com.smarthr.controller;

import com.smarthr.dto.AnalyticsDashboardResponse;
import com.smarthr.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    /**
     * GET /api/analytics/dashboard
     * Returns workforce analytics for the dashboard.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<AnalyticsDashboardResponse> getDashboard() {
        return ResponseEntity.ok(analyticsService.getDashboard());
    }
}
