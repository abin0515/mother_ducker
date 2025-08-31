package com.yuesaohub.platform.userservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yuesaohub.platform.userservice.dto.CreateUserRequest;
import com.yuesaohub.platform.userservice.dto.UpdateProfileRequest;
import com.yuesaohub.platform.userservice.dto.UserDto;
import com.yuesaohub.platform.userservice.entity.User;
import com.yuesaohub.platform.userservice.entity.UserType;
import com.yuesaohub.platform.userservice.event.UserCreatedEvent;
import com.yuesaohub.platform.userservice.repository.UserRepository;
import com.yuesaohub.platform.shared.exception.UserNotFoundException;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private RabbitTemplate rabbitTemplate;

    public UserService(UserRepository userRepository, ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    @Autowired(required = false)
    public void setRabbitTemplate(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public UserDto createUser(CreateUserRequest request) {
        // Validate request
        validateCreateUserRequest(request);

        // Create user
        User user = new User();
        user.setFirebaseUid(request.getFirebaseUid());
        user.setEmail(request.getEmail());
        user.setPrimaryPhone(request.getPhone());
        user.setUserType(request.getUserType());

        User savedUser = userRepository.save(user);

        // Publish event
        publishUserCreatedEvent(savedUser);

        return mapToDto(savedUser);
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));
        return mapToDto(user);
    }

    public UserDto getUserByFirebaseUid(String firebaseUid) {
        User user = userRepository.findByFirebaseUid(firebaseUid)
            .orElseThrow(() -> new UserNotFoundException(firebaseUid));
        return mapToDto(user);
    }

    public List<UserDto> getUsersByType(UserType userType) {
        List<User> users = userRepository.findByUserType(userType);
        return users.stream().map(this::mapToDto).toList();
    }

    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(this::mapToDto).toList();
    }

    public UserDto updateProfile(String firebaseUid, UpdateProfileRequest request) {
        User user = userRepository.findByFirebaseUid(firebaseUid)
            .orElseThrow(() -> new UserNotFoundException("User not found with Firebase UID: " + firebaseUid));

        updateUserFromRequest(user, request);
        calculateProfileCompletion(user);
        
        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    public UserDto updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

        updateUserFromRequest(user, request);
        calculateProfileCompletion(user);
        
        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    public UserDto updateProfileField(String firebaseUid, String fieldName, Object value) {
        User user = userRepository.findByFirebaseUid(firebaseUid)
            .orElseThrow(() -> new UserNotFoundException("User not found with Firebase UID: " + firebaseUid));

        updateSingleField(user, fieldName, value);
        calculateProfileCompletion(user);
        
        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    public Integer getProfileCompletion(String firebaseUid) {
        User user = userRepository.findByFirebaseUid(firebaseUid)
            .orElseThrow(() -> new UserNotFoundException("User not found with Firebase UID: " + firebaseUid));
        
        return calculateProfileCompletion(user);
    }

    private void validateCreateUserRequest(CreateUserRequest request) {
        if (userRepository.existsByFirebaseUid(request.getFirebaseUid())) {
            throw new IllegalArgumentException("User with Firebase UID already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("User with email already exists");
        }
    }

    private void publishUserCreatedEvent(User user) {
        if (rabbitTemplate == null) {
            // RabbitMQ is not available, skip event publishing
            System.out.println("RabbitMQ not available, skipping event publishing for user: " + user.getId());
            return;
        }

        try {
            UserCreatedEvent event = new UserCreatedEvent(
                user.getId(),
                user.getEmail(),
                user.getUserType()
            );

            rabbitTemplate.convertAndSend(
                "user.exchange",
                "user.created",
                objectMapper.writeValueAsString(event)
            );
        } catch (Exception e) {
            // Log error but don't fail the transaction
            System.err.println("Failed to publish user created event: " + e.getMessage());
        }
    }

    private void updateUserFromRequest(User user, UpdateProfileRequest request) {
        // Basic Information
        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getDisplayName() != null) user.setDisplayName(request.getDisplayName());
        if (request.getAge() != null) user.setAge(request.getAge());
        if (request.getProfilePhotoUrl() != null) user.setProfilePhotoUrl(request.getProfilePhotoUrl());

        // Contact Information
        if (request.getPrimaryPhone() != null) user.setPrimaryPhone(request.getPrimaryPhone());
        if (request.getWechatId() != null) user.setWechatId(request.getWechatId());
        if (request.getWechatQrCodeUrl() != null) user.setWechatQrCodeUrl(request.getWechatQrCodeUrl());
        if (request.getXiaohongshuHandle() != null) user.setXiaohongshuHandle(request.getXiaohongshuHandle());

        // Location & Service
        if (request.getCity() != null) user.setCity(request.getCity());
        if (request.getProvince() != null) user.setProvince(request.getProvince());
        if (request.getCountry() != null) user.setCountry(request.getCountry());
        if (request.getServiceAreas() != null) user.setServiceAreas(request.getServiceAreas());
        if (request.getCurrentLocation() != null) user.setCurrentLocation(request.getCurrentLocation());
        if (request.getWillingToRelocate() != null) user.setWillingToRelocate(request.getWillingToRelocate());

        // Professional Information
        if (request.getYearsOfExperience() != null) user.setYearsOfExperience(request.getYearsOfExperience());
        if (request.getLanguages() != null) user.setLanguages(request.getLanguages());
        if (request.getSpecializations() != null) user.setSpecializations(request.getSpecializations());
        if (request.getCertifications() != null) user.setCertifications(request.getCertifications());
        if (request.getServicesOffered() != null) user.setServicesOffered(request.getServicesOffered());
        if (request.getHourlyRate() != null) user.setHourlyRate(request.getHourlyRate());

        // Rich Content
        if (request.getAboutMe() != null) user.setAboutMe(request.getAboutMe());
        if (request.getProfessionalExperience() != null) user.setProfessionalExperience(request.getProfessionalExperience());
        if (request.getEducationBackground() != null) user.setEducationBackground(request.getEducationBackground());
        if (request.getSpecialSkills() != null) user.setSpecialSkills(request.getSpecialSkills());

        // Media
        if (request.getGalleryPhotos() != null) user.setGalleryPhotos(request.getGalleryPhotos());
        if (request.getCertificatesPhotos() != null) user.setCertificatesPhotos(request.getCertificatesPhotos());
    }

    private void updateSingleField(User user, String fieldName, Object value) {
        switch (fieldName.toLowerCase()) {
            case "fullname" -> user.setFullName((String) value);
            case "displayname" -> user.setDisplayName((String) value);
            case "age" -> user.setAge((Integer) value);
            case "profilephotourl" -> user.setProfilePhotoUrl((String) value);
            case "primaryphone" -> user.setPrimaryPhone((String) value);
            case "wechatid" -> user.setWechatId((String) value);
            case "wechatqrcodeurl" -> user.setWechatQrCodeUrl((String) value);
            case "xiaohongshuhandle" -> user.setXiaohongshuHandle((String) value);
            case "city" -> user.setCity((String) value);
            case "province" -> user.setProvince((String) value);
            case "country" -> user.setCountry((String) value);
            case "serviceareas" -> user.setServiceAreas((String) value);
            case "currentlocation" -> user.setCurrentLocation((String) value);
            case "willingtorelocate" -> user.setWillingToRelocate((Boolean) value);
            case "yearsofexperience" -> user.setYearsOfExperience((Integer) value);
            case "languages" -> user.setLanguages((String) value);
            case "specializations" -> user.setSpecializations((String) value);
            case "certifications" -> user.setCertifications((String) value);
            case "servicesoffered" -> user.setServicesOffered((String) value);
            case "aboutme" -> user.setAboutMe((String) value);
            case "professionalexperience" -> user.setProfessionalExperience((String) value);
            case "educationbackground" -> user.setEducationBackground((String) value);
            case "specialskills" -> user.setSpecialSkills((String) value);
            case "galleryphotos" -> user.setGalleryPhotos((String) value);
            case "certificatesphotos" -> user.setCertificatesPhotos((String) value);
            default -> throw new IllegalArgumentException("Unknown field: " + fieldName);
        }
    }

    private Integer calculateProfileCompletion(User user) {
        int totalFields = 0;
        int completedFields = 0;

        // Core required fields (always count)
        totalFields += 3;
        if (user.getEmail() != null && !user.getEmail().trim().isEmpty()) completedFields++;
        if (user.getUserType() != null) completedFields++;
        if (user.getFirebaseUid() != null && !user.getFirebaseUid().trim().isEmpty()) completedFields++;

        // Basic Information (important for all users)
        totalFields += 4;
        if (user.getFullName() != null && !user.getFullName().trim().isEmpty()) completedFields++;
        if (user.getDisplayName() != null && !user.getDisplayName().trim().isEmpty()) completedFields++;
        if (user.getAge() != null) completedFields++;
        if (user.getProfilePhotoUrl() != null && !user.getProfilePhotoUrl().trim().isEmpty()) completedFields++;

        // Contact Information
        totalFields += 2;
        if (user.getPrimaryPhone() != null && !user.getPrimaryPhone().trim().isEmpty()) completedFields++;
        if (user.getWechatId() != null && !user.getWechatId().trim().isEmpty()) completedFields++;

        // Location
        totalFields += 2;
        if (user.getCity() != null && !user.getCity().trim().isEmpty()) completedFields++;
        if (user.getProvince() != null && !user.getProvince().trim().isEmpty()) completedFields++;

        // For CAREGIVER users, add professional fields
        if (user.getUserType() == UserType.CAREGIVER) {
            totalFields += 6;
            if (user.getYearsOfExperience() != null) completedFields++;
            if (user.getLanguages() != null && !user.getLanguages().trim().isEmpty()) completedFields++;
            if (user.getSpecializations() != null && !user.getSpecializations().trim().isEmpty()) completedFields++;
            if (user.getAboutMe() != null && !user.getAboutMe().trim().isEmpty()) completedFields++;
            if (user.getServicesOffered() != null && !user.getServicesOffered().trim().isEmpty()) completedFields++;
            if (user.getHourlyRate() != null) completedFields++;
        }

        int percentage = Math.round((float) completedFields / totalFields * 100);
        user.setProfileCompletionPercentage(percentage);
        return percentage;
    }

    private UserDto mapToDto(User user) {
        UserDto dto = new UserDto();
        
        // Core Identity
        dto.setId(user.getId());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        dto.setFirebaseUid(user.getFirebaseUid());
        dto.setEmail(user.getEmail());
        dto.setUserType(user.getUserType());

        // Basic Information
        dto.setFullName(user.getFullName());
        dto.setDisplayName(user.getDisplayName());
        dto.setAge(user.getAge());
        dto.setProfilePhotoUrl(user.getProfilePhotoUrl());

        // Contact Information
        dto.setPrimaryPhone(user.getPrimaryPhone());
        dto.setWechatId(user.getWechatId());
        dto.setWechatQrCodeUrl(user.getWechatQrCodeUrl());
        dto.setXiaohongshuHandle(user.getXiaohongshuHandle());

        // Location & Service
        dto.setCity(user.getCity());
        dto.setProvince(user.getProvince());
        dto.setCountry(user.getCountry());
        dto.setServiceAreas(user.getServiceAreas());
        dto.setCurrentLocation(user.getCurrentLocation());
        dto.setWillingToRelocate(user.getWillingToRelocate());

        // Professional Information
        dto.setYearsOfExperience(user.getYearsOfExperience());
        dto.setLanguages(user.getLanguages());
        dto.setSpecializations(user.getSpecializations());
        dto.setCertifications(user.getCertifications());
        dto.setServicesOffered(user.getServicesOffered());
        dto.setHourlyRate(user.getHourlyRate());

        // Rich Content
        dto.setAboutMe(user.getAboutMe());
        dto.setProfessionalExperience(user.getProfessionalExperience());
        dto.setEducationBackground(user.getEducationBackground());
        dto.setSpecialSkills(user.getSpecialSkills());

        // Media
        dto.setGalleryPhotos(user.getGalleryPhotos());
        dto.setCertificatesPhotos(user.getCertificatesPhotos());

        // Social Proof
        dto.setTotalRating(user.getTotalRating());
        dto.setTotalReviews(user.getTotalReviews());

        // Platform Management
        dto.setProfileCompletionPercentage(user.getProfileCompletionPercentage());
        dto.setIsFeatured(user.getIsFeatured());
        dto.setIsActive(user.getIsActive());
        dto.setLastActiveAt(user.getLastActiveAt());
        dto.setProfileViews(user.getProfileViews());
        dto.setVerificationStatus(user.getVerificationStatus());

        return dto;
    }
}
