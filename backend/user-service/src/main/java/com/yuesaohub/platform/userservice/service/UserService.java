package com.yuesaohub.platform.userservice.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yuesaohub.platform.userservice.dto.CreateUserRequest;
import com.yuesaohub.platform.userservice.dto.UserDto;
import com.yuesaohub.platform.userservice.entity.User;
import com.yuesaohub.platform.userservice.entity.UserType;
import com.yuesaohub.platform.userservice.event.UserCreatedEvent;
import com.yuesaohub.platform.userservice.repository.UserRepository;
import com.yuzao.platform.shared.dto.ApiResponse;
import com.yuzao.platform.shared.exception.UserNotFoundException;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    public UserService(UserRepository userRepository, RabbitTemplate rabbitTemplate, ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.rabbitTemplate = rabbitTemplate;
        this.objectMapper = objectMapper;
    }

    public UserDto createUser(CreateUserRequest request) {
        // Validate request
        validateCreateUserRequest(request);

        // Create user
        User user = new User();
        user.setFirebaseUid(request.getFirebaseUid());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
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

    private void validateCreateUserRequest(CreateUserRequest request) {
        if (userRepository.existsByFirebaseUid(request.getFirebaseUid())) {
            throw new IllegalArgumentException("User with Firebase UID already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("User with email already exists");
        }
    }

    private void publishUserCreatedEvent(User user) {
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
        } catch (JsonProcessingException e) {
            // Log error but don't fail the transaction
            System.err.println("Failed to publish user created event: " + e.getMessage());
        }
    }

    private UserDto mapToDto(User user) {
        return new UserDto(
            user.getId(),
            user.getFirebaseUid(),
            user.getUserType(),
            user.getEmail(),
            user.getPhone(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}
