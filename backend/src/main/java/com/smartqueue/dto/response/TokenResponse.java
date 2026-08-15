package com.smartqueue.dto.response;

import com.smartqueue.enums.TokenStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenResponse {
    private Long id;
    private String tokenNumber;
    private TokenStatus status;
    private Integer position;
    private Long userId;
    private String userName;
    private Long queueId;
    private String queueName;
    private LocalDateTime joinedAt;
    private LocalDateTime calledAt;
    private LocalDateTime expiresAt;
    private Integer estimatedWaitMinutes;
}
