package com.example.productservice;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
public class ProductControllerTests {

    @Autowired
    private ProductController productController;

    @Autowired
    private ProductRepository productRepository;

    @Test
    public void testControllerLoads() {
        assertNotNull(productController, "ProductController should be loaded");
    }

    @Test
    public void testRepositoryLoads() {
        assertNotNull(productRepository, "ProductRepository should be loaded");
    }

    @Test
    public void testHealthEndpoint() {
        String result = productController.health();
        assertEquals("Product Service is running!", result);
    }

    @Test
    public void testCreateAndRetrieveProduct() {
        // Create a product
        Product product = new Product("Test Product", "Test Description", 
                                    new BigDecimal("99.99"), 10);
        Product savedProduct = productController.createProduct(product);
        
        assertNotNull(savedProduct.getId(), "Saved product should have an ID");
        assertEquals("Test Product", savedProduct.getName());
        assertEquals("Test Description", savedProduct.getDescription());
        assertEquals(0, new BigDecimal("99.99").compareTo(savedProduct.getPrice()));
        assertEquals(Integer.valueOf(10), savedProduct.getStock());
        
        // Retrieve the product
        Product retrievedProduct = productController.getProductById(savedProduct.getId());
        assertNotNull(retrievedProduct);
        assertEquals(savedProduct.getId(), retrievedProduct.getId());
    }
}
