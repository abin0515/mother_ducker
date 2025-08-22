package com.yuesaohub.platform.userservice.controller;

import com.yuesaohub.platform.userservice.dto.CreateUserRequest;
import com.yuesaohub.platform.userservice.dto.UserDto;
import com.yuesaohub.platform.userservice.entity.UserType;
import com.yuesaohub.platform.userservice.service.UserService;
import com.yuzao.platform.shared.dto.ApiResponse;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@Validated
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserDto>> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserDto createdUser = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(createdUser, "User created successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable Long id) {
        UserDto user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @GetMapping("/firebase/{firebaseUid}")
    public ResponseEntity<ApiResponse<UserDto>> getUserByFirebaseUid(@PathVariable String firebaseUid) {
        UserDto user = userService.getUserByFirebaseUid(firebaseUid);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @GetMapping("/type/{userType}")
    public ResponseEntity<ApiResponse<List<UserDto>>> getUsersByType(@PathVariable UserType userType) {
        List<UserDto> users = userService.getUsersByType(userType);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }
}
