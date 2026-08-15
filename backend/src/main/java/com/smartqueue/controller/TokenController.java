package com.smartqueue.controller;

import com.smartqueue.dto.request.JoinQueueRequest;
import com.smartqueue.dto.response.TokenResponse;
import com.smartqueue.service.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Tokens", description = "Joining queues and managing tokens")
@RestController
@RequiredArgsConstructor
public class TokenController {

    private final TokenService tokenService;

    @Operation(summary = "Join a queue and receive a token")
    @PostMapping("/queues/{queueId}/join")
    public ResponseEntity<TokenResponse> joinQueue(@PathVariable Long queueId, @Valid @RequestBody JoinQueueRequest request) {
        return new ResponseEntity<>(tokenService.joinQueue(queueId, request), HttpStatus.CREATED);
    }

    @Operation(summary = "Get token details")
    @GetMapping("/tokens/{id}")
    public ResponseEntity<TokenResponse> getToken(@PathVariable Long id) {
        return ResponseEntity.ok(tokenService.getToken(id));
    }

    @Operation(summary = "Track the live position of a token in its queue")
    @GetMapping("/tokens/{id}/position")
    public ResponseEntity<Map<String, Integer>> trackPosition(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("position", tokenService.trackPosition(id)));
    }

    @Operation(summary = "Confirm presence after being called")
    @PostMapping("/tokens/{id}/confirm")
    public ResponseEntity<TokenResponse> confirmToken(@PathVariable Long id) {
        return ResponseEntity.ok(tokenService.confirmToken(id));
    }

    @Operation(summary = "Mark a token's service as completed")
    @PostMapping("/tokens/{id}/complete")
    public ResponseEntity<TokenResponse> completeToken(@PathVariable Long id) {
        return ResponseEntity.ok(tokenService.completeToken(id));
    }

    @Operation(summary = "Cancel a token")
    @PostMapping("/tokens/{id}/cancel")
    public ResponseEntity<TokenResponse> cancelToken(@PathVariable Long id) {
        return ResponseEntity.ok(tokenService.cancelToken(id));
    }
}
