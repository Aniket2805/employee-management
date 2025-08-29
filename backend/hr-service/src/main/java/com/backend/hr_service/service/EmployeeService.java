package com.backend.hr_service.service;
import com.backend.hr_service.config.AuthForwardingFilter;
import com.backend.hr_service.exceptions.MentorNotAvailableException;
import com.backend.hr_service.exceptions.ResourceNotFoundException;
import com.backend.hr_service.feign.AuthClient;
import com.backend.hr_service.model.Employee;
import com.backend.hr_service.dto.EmployeeDTO;
import com.backend.hr_service.model.OnboardingStatus;
import com.backend.hr_service.repository.EmployeeRepository;
import com.backend.hr_service.repository.OnboardingTaskRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private OnboardingTaskRepository onboardingTaskRepository;

    @Autowired
    private OnboardingTaskService onboardingTaskService;

    @Autowired
    private AuditLogService logService;

    @Autowired
    private PerformanceReviewService performanceReviewService;

    @Autowired
    private AuthClient authClient;

    public List<Employee> getAll() {
        // No audit for reads unless you want to add one
        return employeeRepository.findAll();
    }

    public Employee getById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    @Transactional
    public Employee create(EmployeeDTO dto) {
        Employee mentor = null;

        if (Boolean.FALSE.equals(dto.getIsMentor())) {
            mentor = assignMentor(dto.getDepartment()); // only assign if not a mentor
        }

        Employee employee = Employee.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .department(dto.getDepartment())
                .onboardingStage("HR")
                .onboardingStatus(OnboardingStatus.PENDING)
                .active(true)
                .isMentor(dto.getIsMentor())
                .mentor(mentor)
                .build();

        Employee saved = employeeRepository.save(employee);

        // Audit log here
        logService.logAction(
                "Employee",
                String.valueOf(saved.getId()),
                "CREATE",
                AuthForwardingFilter.getCurrentUser(),
                saved
        );

        return saved;
    }

    private Employee assignMentor(String department) {
        List<Employee> mentors = employeeRepository.findByDepartmentAndIsMentorTrue(department);
        if (mentors.isEmpty()) {
            throw new MentorNotAvailableException("No mentors available in department: " + department);
        }
        List<Object[]> menteeCounts = employeeRepository.countMenteesByMentor();

        Map<Long, Long> mentorToMenteeCount = new HashMap<>();
        for (Object[] row : menteeCounts) {
            Long mentorId = (Long) row[0];
            Long count = (Long) row[1];
            mentorToMenteeCount.put(mentorId, count);
        }

        Employee bestMentor = mentors.get(0);
        long minCount = mentorToMenteeCount.getOrDefault(bestMentor.getId(), 0L);

        for (Employee mentor : mentors) {
            long count = mentorToMenteeCount.getOrDefault(mentor.getId(), 0L);
            if (count < minCount) {
                minCount = count;
                bestMentor = mentor;
            }
        }
        return bestMentor;
    }

    @Transactional
    public Map<String, String> delete(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        // Audit log here
        logService.logAction(
                "Employee",
                String.valueOf(id),
                "DELETE",
                AuthForwardingFilter.getCurrentUser(),
                employee
        );

        // Step 1: Set mentor = null for employees mentored by the one being deleted
        employeeRepository.clearMentorReference(id);

        // Step 2: Delete associated tasks
        onboardingTaskService.deleteAllTasksByEmpId(id);

        // Step 3: Delete account in auth service
        authClient.deleteAccByEmployeeId(id);

        // Step 4: Delete Performance Review
        performanceReviewService.deleteReview(id);

        // Step 5: Delete employee
        employeeRepository.deleteById(id);

        Map<String, String> res = new HashMap<>();
        res.put("msg", "Employee Deleted Successfully");
        return res;
    }

    @Transactional
    public Employee update(Long id, EmployeeDTO dto) {
        Employee existing = getById(id); // throws if not found

        if (dto.getIsMentor() == true) {
            existing.setMentor(null);
        } else if (!Objects.equals(existing.getDepartment(), dto.getDepartment()) || existing.getMentor()==null) {
            List<Map<String, Object>> mentors = getAvailableMentorsForEmployee(id);
            if(mentors.isEmpty()){
                throw new MentorNotAvailableException("No mentors available in department: " + dto.getDepartment());
            }
            Map<String, Object> bestMentor = mentors.stream()
                    .filter(m -> !Objects.equals(m.get("id"), id))
                    .min(Comparator.comparingLong(m -> (Long) m.get("menteeCount")))
                    .orElse(null);
            assert bestMentor != null;
            Employee mentor = getById((Long) bestMentor.get("id"));
            existing.setMentor(mentor);
        }
        existing.setIsMentor(dto.getIsMentor());
        existing.setFirstName(dto.getFirstName());
        existing.setLastName(dto.getLastName());
        existing.setDepartment(dto.getDepartment());

        Employee updated = employeeRepository.save(existing);

        // Audit log here
        logService.logAction(
                "Employee",
                String.valueOf(updated.getId()),
                "UPDATE",
                AuthForwardingFilter.getCurrentUser(),
                updated
        );

        return updated;
    }

    public List<Map<String, Object>> getAvailableMentorsForEmployee(Long employeeId) {
        Employee employee = getById(employeeId);

        List<Employee> mentors = employeeRepository.findByDepartment(employee.getDepartment());

        List<Object[]> menteeCounts = employeeRepository.countMenteesByMentor();

        Map<Long, Long> mentorToMenteeCount = new HashMap<>();
        for (Object[] row : menteeCounts) {
            Long mentorId = (Long) row[0];
            Long count = (Long) row[1];
            mentorToMenteeCount.put(mentorId, count);
        }

        return mentors.stream()
                .filter(m -> !m.getId().equals(employee.getId()))
                .map(mentor -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", mentor.getId());
                    map.put("name", mentor.getFirstName() + " " + mentor.getLastName());
                    map.put("department", mentor.getDepartment());
                    map.put("menteeCount", mentorToMenteeCount.getOrDefault(mentor.getId(), 0L));
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public String updateAccDetail(Long id, String email, String password) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee NOT Found"));

        employee.setEmail(email);
        employee.setPassword(password);
        employeeRepository.save(employee);

        // Audit log here
        logService.logAction(
                "Employee",
                String.valueOf(employee.getId()),
                "UPDATE_ACCOUNT",
                AuthForwardingFilter.getCurrentUser(),
                Map.of("email", email) // or pass full employee object if you want
        );

        return "Employee Account Details Updated Successfully";
    }

    public String offBoardEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        onboardingTaskRepository.deleteAllByEmployeeId(id);
        performanceReviewService.deleteReview(id);
        authClient.deActivateAccByEmployeeId(id);
        employee.setActive(false);
        employee.setOnboardingStatus(OnboardingStatus.OFFBOARDED);
        employeeRepository.save(employee);

        // Audit log here
        logService.logAction(
                "Employee",
                String.valueOf(employee.getId()),
                "OFFBOARD",
                AuthForwardingFilter.getCurrentUser(),
                employee
        );

        return "Employee Offboarded successfully";
    }
}
