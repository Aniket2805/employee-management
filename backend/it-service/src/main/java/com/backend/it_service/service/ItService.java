package com.backend.it_service.service;

import com.backend.it_service.config.AuthForwardingFilter;
import com.backend.it_service.dto.ResponseDTO;
import com.backend.it_service.feign.AuthClient;
import com.backend.it_service.feign.HrClient;
import com.backend.it_service.model.AuditLog;
import com.backend.it_service.model.DocumentMetadata;
import com.backend.it_service.model.Roles;
import com.backend.it_service.repository.DocumentMetadataRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

import static com.backend.it_service.feign.AuthClient.*;

@Service
@RequiredArgsConstructor
@Transactional
public class ItService {

    @Autowired
    private DocumentMetadataRepository documentMetadataRepository;

    @Autowired
    private AuthClient authClient;

    @Autowired
    private HrClient hrClient;

    public DocumentMetadata approveDocument(Long id) {
        DocumentMetadata documentMetadata = documentMetadataRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));

        documentMetadata.setApproved(true);
        DocumentMetadata updated = documentMetadataRepository.save(documentMetadata);

        // ✅ Audit log
        String actor = AuthForwardingFilter.getCurrentUser();
        hrClient.createLog(
                new AuditLog("DocumentMetadata",
                        String.valueOf(updated.getId()),
                        "UPDATE",  // marking approval as an update
                        actor,
                        updated)
        );

        return updated;
    }

    public ResponseDTO<String> createOfficialAccount(Long id, String fullName, String email, String password) {
        hrClient.updateAccDetail(id, email, password);
        authClient.registerUser(new RegisterRequest(id, fullName, email, password, Roles.EMPLOYEE));

        // ✅ Audit log
        String actor = AuthForwardingFilter.getCurrentUser();
        Map<String, Object> payload = new HashMap<>();
        payload.put("id", id);
        payload.put("fullName", fullName);
        payload.put("email", email);
        payload.put("role", Roles.EMPLOYEE);

        hrClient.createLog(
                new AuditLog("OfficialAccount",
                        String.valueOf(id),
                        "CREATE",
                        actor,
                        payload)
        );

        return new ResponseDTO<>(true, "Official Account created Successfully");
    }
}
