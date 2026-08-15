package com.smartqueue.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatisticsResponse {
    private Long queueId;
    private String queueName;
    private Long totalTokensIssued;
    private Long totalCompleted;
    private Long totalExpired;
    private Long totalSkipped;
    private Long totalWaiting;
    private Double averageServiceTimeMinutes;
    private Double completionRate;
}
