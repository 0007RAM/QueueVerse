package com.smartqueue.mapper;

import com.smartqueue.dto.request.QueueRequest;
import com.smartqueue.dto.response.QueueResponse;
import com.smartqueue.entity.Queue;
import org.springframework.stereotype.Component;

/**
 * Converts between Queue entity and its DTOs.
 */
@Component
public class QueueMapper {

    public Queue toEntity(QueueRequest request) {
        return Queue.builder()
                .name(request.getName())
                .queueType(request.getQueueType())
                .averageServiceTime(request.getAverageServiceTime() != null ? request.getAverageServiceTime() : 5)
                .isPaused(false)
                .currentTokenNumber(0)
                .build();
    }

    /**
     * Maps a Queue entity to its response DTO. waitingCount is computed separately
     * by the service layer (via a repository count query) to avoid lazy-loading
     * the full tokens collection just to count one status.
     */
    public QueueResponse toResponse(Queue queue, int waitingCount) {
        return QueueResponse.builder()
                .id(queue.getId())
                .name(queue.getName())
                .queueType(queue.getQueueType())
                .currentTokenNumber(queue.getCurrentTokenNumber())
                .averageServiceTime(queue.getAverageServiceTime())
                .isPaused(queue.getIsPaused())
                .waitingCount(waitingCount)
                .createdAt(queue.getCreatedAt())
                .build();
    }
}
