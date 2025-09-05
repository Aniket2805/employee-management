package com.backend.it_service.controller;

import com.backend.it_service.dto.UploadResponseDTO;
import com.backend.it_service.model.DocumentMetadata;
import com.backend.it_service.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;

@RestController
@RequestMapping("/api/documents")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "IT Documents Tasks", description = "API for managing IT Documents")
@RequiredArgsConstructor
@CrossOrigin
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping(value = "/upload/{employeeId}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('EMPLOYEE')")
    @Operation(summary = "Upload ID proof or certificate for employee")
    public ResponseEntity<UploadResponseDTO> uploadDocument(
            @PathVariable Long employeeId,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            DocumentMetadata meta = documentService.storeDocument(employeeId, file);
            return ResponseEntity.ok(UploadResponseDTO.builder()
                    .message("Upload successful")
                    .fileName(meta.getOriginalFileName())
                    .fileType(meta.getFileType())
                    .fileSize(meta.getFileSize())
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    UploadResponseDTO.builder()
                            .message("Upload failed: " + e.getMessage())
                            .build()
            );
        }
    }

    @GetMapping("/employee/{employeeId}/document-metadata")
    @PreAuthorize("hasRole('HR') or hasRole('IT') or hasRole('EMPLOYEE')")
    @Operation(summary = "Get uploaded document metadata for a specific employee")
    public ResponseEntity<DocumentMetadata> getDocumentMetadata(@PathVariable Long employeeId) {
        DocumentMetadata meta = documentService.getDocumentByEmployee(employeeId);
        return ResponseEntity.ok(meta);
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasRole('HR') or hasRole('IT') or hasRole('EMPLOYEE')")
    @Operation(summary = "Get uploaded document for a specific employee")
    public ResponseEntity<InputStreamResource> getDocumentByEmployee(
            @PathVariable Long employeeId) {
        try {
            DocumentMetadata meta = documentService.getDocumentByEmployee(employeeId);
            System.out.println(meta.getOriginalFileName());
            File file = new File("uploads/" + meta.getStoredFileName());

            if (!file.exists()) {
                return ResponseEntity.notFound().build();
            }

            InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + meta.getOriginalFileName() + "\"")
                    .contentLength(meta.getFileSize())
                    .contentType(MediaType.parseMediaType(meta.getFileType()))
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
