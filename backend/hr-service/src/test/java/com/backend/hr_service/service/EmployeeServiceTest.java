package com.backend.hr_service.service;

import static org.junit.jupiter.api.Assertions.*;
import com.backend.hr_service.dto.EmployeeDTO;
import com.backend.hr_service.exceptions.MentorNotAvailableException;
import com.backend.hr_service.exceptions.ResourceNotFoundException;
import com.backend.hr_service.feign.AuthClient;
import com.backend.hr_service.model.Employee;
import com.backend.hr_service.model.OnboardingStatus;
import com.backend.hr_service.repository.EmployeeRepository;
import com.backend.hr_service.repository.OnboardingTaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.boot.test.context.SpringBootTest;
import java.util.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class EmployeeServiceTest {

    @InjectMocks
    private EmployeeService employeeService;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private OnboardingTaskRepository onboardingTaskRepository;

    @Mock
    private OnboardingTaskService onboardingTaskService;

    @Mock
    private AuditLogService logService;

    @Mock
    private PerformanceReviewService performanceReviewService;

    @Mock
    private AuthClient authClient;

    private Employee testEmployee;

    @BeforeEach
    void setUp() {
        testEmployee = Employee.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .department("IT")
                .active(true)
                .onboardingStatus(OnboardingStatus.PENDING)
                .isMentor(false)
                .build();
    }

    @Test
    void testGetById_ExistingId_ReturnsEmployee() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.ofNullable(testEmployee));

        Employee result = employeeService.getById(1L);

        assertEquals("John", result.getFirstName());
        verify(employeeRepository).findById(1L);
    }

    @Test
    void testGetById_NonExistingId_ThrowsException() {
        when(employeeRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> employeeService.getById(99L));
    }

    @Test
    void testCreate_WithMentorAssignment() {
        Employee mentor = Employee.builder().id(2L).isMentor(true).department("IT").build();
        EmployeeDTO dto = new EmployeeDTO();
        dto.setFirstName("Alice");
        dto.setLastName("Smith");
        dto.setDepartment("IT");
        dto.setIsMentor(false);

        when(employeeRepository.findByDepartmentAndIsMentorTrue("IT")).thenReturn(List.of(mentor));
        when(employeeRepository.countMenteesByMentor()).thenReturn(Arrays.asList(
                new Object[]{2L, 0L},
                new Object[]{3L, 2L}
        ));
        when(employeeRepository.save(any(Employee.class))).thenAnswer(invocation -> {
            Employee saved = invocation.getArgument(0);
            saved.setId(10L);
            return saved;
        });

        Employee created = employeeService.create(dto);

        assertNotNull(created);
        assertEquals("Alice", created.getFirstName());
        assertEquals(mentor, created.getMentor());
        verify(employeeRepository).save(any(Employee.class));
        verify(logService).logAction(eq("Employee"), eq("10"), eq("CREATE"), any(), any());
    }

    @Test
    void testCreate_NoMentorAvailable_ThrowsException() {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setFirstName("NoMentor");
        dto.setDepartment("Finance");
        dto.setIsMentor(false);

        when(employeeRepository.findByDepartmentAndIsMentorTrue("Finance")).thenReturn(Collections.emptyList());

        assertThrows(MentorNotAvailableException.class, () -> employeeService.create(dto));
    }

    @Test
    void testDeleteEmployee_Success() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(testEmployee));

        Map<String, String> result = employeeService.delete(1L);

        verify(onboardingTaskService).deleteAllTasksByEmpId(1L);
        verify(authClient).deleteAccByEmployeeId(1L);
        verify(performanceReviewService).deleteReview(1L);
        verify(employeeRepository).deleteById(1L);
        verify(logService).logAction(eq("Employee"), eq("1"), eq("DELETE"), any(), any());
        assertEquals("Employee Deleted Successfully", result.get("msg"));
    }

    @Test
    void testOffBoardEmployee_Success() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(testEmployee));

        String result = employeeService.offBoardEmployee(1L);

        assertEquals("Employee Offboarded successfully", result);
        assertFalse(testEmployee.getActive());
        assertEquals(OnboardingStatus.OFFBOARDED, testEmployee.getOnboardingStatus());
        verify(logService).logAction(eq("Employee"), eq("1"), eq("OFFBOARD"), any(), any());
    }
}