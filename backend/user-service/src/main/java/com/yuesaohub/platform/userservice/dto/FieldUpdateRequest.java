package com.yuesaohub.platform.userservice.dto;

/**
 * DTO for single field update requests
 */
public class FieldUpdateRequest {
    private Object value;

    public FieldUpdateRequest() {}

    public FieldUpdateRequest(Object value) {
        this.value = value;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }
}
