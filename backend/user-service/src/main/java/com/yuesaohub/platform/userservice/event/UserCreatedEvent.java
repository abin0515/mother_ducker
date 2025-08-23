package com.yuesaohub.platform.userservice.event;

import com.yuesaohub.platform.userservice.entity.UserType;
import com.yuesaohub.platform.shared.event.BaseEvent;

public class UserCreatedEvent extends BaseEvent {
    private Long userId;
    private String userEmail;
    private UserType userType;

    public UserCreatedEvent(Long userId, String userEmail, UserType userType) {
        super("USER_CREATED", "user-service");
        this.userId = userId;
        this.userEmail = userEmail;
        this.userType = userType;
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }
}
