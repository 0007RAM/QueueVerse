package com.smartqueue.service;

import com.smartqueue.dto.request.UserRequest;
import com.smartqueue.dto.response.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse registerUser(UserRequest request);

    UserResponse updateUser(Long id, UserRequest request);

    void deleteUser(Long id);

    UserResponse getUser(Long id);

    List<UserResponse> listUsers();

    List<UserResponse> searchUsers(String keyword);
}
