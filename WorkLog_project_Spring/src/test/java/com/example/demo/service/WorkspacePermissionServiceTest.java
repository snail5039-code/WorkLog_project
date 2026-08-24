package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.example.demo.dao.WorkspaceDao;
import com.example.demo.dto.WorkspaceMember;

class WorkspacePermissionServiceTest {
    @Mock
    private WorkspaceDao workspaceDao;

    private WorkspacePermissionService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        service = new WorkspacePermissionService(workspaceDao);
    }

    @Test
    void activeMemberIsRequired() {
        when(workspaceDao.findActiveMembership(3, 7)).thenReturn(null);
        assertThrows(SecurityException.class, () -> service.requireActiveMember(3, 7));
    }

    @Test
    void adminMeetsAdminRequirement() {
        WorkspaceMember membership = membership("ADMIN");
        when(workspaceDao.findActiveMembership(3, 7)).thenReturn(membership);
        assertEquals(membership, service.requireRole(3, 7, "ADMIN"));
    }

    @Test
    void managerCannotUseAdminOperation() {
        when(workspaceDao.findActiveMembership(3, 7)).thenReturn(membership("MANAGER"));
        assertThrows(SecurityException.class, () -> service.requireRole(3, 7, "ADMIN"));
    }

    private WorkspaceMember membership(String role) {
        WorkspaceMember membership = new WorkspaceMember();
        membership.setWorkspaceId(3);
        membership.setMemberId(7);
        membership.setStatus("ACTIVE");
        membership.setRole(role);
        return membership;
    }
}
