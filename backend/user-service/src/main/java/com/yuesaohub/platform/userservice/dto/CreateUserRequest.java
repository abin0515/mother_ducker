package com.yuesaohub.platform.userservice.dto;

import com.yuesaohub.platform.userservice.entity.UserType;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class CreateUserRequest {
    @NotBlank(message = "Firebase UID is required")
    private String firebaseUid;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @Pattern(regexp = "^\\+[1-9]\\d{1,14}$", message = "Invalid phone number format")
    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotNull(message = "User type is required")
    private UserType userType;

    // Constructors
    public CreateUserRequest() {}

    public CreateUserRequest(String firebaseUid, String email, String phone, UserType userType) {
        this.firebaseUid = firebaseUid;
        this.email = email;
        this.phone = phone;
        this.userType = userType;
    }

    // Getters and Setters
    public String getFirebaseUid() {
        return firebaseUid;
    }

    public void setFirebaseUid(String firebaseUid) {
        this.firebaseUid = firebaseUid;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }
}
