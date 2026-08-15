package com.smartqueue.dto.response;

import com.smartqueue.enums.QueueType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QueueResponse {
    private Long id;
    private String name;
    private QueueType queueType;
    private Integer currentTokenNumber;
    private Integer averageServiceTime;
    private Boolean isPaused;
    private Integer waitingCount;
    private LocalDateTime createdAt;
}
