package com.smartqueue.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {
    private Long queueId;
    private String queueName;
    private Boolean isPaused;
    private Integer currentTokenNumber;
    private List<TokenResponse> waitingTokens;
    private List<TokenResponse> activeTokens;
    private Integer totalWaiting;
    private Integer totalCompletedToday;
}
