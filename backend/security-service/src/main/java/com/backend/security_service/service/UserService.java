package com.backend.security_service.service;
import com.backend.security_service.dto.LoginRequest;
import com.backend.security_service.dto.LoginResponse;
import com.backend.security_service.exception.AuthenticationException;
import com.backend.security_service.exception.InvalidPasswordException;
import com.backend.security_service.exception.UserNotFoundException;
import com.backend.security_service.model.ChangePasswordRequest;
import com.backend.security_service.model.UserDetailsResponse;
import com.backend.security_service.model.Users;
import com.backend.security_service.repository.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private JWTService jwtService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    /**
     * Check if username already exists.
     */
    public boolean emailExists(String email) {
        return userRepo.existsByEmail(email);
    }

    /**
     * Register a new user with encoded password.
     */
    public String registerUser(Users user) {
        user.setPassword(encoder.encode(user.getPassword()));
        userRepo.save(user);
        return "User registered successfully";
    }

    /**
     * Authenticate user credentials and return login response containing JWT token and user info.
     */
    public LoginResponse loginUser(LoginRequest loginRequest) {
        Users currentUser = userRepo.findByEmail(loginRequest.email());
        if (currentUser == null) {
            throw new AuthenticationException("User not found");
        }

        // Check password using BCryptPasswordEncoder
        if (!encoder.matches(loginRequest.password(), currentUser.getPassword())) {
            throw new AuthenticationException("Invalid credentials");
        }

        // If password matches, generate JWT token
        String token = jwtService.generateToken(currentUser);
        return new LoginResponse(currentUser.getFullName(), token);
    }

    /**
     * Change password for existing user after verifying current password.
     */
    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        Users user = userRepo.findByEmail(request.getEmail());
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }
        if (!encoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new InvalidPasswordException("Incorrect current password");
        }
        String encodedNewPassword = encoder.encode(request.getNewPassword());
        user.setPassword(encodedNewPassword);
        userRepo.updatePassword(user.getId(), encodedNewPassword);
    }

    public UserDetailsResponse validateToken(String token) {
        String jwt = token.substring(7); // Remove "Bearer "
        if (!jwtService.validateToken(jwt)) {
            throw new AuthenticationException("Invalid token");
        }

        String email = jwtService.extractEmail(jwt);
        String role = jwtService.extractRole(jwt);
        return new UserDetailsResponse(email, role);
    }

    public void deleteAccByEmployeeId(Long employeeId) {
        if(userRepo.existsByEmployeeId(employeeId)) {
            userRepo.deleteByEmployeeId(employeeId);
        }
    }

    public void deActivateAccByEmployeeId(Long employeeId) {
        if(userRepo.existsByEmployeeId(employeeId)) {
            Users user=userRepo.findByEmployeeId(employeeId);
            user.setIsActive(false);
            userRepo.save(user);
        }
    }
}
