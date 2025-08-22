package com.yuesaohub.platform.gateway.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "app.firebase.enabled", havingValue = "true", matchIfMissing = false)
public class FirebaseAuthService {

    public FirebaseToken verifyToken(String idToken) throws FirebaseAuthException {
        FirebaseAuth firebaseAuth = FirebaseAuth.getInstance();
        return firebaseAuth.verifyIdToken(idToken);
    }
}
