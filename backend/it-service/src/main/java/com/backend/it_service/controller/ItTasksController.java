package com.backend.it_service.controller;

import com.backend.it_service.dto.EmployeeAccDTO;
import com.backend.it_service.dto.ResponseDTO;
import com.backend.it_service.model.DocumentMetadata;
import com.backend.it_service.service.ItService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/itTask")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin
@Tag(name = "IT Onboarding Tasks", description = "API for managing IT tasks")
public class ItTasksController {

    @Autowired
    private ItService itService;

    @PostMapping("/doc/{id}")
    @PreAuthorize("hasRole('IT')")
    @Operation(summary = "Approve the document with given id")
    public ResponseEntity<DocumentMetadata> approveDocument(@PathVariable Long id){
        return ResponseEntity.ok(itService.approveDocument(id));
    }

    @PostMapping(value = "/createAcc/{id}")
    @PreAuthorize("hasRole('IT')")
    @Operation(summary = "Create the official account by given employee id")
    public ResponseEntity<ResponseDTO<String>> createOfficialAccount(@PathVariable Long id, @RequestBody EmployeeAccDTO employeeAccDTO){
        return ResponseEntity.ok(itService.createOfficialAccount(id, employeeAccDTO.getFullName(), employeeAccDTO.getEmail(), employeeAccDTO.getPassword()));
    }
}
