package com.backend.securityService.controller;

import com.backend.securityService.dto.LoginRequest;
import com.backend.securityService.dto.LoginResponse;
import com.backend.securityService.dto.RegisterRequest;
import com.backend.securityService.dto.ResponseDTO;
import com.backend.securityService.model.ChangePasswordRequest;
import com.backend.securityService.model.UserDetailsResponse;
import com.backend.securityService.model.Users;
import com.backend.securityService.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin
@Tag(name = "Authentication Controller", description = "Handles user registration, login and password change.")
public class AuthController {

    @Autowired
    private UserService userService;

    @Operation(summary = "Register new user")
    @ApiResponses({
           @ApiResponse(responseCode = "200", description = "User registered successfully"),
            @ApiResponse(responseCode = "409", description = "Username already exists")
    })
    @PostMapping("/register")
    public ResponseEntity<ResponseDTO<String>> registerUser(@RequestBody RegisterRequest request) {
        if (userService.emailExists(request.email())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new ResponseDTO<>(false, "Username already exists"));
        }
        String message="";
        if(request.employeeId()==null){
            message = userService.registerUser(new Users(request.fullName(),request.email(), request.password(),request.role()));
        }
        else{
            message = userService.registerUser(new Users(request.fullName(),request.email(), request.password(),request.role(),request.employeeId()));
        }
        return ResponseEntity.ok(new ResponseDTO<>(true, message));
    }

    @Operation(summary = "User login")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login successful, JWT token returned"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    @PostMapping("/login")
    public ResponseEntity<ResponseDTO<LoginResponse>> loginUser(@RequestBody LoginRequest request) {
        LoginResponse loginResponse = userService.loginUser(request);
        return ResponseEntity.ok(new ResponseDTO<>(true, "Login successful", loginResponse));
    }

    @Operation(summary = "Change user password")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Password changed successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input or password"),
            @ApiResponse(responseCode = "401", description = "Unauthorized request")
    })
    @PutMapping("/password")
    public ResponseEntity<ResponseDTO<String>> changePassword(@RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok(new ResponseDTO<>(true, "Password changed successfully"));
    }

    @Operation(summary = "Validate the jwt token")
    @GetMapping("/validate")
    public ResponseEntity<UserDetailsResponse> validateToken(@RequestParam String token) {
        return ResponseEntity.ok(userService.validateToken(token));
    }

    @Operation(summary = "Delete Account By employeeId")
    @DeleteMapping("/employee/{employeeId}")
    public ResponseEntity<String> deleteAccByEmployeeId(@PathVariable Long employeeId){
        userService.deleteAccByEmployeeId(employeeId);
        return ResponseEntity.ok("Employee Account Deleted Successfully.");
    }

    @Operation(summary = "Deactivate Account By employeeId")
    @PutMapping("/employee/{employeeId}")
    public ResponseEntity<String> deActivateAccByEmployeeId(@PathVariable Long employeeId){
        userService.deActivateAccByEmployeeId(employeeId);
        return ResponseEntity.ok("Employee Account Deactivated Successfully.");
    }

}
