package com.backend.it_service.repository;
import com.backend.it_service.model.DocumentMetadata;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentMetadataRepository extends JpaRepository<DocumentMetadata, Long> {
    DocumentMetadata findByEmployeeId(Long employeeId);
}