package com.backend.hr_service.controller;
import com.backend.hr_service.dto.ResponseDTO;
import com.backend.hr_service.model.Employee;
import com.backend.hr_service.dto.EmployeeDTO;
import com.backend.hr_service.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin
@Tag(name = "Onboarding Tasks", description = "API for managing Employees tasks")
public class EmployeeController {

    @Autowired
    private EmployeeService service;

    @Operation(summary = "Get all employees")
    @GetMapping
    @PreAuthorize("hasRole('HR') or hasRole('IT')")
    public ResponseEntity<List<Employee>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }


    @Operation(summary = "Get employee by ID")
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('HR') or hasRole('IT') or hasRole('EMPLOYEE')")
    public ResponseEntity<Employee> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @Operation(summary = "Create a new employee")
    @PostMapping
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<Employee> create(@RequestBody EmployeeDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @Operation(summary = "Update an employee by ID")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<Employee> update(@PathVariable Long id, @RequestBody EmployeeDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @Operation(summary = "Get available mentors for employee")
    @GetMapping("/{id}/available-mentors")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<List<Map<String, Object>>> getAvailableMentors(@PathVariable Long id) {
        return ResponseEntity.ok(service.getAvailableMentorsForEmployee(id));
    }

    @Operation(summary = "Delete an employee by ID")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {

        return ResponseEntity.ok(service.delete(id));
    }

    @Operation(summary = "Update Employee Account by ID")
    @PostMapping("/account/{id}")
    @PreAuthorize("hasRole('HR') or hasRole('IT')")
    public ResponseEntity<String> updateAccDetail(@PathVariable Long id,@RequestParam String email,@RequestParam String password){
        return ResponseEntity.ok(service.updateAccDetail(id,email,password));
    }

    @PreAuthorize("hasRole('HR')")
    @Operation(summary = "Offboarding an Employee")
    @PostMapping("/offboard/{id}")
    public ResponseEntity<ResponseDTO<String>> offBoardEmployee(@PathVariable Long id){
        return ResponseEntity.ok(new ResponseDTO<>(true,service.offBoardEmployee(id)));
    }
}
