package com.smartqueue.scheduler;

import com.smartqueue.entity.Token;
import com.smartqueue.enums.TokenStatus;
import com.smartqueue.notification.EmailNotificationService;
import com.smartqueue.repository.TokenRepository;
import com.smartqueue.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Background job that enforces the "confirm within 2 minutes" business rule:
 * every minute it finds CALLED tokens whose confirmation window has passed,
 * marks them EXPIRED, notifies the user, and automatically calls the next
 * waiting token in that queue.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class TokenExpiryScheduler {

    private final TokenRepository tokenRepository;
    private final EmailNotificationService emailNotificationService;
    private final AdminService adminService;

    @Scheduled(fixedRate = 60_000)
    @Transactional
    public void expireStaleTokensAndAdvanceQueues() {
        List<Token> expiredCandidates = tokenRepository.findExpiredCalledTokens(LocalDateTime.now());
        if (expiredCandidates.isEmpty()) {
            return;
        }

        for (Token token : expiredCandidates) {
            token.setStatus(TokenStatus.EXPIRED);
            tokenRepository.save(token);
            emailNotificationService.notifyTokenExpired(token);
            log.info("Token {} expired in queue {}", token.getTokenNumber(), token.getQueue().getName());

            try {
                adminService.callNext(token.getQueue().getId());
            } catch (RuntimeException ex) {
                // No more waiting tokens, or queue paused - nothing further to do.
                log.info("Could not auto-advance queue {}: {}", token.getQueue().getName(), ex.getMessage());
            }
        }
    }
}
