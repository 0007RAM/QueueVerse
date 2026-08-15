package com.smartqueue.controller;

import com.smartqueue.dto.request.QueueRequest;
import com.smartqueue.dto.response.QueueResponse;
import com.smartqueue.dto.response.StatisticsResponse;
import com.smartqueue.service.QueueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Queues", description = "Queue creation and management")
@RestController
@RequestMapping("/queues")
@RequiredArgsConstructor
public class QueueController {

    private final QueueService queueService;

    @Operation(summary = "Create a new queue")
    @PostMapping
    public ResponseEntity<QueueResponse> createQueue(@Valid @RequestBody QueueRequest request) {
        return new ResponseEntity<>(queueService.createQueue(request), HttpStatus.CREATED);
    }

    @Operation(summary = "List all queues")
    @GetMapping
    public ResponseEntity<List<QueueResponse>> listQueues() {
        return ResponseEntity.ok(queueService.listQueues());
    }

    @Operation(summary = "Get a queue by id")
    @GetMapping("/{id}")
    public ResponseEntity<QueueResponse> getQueue(@PathVariable Long id) {
        return ResponseEntity.ok(queueService.getQueue(id));
    }

    @Operation(summary = "Update an existing queue")
    @PutMapping("/{id}")
    public ResponseEntity<QueueResponse> updateQueue(@PathVariable Long id, @Valid @RequestBody QueueRequest request) {
        return ResponseEntity.ok(queueService.updateQueue(id, request));
    }

    @Operation(summary = "Delete a queue")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQueue(@PathVariable Long id) {
        queueService.deleteQueue(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Pause a queue - no tokens can be called while paused")
    @PostMapping("/{id}/pause")
    public ResponseEntity<QueueResponse> pauseQueue(@PathVariable Long id) {
        return ResponseEntity.ok(queueService.pauseQueue(id));
    }

    @Operation(summary = "Resume a paused queue")
    @PostMapping("/{id}/resume")
    public ResponseEntity<QueueResponse> resumeQueue(@PathVariable Long id) {
        return ResponseEntity.ok(queueService.resumeQueue(id));
    }

    @Operation(summary = "Get statistics for a queue")
    @GetMapping("/{id}/statistics")
    public ResponseEntity<StatisticsResponse> getStatistics(@PathVariable Long id) {
        return ResponseEntity.ok(queueService.getStatistics(id));
    }
}
