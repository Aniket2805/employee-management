package com.backend.it_service.service;
import com.backend.it_service.config.AuthForwardingFilter;
import com.backend.it_service.feign.HrClient;
import com.backend.it_service.model.AuditLog;
import com.backend.it_service.model.DocumentMetadata;
import com.backend.it_service.repository.DocumentMetadataRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentService {
    @Autowired
    private DocumentMetadataRepository repository;

    @Autowired
    private HrClient hrClient;

    public DocumentMetadata getDocumentByEmployee(Long employeeId) {
        return repository.findByEmployeeId(employeeId);
    }

    public DocumentMetadata storeDocument(Long employeeId, MultipartFile file) throws IOException {
        DocumentMetadata existing = repository.findByEmployeeId(employeeId);

        if (existing != null) {
            throw new IllegalStateException("A document for this employee already exists.");
        }

        String mimeType = file.getContentType();
        long maxSize = 5 * 1024 * 1024; // 5 MB

        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        assert mimeType != null;
        if (!mimeType.matches("application/pdf|image/jpeg|image/png")) {
            throw new IllegalArgumentException("Invalid file type");
        }

        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("File exceeds size limit");
        }

        // 2. Save file to disk
        String uploadDir = "uploads/";
        Files.createDirectories(Paths.get(uploadDir));
        String storedFileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir + storedFileName);
        Files.write(filePath, file.getBytes());

        // 3. Save metadata
        DocumentMetadata metadata = DocumentMetadata.builder()
                .employeeId(employeeId)
                .originalFileName(file.getOriginalFilename())
                .storedFileName(storedFileName)
                .fileType(mimeType)
                .fileSize(file.getSize())
                .uploadedAt(LocalDateTime.now())
                .build();

        DocumentMetadata saved = repository.save(metadata);

        // 4. Audit log
        String currentUser = AuthForwardingFilter.getCurrentUser();
        hrClient.createLog(
                new AuditLog("DocumentMetadata",
                        String.valueOf(saved.getId()),
                        "CREATE",
                        currentUser,
                        saved));

        return saved;
    }
}