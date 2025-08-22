package com.yuesaohub.platform.gateway.dto;

import java.time.LocalDateTime;

public class ErrorResponse {
    private boolean success;
    private String message;
    private LocalDateTime timestamp;

    public ErrorResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public ErrorResponse(boolean success, String message, LocalDateTime timestamp) {
        this.success = success;
        this.message = message;
        this.timestamp = timestamp;
    }

    public static ErrorResponse error(String message) {
        return new ErrorResponse(false, message, LocalDateTime.now());
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
