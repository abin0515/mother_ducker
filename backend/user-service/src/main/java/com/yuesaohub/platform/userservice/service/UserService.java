package com.yuesaohub.platform.userservice.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yuesaohub.platform.userservice.dto.CreateUserRequest;
import com.yuesaohub.platform.userservice.dto.UserDto;
import com.yuesaohub.platform.userservice.entity.User;
import com.yuesaohub.platform.userservice.entity.UserType;
import com.yuesaohub.platform.userservice.event.UserCreatedEvent;
import com.yuesaohub.platform.userservice.repository.UserRepository;
import com.yuesaohub.platform.shared.dto.ApiResponse;
import com.yuesaohub.platform.shared.exception.UserNotFoundException;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

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
