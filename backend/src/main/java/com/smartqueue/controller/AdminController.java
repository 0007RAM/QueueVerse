package com.smartqueue.controller;

import com.smartqueue.dto.response.DashboardResponse;
import com.smartqueue.dto.response.StatisticsResponse;
import com.smartqueue.dto.response.TokenResponse;
import com.smartqueue.service.AdminService;
import com.smartqueue.service.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Admin", description = "Admin operations: calling tokens, dashboard, analytics")
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final TokenService tokenService;

    @Operation(summary = "Call the next waiting token in a queue")
    @PostMapping("/next/{queueId}")
    public ResponseEntity<TokenResponse> callNext(@PathVariable Long queueId) {
        return ResponseEntity.ok(adminService.callNext(queueId));
    }

    @Operation(summary = "Skip a token")
    @PostMapping("/skip/{tokenId}")
    public ResponseEntity<TokenResponse> skipToken(@PathVariable Long tokenId) {
        return ResponseEntity.ok(tokenService.skipToken(tokenId));
    }

    @Operation(summary = "View waiting tokens for a queue")
    @GetMapping("/waiting/{queueId}")
    public ResponseEntity<List<TokenResponse>> viewWaitingTokens(@PathVariable Long queueId) {
        return ResponseEntity.ok(adminService.viewWaitingTokens(queueId));
    }

    @Operation(summary = "View active (called/confirmed) tokens for a queue")
    @GetMapping("/active/{queueId}")
    public ResponseEntity<List<TokenResponse>> viewActiveTokens(@PathVariable Long queueId) {
        return ResponseEntity.ok(adminService.viewActiveTokens(queueId));
    }

    @Operation(summary = "Get the live dashboard for a queue")
    @GetMapping("/dashboard/{queueId}")
    public ResponseEntity<DashboardResponse> getDashboard(@PathVariable Long queueId) {
        return ResponseEntity.ok(adminService.getDashboard(queueId));
    }

    @Operation(summary = "Get statistics across all queues")
    @GetMapping("/statistics")
    public ResponseEntity<List<StatisticsResponse>> getStatistics() {
        return ResponseEntity.ok(adminService.getStatistics());
    }
}
