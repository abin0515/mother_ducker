package com.example.userservice;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
public class UserControllerTests {

    @Autowired
    private UserController userController;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testControllerLoads() {
        assertNotNull(userController, "UserController should be loaded");
    }

    @Test
    public void testRepositoryLoads() {
        assertNotNull(userRepository, "UserRepository should be loaded");
    }

    @Test
    public void testHealthEndpoint() {
        String result = userController.health();
        assertEquals("User Service is running!", result);
    }

    @Test
    public void testCreateAndRetrieveUser() {
        // Create a user
        User user = new User("Test User", "test@example.com");
        User savedUser = userController.createUser(user);
        
        assertNotNull(savedUser.getId(), "Saved user should have an ID");
        assertEquals("Test User", savedUser.getName());
        assertEquals("test@example.com", savedUser.getEmail());
        
        // Retrieve the user
        User retrievedUser = userController.getUserById(savedUser.getId());
        assertNotNull(retrievedUser);
        assertEquals(savedUser.getId(), retrievedUser.getId());
    }
}
