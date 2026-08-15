package com.smartqueue.service.impl;

import com.smartqueue.dto.request.QueueRequest;
import com.smartqueue.dto.response.QueueResponse;
import com.smartqueue.dto.response.StatisticsResponse;
import com.smartqueue.entity.Queue;
import com.smartqueue.enums.TokenStatus;
import com.smartqueue.exception.ResourceNotFoundException;
import com.smartqueue.mapper.QueueMapper;
import com.smartqueue.repository.QueueRepository;
import com.smartqueue.repository.TokenRepository;
import com.smartqueue.service.QueueService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class QueueServiceImpl implements QueueService {

    private final QueueRepository queueRepository;
    private final TokenRepository tokenRepository;
    private final QueueMapper queueMapper;

    @Override
    public QueueResponse createQueue(QueueRequest request) {
        Queue queue = queueMapper.toEntity(request);
        Queue saved = queueRepository.save(queue);
        return queueMapper.toResponse(saved, 0);
    }

    @Override
    public QueueResponse updateQueue(Long id, QueueRequest request) {
        Queue queue = findQueueOrThrow(id);
        queue.setName(request.getName());
        queue.setQueueType(request.getQueueType());
        if (request.getAverageServiceTime() != null) {
            queue.setAverageServiceTime(request.getAverageServiceTime());
        }
        Queue saved = queueRepository.save(queue);
        int waiting = (int) tokenRepository.countByQueueIdAndStatus(id, TokenStatus.WAITING);
        return queueMapper.toResponse(saved, waiting);
    }

    @Override
    public void deleteQueue(Long id) {
        Queue queue = findQueueOrThrow(id);
        queueRepository.delete(queue);
    }

    @Override
    @Transactional(readOnly = true)
    public QueueResponse getQueue(Long id) {
        Queue queue = findQueueOrThrow(id);
        int waiting = (int) tokenRepository.countByQueueIdAndStatus(id, TokenStatus.WAITING);
        return queueMapper.toResponse(queue, waiting);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QueueResponse> listQueues() {
        return queueRepository.findAll().stream()
                .map(q -> queueMapper.toResponse(q, (int) tokenRepository.countByQueueIdAndStatus(q.getId(), TokenStatus.WAITING)))
                .toList();
    }

    @Override
    public QueueResponse pauseQueue(Long id) {
        Queue queue = findQueueOrThrow(id);
        queue.setIsPaused(true);
        Queue saved = queueRepository.save(queue);
        int waiting = (int) tokenRepository.countByQueueIdAndStatus(id, TokenStatus.WAITING);
        return queueMapper.toResponse(saved, waiting);
    }

    @Override
    public QueueResponse resumeQueue(Long id) {
        Queue queue = findQueueOrThrow(id);
        queue.setIsPaused(false);
        Queue saved = queueRepository.save(queue);
        int waiting = (int) tokenRepository.countByQueueIdAndStatus(id, TokenStatus.WAITING);
        return queueMapper.toResponse(saved, waiting);
    }

    @Override
    @Transactional(readOnly = true)
    public StatisticsResponse getStatistics(Long id) {
        Queue queue = findQueueOrThrow(id);
        long totalIssued = tokenRepository.countByQueueId(id);
        long completed = tokenRepository.countByQueueIdAndStatus(id, TokenStatus.COMPLETED);
        long expired = tokenRepository.countByQueueIdAndStatus(id, TokenStatus.EXPIRED);
        long skipped = tokenRepository.countByQueueIdAndStatus(id, TokenStatus.SKIPPED);
        long waiting = tokenRepository.countByQueueIdAndStatus(id, TokenStatus.WAITING);
        double completionRate = totalIssued == 0 ? 0.0 : (completed * 100.0) / totalIssued;

        return StatisticsResponse.builder()
                .queueId(queue.getId())
                .queueName(queue.getName())
                .totalTokensIssued(totalIssued)
                .totalCompleted(completed)
                .totalExpired(expired)
                .totalSkipped(skipped)
                .totalWaiting(waiting)
                .averageServiceTimeMinutes(queue.getAverageServiceTime().doubleValue())
                .completionRate(Math.round(completionRate * 100.0) / 100.0)
                .build();
    }

    private Queue findQueueOrThrow(Long id) {
        return queueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Queue not found with id: " + id));
    }
}
