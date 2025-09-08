package com.yuesaohub.platform.userservice.controller;

import com.yuesaohub.platform.userservice.dto.CreateUserRequest;
import com.yuesaohub.platform.userservice.dto.CaregiverSearchItemDto;
import com.yuesaohub.platform.userservice.dto.SearchResultsDto;
import com.yuesaohub.platform.userservice.dto.FieldUpdateRequest;
import com.yuesaohub.platform.userservice.dto.UpdateProfileRequest;
import com.yuesaohub.platform.userservice.dto.UserDto;
import com.yuesaohub.platform.userservice.entity.UserType;
import com.yuesaohub.platform.userservice.service.UserService;
import com.yuesaohub.platform.shared.dto.ApiResponse;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/users")
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

    // Profile completion endpoints
    
    @PutMapping("/firebase/{firebaseUid}/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateProfileByFirebaseUid(
            @PathVariable String firebaseUid, 
            @Valid @RequestBody UpdateProfileRequest request) {
        UserDto updatedUser = userService.updateProfile(firebaseUid, request);
        return ResponseEntity.ok(ApiResponse.success(updatedUser, "Profile updated successfully"));
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateProfileById(
            @PathVariable Long id, 
            @Valid @RequestBody UpdateProfileRequest request) {
        UserDto updatedUser = userService.updateProfile(id, request);
        return ResponseEntity.ok(ApiResponse.success(updatedUser, "Profile updated successfully"));
    }

    @PatchMapping("/firebase/{firebaseUid}/profile/{fieldName}")
    public ResponseEntity<ApiResponse<UserDto>> updateProfileField(
            @PathVariable String firebaseUid,
            @PathVariable String fieldName,
            @RequestBody FieldUpdateRequest request) {
        UserDto updatedUser = userService.updateProfileField(firebaseUid, fieldName, request.getValue());
        return ResponseEntity.ok(ApiResponse.success(updatedUser, "Profile field updated successfully"));
    }

    @GetMapping("/firebase/{firebaseUid}/profile/completion")
    public ResponseEntity<ApiResponse<Integer>> getProfileCompletion(@PathVariable String firebaseUid) {
        Integer completion = userService.getProfileCompletion(firebaseUid);
        return ResponseEntity.ok(ApiResponse.success(completion, "Profile completion retrieved"));
    }

    // Specialized endpoints for caregivers
    
    @GetMapping("/caregivers")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllCaregivers() {
        List<UserDto> caregivers = userService.getUsersByType(UserType.CAREGIVER);
        return ResponseEntity.ok(ApiResponse.success(caregivers));
    }

    @GetMapping("/caregivers/featured")
    public ResponseEntity<ApiResponse<List<UserDto>>> getFeaturedCaregivers() {
        List<UserDto> caregivers = userService.getUsersByType(UserType.CAREGIVER)
            .stream()
            .filter(user -> user.getIsFeatured() != null && user.getIsFeatured())
            .filter(user -> user.getIsActive() != null && user.getIsActive())
            .toList();
        return ResponseEntity.ok(ApiResponse.success(caregivers));
    }

    @GetMapping("/caregivers/verified")
    public ResponseEntity<ApiResponse<List<UserDto>>> getVerifiedCaregivers() {
        List<UserDto> caregivers = userService.getUsersByType(UserType.CAREGIVER)
            .stream()
            .filter(user -> user.getVerificationStatus() != null && 
                           user.getVerificationStatus().name().equals("VERIFIED"))
            .filter(user -> user.getIsActive() != null && user.getIsActive())
            .toList();
        return ResponseEntity.ok(ApiResponse.success(caregivers));
    }

    // Search endpoint with age filters
    @GetMapping("/search/caregivers")
    public ResponseEntity<ApiResponse<SearchResultsDto<CaregiverSearchItemDto>>> searchCaregivers(
            @RequestParam(required = false) String province,
            @RequestParam(required = false) String languages,
            @RequestParam(required = false) String services,
            @RequestParam(required = false) String specializations,
            @RequestParam(required = false) Integer minExperience,
            @RequestParam(required = false) Boolean available,
            @RequestParam(required = false) Integer ageMin,
            @RequestParam(required = false) Integer ageMax,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "relevance") String sort
    ) {
        SearchResultsDto<CaregiverSearchItemDto> results = userService.searchCaregivers(
            province, languages, services, specializations, minExperience, available, ageMin, ageMax, page, size, sort
        );
        return ResponseEntity.ok(ApiResponse.success(results));
    }
}
