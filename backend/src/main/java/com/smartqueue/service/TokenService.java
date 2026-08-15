package com.smartqueue.service;

import com.smartqueue.dto.request.JoinQueueRequest;
import com.smartqueue.dto.response.TokenResponse;

public interface TokenService {

    TokenResponse joinQueue(Long queueId, JoinQueueRequest request);

    TokenResponse getToken(Long id);

    Integer trackPosition(Long id);

    TokenResponse confirmToken(Long id);

    TokenResponse completeToken(Long id);

    TokenResponse cancelToken(Long id);

    TokenResponse skipToken(Long id);
}
