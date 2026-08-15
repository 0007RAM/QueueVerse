package com.smartqueue.dto.request;

import com.smartqueue.enums.QueueType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QueueRequest {

    @NotBlank(message = "Queue name is required")
    private String name;

    @NotNull(message = "Queue type is required")
    private QueueType queueType;

    @Min(value = 1, message = "Average service time must be at least 1 minute")
    private Integer averageServiceTime;
}
