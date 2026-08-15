package com.smartqueue.service;

import com.smartqueue.dto.request.QueueRequest;
import com.smartqueue.dto.response.QueueResponse;
import com.smartqueue.dto.response.StatisticsResponse;

import java.util.List;

public interface QueueService {

    QueueResponse createQueue(QueueRequest request);

    QueueResponse updateQueue(Long id, QueueRequest request);

    void deleteQueue(Long id);

    QueueResponse getQueue(Long id);

    List<QueueResponse> listQueues();

    QueueResponse pauseQueue(Long id);

    QueueResponse resumeQueue(Long id);

    StatisticsResponse getStatistics(Long id);
}
