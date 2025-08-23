package com.yuesaohub.platform.gateway.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.auth.FirebaseAuthException;
import com.yuesaohub.platform.gateway.dto.ErrorResponse;
import com.yuesaohub.platform.gateway.service.FirebaseAuthService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@ConditionalOnProperty(name = "app.firebase.enabled", havingValue = "true", matchIfMissing = false)
public class FirebaseAuthFilter implements GlobalFilter, Ordered {

    private final FirebaseAuthService firebaseAuthService;
    private final ObjectMapper objectMapper;

    public FirebaseAuthFilter(FirebaseAuthService firebaseAuthService, ObjectMapper objectMapper) {
        this.firebaseAuthService = firebaseAuthService;
        this.objectMapper = objectMapper;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        // Skip auth for OPTIONS requests (CORS preflight)
        if (request.getMethod().name().equals("OPTIONS")) {
            return chain.filter(exchange);
        }

        // Skip auth for public endpoints
        if (isPublicEndpoint(request.getPath().value())) {
            return chain.filter(exchange);
        }

        String token = extractToken(request);
        if (token == null) {
            return onError(exchange, "No token provided", HttpStatus.UNAUTHORIZED);
        }

        try {
            var decodedToken = firebaseAuthService.verifyToken(token);

            // Add user info to headers
            ServerHttpRequest modifiedRequest = request.mutate()
                .header("X-User-ID", decodedToken.getUid())
                .header("X-User-Email", decodedToken.getEmail())
                .header("X-User-Name", decodedToken.getName())
                .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());

        } catch (FirebaseAuthException e) {
            return onError(exchange, "Invalid token", HttpStatus.UNAUTHORIZED);
        }
    }

    @Override
    public int getOrder() {
        return -100; // Execute before other filters
    }

    private boolean isPublicEndpoint(String path) {
        return path.startsWith("/api/public/") || 
               path.startsWith("/actuator/") ||
               path.equals("/health");
    }

    private String extractToken(ServerHttpRequest request) {
        String authHeader = request.getHeaders().getFirst("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);

        ErrorResponse errorResponse = ErrorResponse.error(message);

        try {
            return response.writeWith(
                Mono.just(response.bufferFactory().wrap(
                    objectMapper.writeValueAsBytes(errorResponse)
                ))
            );
        } catch (Exception e) {
            return Mono.error(e);
        }
    }
}
