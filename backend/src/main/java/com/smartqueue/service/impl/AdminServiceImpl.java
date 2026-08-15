package com.smartqueue.service.impl;

import com.smartqueue.dto.response.DashboardResponse;
import com.smartqueue.dto.response.StatisticsResponse;
import com.smartqueue.dto.response.TokenResponse;
import com.smartqueue.entity.Queue;
import com.smartqueue.entity.Token;
import com.smartqueue.enums.TokenStatus;
import com.smartqueue.exception.InvalidQueueStateException;
import com.smartqueue.exception.ResourceNotFoundException;
import com.smartqueue.mapper.TokenMapper;
import com.smartqueue.notification.EmailNotificationService;
import com.smartqueue.repository.QueueRepository;
import com.smartqueue.repository.TokenRepository;
import com.smartqueue.service.AdminService;
import com.smartqueue.service.QueueService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final QueueRepository queueRepository;
    private final TokenRepository tokenRepository;
    private final TokenMapper tokenMapper;
    private final EmailNotificationService emailNotificationService;
    private final QueueService queueService;

    @Value("${smartqueue.token.confirmation-timeout-minutes:2}")
    private int confirmationTimeoutMinutes;

    @Override
    public TokenResponse callNext(Long queueId) {
        Queue queue = queueRepository.findById(queueId)
                .orElseThrow(() -> new ResourceNotFoundException("Queue not found with id: " + queueId));

        if (Boolean.TRUE.equals(queue.getIsPaused())) {
            throw new InvalidQueueStateException("Cannot call next token: queue \"" + queue.getName() + "\" is paused");
        }

        Token next = tokenRepository.findFirstByQueueIdAndStatusOrderByJoinedAtAsc(queueId, TokenStatus.WAITING)
                .orElseThrow(() -> new InvalidQueueStateException("No waiting tokens in queue \"" + queue.getName() + "\""));

        next.setStatus(TokenStatus.CALLED);
        next.setCalledAt(LocalDateTime.now());
        next.setExpiresAt(LocalDateTime.now().plusMinutes(confirmationTimeoutMinutes));
        Token saved = tokenRepository.save(next);

        emailNotificationService.notifyTokenCalled(saved);
        return tokenMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TokenResponse> viewWaitingTokens(Long queueId) {
        return tokenRepository.findByQueueIdAndStatusOrderByJoinedAtAsc(queueId, TokenStatus.WAITING).stream()
                .map(tokenMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TokenResponse> viewActiveTokens(Long queueId) {
        return tokenRepository.findByQueueIdAndStatusInOrderByJoinedAtAsc(
                        queueId, List.of(TokenStatus.CALLED, TokenStatus.CONFIRMED)).stream()
                .map(tokenMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(Long queueId) {
        Queue queue = queueRepository.findById(queueId)
                .orElseThrow(() -> new ResourceNotFoundException("Queue not found with id: " + queueId));

        List<TokenResponse> waiting = viewWaitingTokens(queueId);
        List<TokenResponse> active = viewActiveTokens(queueId);
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        long completedToday = tokenRepository.countCompletedTodayByQueue(queueId, startOfDay);

        return DashboardResponse.builder()
                .queueId(queue.getId())
                .queueName(queue.getName())
                .isPaused(queue.getIsPaused())
                .currentTokenNumber(queue.getCurrentTokenNumber())
                .waitingTokens(waiting)
                .activeTokens(active)
                .totalWaiting(waiting.size())
                .totalCompletedToday((int) completedToday)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StatisticsResponse> getStatistics() {
        return queueRepository.findAll().stream()
                .map(q -> queueService.getStatistics(q.getId()))
                .toList();
    }
}
