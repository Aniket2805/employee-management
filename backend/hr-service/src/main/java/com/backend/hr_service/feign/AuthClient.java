package com.backend.hr_service.feign;
import com.backend.hr_service.dto.ResponseDTO;
import com.backend.hr_service.model.UserDetailsResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "security-service")
public interface AuthClient {

    @GetMapping("auth/validate")
    public UserDetailsResponse validateToken(@RequestParam String token);

    @DeleteMapping("auth/employee/{employeeId}")
    public ResponseEntity<String> deleteAccByEmployeeId(@PathVariable Long employeeId);

    @PutMapping("auth/employee/{employeeId}")
    public ResponseEntity<String> deActivateAccByEmployeeId(@PathVariable Long employeeId);

}

