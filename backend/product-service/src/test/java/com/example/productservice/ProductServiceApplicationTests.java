package com.example.productservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class ProductServiceApplicationTests {

    @Test
    void contextLoads() {
        // Test that the Spring context loads successfully
    }

    @Test
    void applicationStarts() {
        // Test that the application starts without errors
        // This test will pass if the Spring Boot context loads
    }
}
