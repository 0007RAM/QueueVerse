package com.smartqueue.repository;

import com.smartqueue.entity.Token;
import com.smartqueue.enums.TokenStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {

    List<Token> findByQueueIdAndStatusOrderByJoinedAtAsc(Long queueId, TokenStatus status);

    List<Token> findByQueueIdAndStatusInOrderByJoinedAtAsc(Long queueId, List<TokenStatus> statuses);

    Optional<Token> findFirstByQueueIdAndStatusOrderByJoinedAtAsc(Long queueId, TokenStatus status);

    /**
     * A user may only have ONE active (non-terminal) token per queue at a time.
     */
    @Query("SELECT t FROM Token t WHERE t.user.id = :userId AND t.queue.id = :queueId " +
           "AND t.status IN ('WAITING','CALLED','CONFIRMED')")
    Optional<Token> findActiveTokenForUserInQueue(@Param("userId") Long userId, @Param("queueId") Long queueId);

    @Query("SELECT t FROM Token t WHERE t.status = 'CALLED' AND t.expiresAt < :now")
    List<Token> findExpiredCalledTokens(@Param("now") LocalDateTime now);

    long countByQueueIdAndStatus(Long queueId, TokenStatus status);

    @Query("SELECT COUNT(t) FROM Token t WHERE t.queue.id = :queueId AND t.status = 'COMPLETED' " +
           "AND t.joinedAt >= :startOfDay")
    long countCompletedTodayByQueue(@Param("queueId") Long queueId, @Param("startOfDay") LocalDateTime startOfDay);

    long countByQueueId(Long queueId);

    long countByQueueIdAndStatusIn(Long queueId, List<TokenStatus> statuses);

    /**
     * Native query example: fetch the most recent tokens across the system for reporting.
     */
    @Query(value = "SELECT * FROM tokens ORDER BY joined_at DESC LIMIT :limit", nativeQuery = true)
    List<Token> findRecentTokensNative(@Param("limit") int limit);
}
