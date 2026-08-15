package com.smartqueue.service.impl;

import com.smartqueue.dto.request.JoinQueueRequest;
import com.smartqueue.dto.response.TokenResponse;
import com.smartqueue.entity.Queue;
import com.smartqueue.entity.Token;
import com.smartqueue.entity.User;
import com.smartqueue.enums.TokenStatus;
import com.smartqueue.exception.DuplicateTokenException;
import com.smartqueue.exception.InvalidQueueStateException;
import com.smartqueue.exception.ResourceNotFoundException;
import com.smartqueue.mapper.TokenMapper;
import com.smartqueue.notification.EmailNotificationService;
import com.smartqueue.repository.QueueRepository;
import com.smartqueue.repository.TokenRepository;
import com.smartqueue.repository.UserRepository;
import com.smartqueue.service.TokenService;
import com.smartqueue.util.TokenNumberGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TokenServiceImpl implements TokenService {

    private final TokenRepository tokenRepository;
    private final QueueRepository queueRepository;
    private final UserRepository userRepository;
    private final TokenMapper tokenMapper;
    private final TokenNumberGenerator tokenNumberGenerator;
    private final EmailNotificationService emailNotificationService;

    @Override
    public TokenResponse joinQueue(Long queueId, JoinQueueRequest request) {
        Queue queue = queueRepository.findById(queueId)
                .orElseThrow(() -> new ResourceNotFoundException("Queue not found with id: " + queueId));

        if (Boolean.TRUE.equals(queue.getIsPaused())) {
            throw new InvalidQueueStateException("Queue \"" + queue.getName() + "\" is currently paused");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        tokenRepository.findActiveTokenForUserInQueue(user.getId(), queueId).ifPresent(t -> {
            throw new DuplicateTokenException("User already has an active token (" + t.getTokenNumber() + ") in this queue");
        });

        int nextSequence = queue.getCurrentTokenNumber() + 1;
        queue.setCurrentTokenNumber(nextSequence);
        queueRepository.save(queue);

        Token token = Token.builder()
                .tokenNumber(tokenNumberGenerator.generate(queue.getQueueType(), nextSequence))
                .status(TokenStatus.WAITING)
                .user(user)
                .queue(queue)
                .build();

        Token saved = tokenRepository.save(token);
        recalculatePositions(queueId);

        // Re-fetch to get the freshly calculated position.
        Token refreshed = tokenRepository.findById(saved.getId()).orElseThrow();
        return tokenMapper.toResponse(refreshed);
    }

    @Override
    @Transactional(readOnly = true)
    public TokenResponse getToken(Long id) {
        return tokenMapper.toResponse(findTokenOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Integer trackPosition(Long id) {
        Token token = findTokenOrThrow(id);
        return token.getPosition();
    }

    @Override
    public TokenResponse confirmToken(Long id) {
        Token token = findTokenOrThrow(id);
        if (token.getStatus() != TokenStatus.CALLED) {
            throw new InvalidQueueStateException("Only a CALLED token can be confirmed");
        }
        token.setStatus(TokenStatus.CONFIRMED);
        Token saved = tokenRepository.save(token);
        return tokenMapper.toResponse(saved);
    }

    @Override
    public TokenResponse completeToken(Long id) {
        Token token = findTokenOrThrow(id);
        if (token.getStatus() != TokenStatus.CONFIRMED && token.getStatus() != TokenStatus.CALLED) {
            throw new InvalidQueueStateException("Only a CALLED or CONFIRMED token can be completed");
        }
        token.setStatus(TokenStatus.COMPLETED);
        Token saved = tokenRepository.save(token);
        emailNotificationService.notifyQueueCompleted(saved);
        recalculatePositions(token.getQueue().getId());
        return tokenMapper.toResponse(saved);
    }

    @Override
    public TokenResponse cancelToken(Long id) {
        Token token = findTokenOrThrow(id);
        if (token.getStatus() == TokenStatus.COMPLETED) {
            throw new InvalidQueueStateException("A completed token cannot be cancelled");
        }
        token.setStatus(TokenStatus.SKIPPED);
        Token saved = tokenRepository.save(token);
        recalculatePositions(token.getQueue().getId());
        return tokenMapper.toResponse(saved);
    }

    @Override
    public TokenResponse skipToken(Long id) {
        Token token = findTokenOrThrow(id);
        token.setStatus(TokenStatus.SKIPPED);
        Token saved = tokenRepository.save(token);
        recalculatePositions(token.getQueue().getId());
        return tokenMapper.toResponse(saved);
    }

    /**
     * Recomputes the 1-based position of every WAITING token in a queue, ordered by join time (FCFS).
     */
    private void recalculatePositions(Long queueId) {
        List<Token> waiting = tokenRepository.findByQueueIdAndStatusOrderByJoinedAtAsc(queueId, TokenStatus.WAITING);
        int position = 1;
        for (Token t : waiting) {
            t.setPosition(position++);
        }
        tokenRepository.saveAll(waiting);
    }

    private Token findTokenOrThrow(Long id) {
        return tokenRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Token not found with id: " + id));
    }
}
