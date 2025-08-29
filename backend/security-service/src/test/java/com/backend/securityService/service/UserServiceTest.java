package com.backend.securityService.service;
import com.backend.securityService.dto.LoginRequest;
import com.backend.securityService.dto.LoginResponse;
import com.backend.securityService.exception.AuthenticationException;
import com.backend.securityService.exception.InvalidPasswordException;
import com.backend.securityService.exception.UserNotFoundException;
import com.backend.securityService.model.ChangePasswordRequest;
import com.backend.securityService.model.Roles;
import com.backend.securityService.model.Users;
import com.backend.securityService.repository.UserRepo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.mockito.*;
import org.springframework.security.authentication.*;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepo userRepo;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JWTService jwtService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @Test
    void shouldRegisterUserSuccessfully() {
        // Given
        Users user = new Users("Test User","wronguser@gmail.com", "password123", Roles.EMPLOYEE);

        // When
        when(userRepo.save(any(Users.class))).thenReturn(user);

        // Then
        String response = userService.registerUser(user);
        assertThat(response).isEqualTo("User registered successfully");
    }

//    @Test
//    void shouldLoginSuccessfully() {
//        // Given
//        LoginRequest request = new LoginRequest("wronguser@gmail.com", "password123");
//        Users user = new Users("Test User","wronguser@gmail.com", new BCryptPasswordEncoder().encode("password123"),Roles.EMPLOYEE);
//
//        // Create a mock Authentication object
//        Authentication mockAuth = mock(Authentication.class);
//        when(mockAuth.isAuthenticated()).thenReturn(true);
//
//        // Mock dependencies
//        when(userRepo.findByEmail("wronguser@gmail.com")).thenReturn(user);
//        when(jwtService.generateToken(user)).thenReturn("mock-token");
//
//        // When
//        LoginResponse response = userService.loginUser(request);
//
//        // Then
//        assertThat(response.fullName()).isEqualTo("Test User");
//        assertThat(response.token()).isEqualTo("mock-token");
//    }


    @Test
    void shouldThrowAuthenticationExceptionWhenLoginFails() {
        // Given
        LoginRequest request = new LoginRequest("wronguser@gmail.com", "wrongpass");

        // Then
        assertThatThrownBy(() -> userService.loginUser(request))
                .isInstanceOf(AuthenticationException.class)
                .hasMessage("User not found");
    }

    @Test
    void shouldChangePasswordSuccessfully() {
        // Given
        String encodedCurrentPassword = encoder.encode("oldPass");
        Users user = new Users("User One","user1", encodedCurrentPassword,Roles.EMPLOYEE);
        user.setId(1L);

        ChangePasswordRequest request = new ChangePasswordRequest("wronguser@gmail.com", "oldPass", "newPass");

        when(userRepo.findByEmail("wronguser@gmail.com")).thenReturn(user);

        // When
        userService.changePassword(request);

        // Then
        verify(userRepo, times(1)).updatePassword(eq(1L), any(String.class));
    }

    @Test
    void shouldThrowUserNotFoundExceptionWhenChangingPassword() {
        // Given
        ChangePasswordRequest request = new ChangePasswordRequest("wronguser@gmail.com", "oldPass", "newPass");

        when(userRepo.findByEmail("wronguser@gmail.com")).thenReturn(null);

        // Then
        assertThatThrownBy(() -> userService.changePassword(request))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessage("User not found");
    }

    @Test
    void shouldThrowInvalidPasswordExceptionWhenCurrentPasswordIsWrong() {
        // Given
        Users user = new Users("wronguser@gmail.com", encoder.encode("actualPass"), "User One",Roles.EMPLOYEE);
        ChangePasswordRequest request = new ChangePasswordRequest("wronguser@gmail.com", "wrongPass", "newPass");

        when(userRepo.findByEmail("wronguser@gmail.com")).thenReturn(user);

        // Then
        assertThatThrownBy(() -> userService.changePassword(request))
                .isInstanceOf(InvalidPasswordException.class)
                .hasMessage("Incorrect current password");
    }
}