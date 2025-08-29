package com.backend.it_service.feign;
import com.backend.it_service.dto.ResponseDTO;
import com.backend.it_service.model.Roles;
import com.backend.it_service.model.UserDetailsResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "auth-service")
public interface AuthClient {

    record RegisterRequest(Long employeeId,String fullName,String email, String password, Roles role) {}

    @GetMapping("/auth/validate")
    UserDetailsResponse validateToken(@RequestParam String token);

    @PostMapping("/auth/register")
    ResponseDTO<String> registerUser(@RequestBody RegisterRequest registerRequest);

}

