package com.yuesaohub.platform.shared.exception;

public class UserNotFoundException extends RuntimeException {
    
    public UserNotFoundException(Long userId) {
        super("User not found with id: " + userId);
    }
    
    public UserNotFoundException(String firebaseUid) {
        super("User not found with Firebase UID: " + firebaseUid);
    }
    
    public UserNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
