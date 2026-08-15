package com.smartqueue.service;

import com.smartqueue.dto.response.DashboardResponse;
import com.smartqueue.dto.response.StatisticsResponse;
import com.smartqueue.dto.response.TokenResponse;

import java.util.List;

public interface AdminService {

    TokenResponse callNext(Long queueId);

    List<TokenResponse> viewWaitingTokens(Long queueId);

    List<TokenResponse> viewActiveTokens(Long queueId);

    DashboardResponse getDashboard(Long queueId);

    List<StatisticsResponse> getStatistics();
}
