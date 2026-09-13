package com.smarthr.controller;

import com.smarthr.dto.SkillGapResponse;
import com.smarthr.service.SkillGapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/skill-gap")
@RequiredArgsConstructor
public class SkillGapController {

    private final SkillGapService skillGapService;

    /**
     * GET /api/skill-gap/{employeeId}
     * Returns the skill gap analysis for a specific employee.
     */
    @GetMapping("/{employeeId}")
    public ResponseEntity<SkillGapResponse> analyze(@PathVariable Long employeeId) {
        return ResponseEntity.ok(skillGapService.analyzeSkillGap(employeeId));
    }
}
