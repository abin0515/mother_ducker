package com.yuesaohub.platform.userservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.yuesaohub.platform.userservice.entity.User;
import com.yuesaohub.platform.userservice.entity.UserType;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByFirebaseUid(String firebaseUid);
    
    Optional<User> findByEmail(String email);
    
    List<User> findByUserType(UserType userType);
    
    @Query("SELECT u FROM User u WHERE u.userType = :userType AND u.email LIKE %:email%")
    List<User> findByUserTypeAndEmailContaining(@Param("userType") UserType userType, 
                                               @Param("email") String email);
    
    boolean existsByFirebaseUid(String firebaseUid);
    
    boolean existsByEmail(String email);
}
