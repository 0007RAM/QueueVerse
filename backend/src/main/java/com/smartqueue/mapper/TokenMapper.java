package com.smartqueue.mapper;

import com.smartqueue.dto.response.TokenResponse;
import com.smartqueue.entity.Token;
import org.springframework.stereotype.Component;

/**
 * Converts a Token entity into its response DTO.
 */
@Component
public class TokenMapper {

    public TokenResponse toResponse(Token token) {
        int estimatedWait = token.getPosition() != null
                ? token.getPosition() * token.getQueue().getAverageServiceTime()
                : 0;

        return TokenResponse.builder()
                .id(token.getId())
                .tokenNumber(token.getTokenNumber())
                .status(token.getStatus())
                .position(token.getPosition())
                .userId(token.getUser().getId())
                .userName(token.getUser().getName())
                .queueId(token.getQueue().getId())
                .queueName(token.getQueue().getName())
                .joinedAt(token.getJoinedAt())
                .calledAt(token.getCalledAt())
                .expiresAt(token.getExpiresAt())
                .estimatedWaitMinutes(estimatedWait)
                .build();
    }
}
