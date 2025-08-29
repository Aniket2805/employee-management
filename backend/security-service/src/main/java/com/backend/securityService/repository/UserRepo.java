package com.backend.securityService.repository;
import com.backend.securityService.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepo extends JpaRepository<Users,Long> {
    Users findByEmail(String email);

    @Modifying
    @Query("UPDATE Users u SET u.password = :password WHERE u.id = :id")
    void updatePassword(@Param("id") Long id, @Param("password") String password);

    boolean existsByEmail(String email);

    void deleteByEmployeeId(Long employeeId);

    boolean existsByEmployeeId(Long employeeId);

    Users findByEmployeeId(Long employeeId);
}
