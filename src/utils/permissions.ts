import type { UserAccount, CustomRole, RolePermission } from '../types/pos';

export const DEFAULT_FULL_PERMISSIONS: RolePermission = {
  canAccessPOS: true,
  canManageCatalog: true,
  canAccessKDS: true,
  canManageTables: true,
  canManageInventory: true,
  canManageStaff: true,
  canViewReports: true,
  canVoidOrders: true,
  canManageSettings: true
};

export const DEFAULT_KASIR_PERMISSIONS: RolePermission = {
  canAccessPOS: true,
  canManageCatalog: false,
  canAccessKDS: false,
  canManageTables: true,
  canManageInventory: false,
  canManageStaff: false,
  canViewReports: false,
  canVoidOrders: false,
  canManageSettings: false
};

export const DEFAULT_BARISTA_PERMISSIONS: RolePermission = {
  canAccessPOS: false,
  canManageCatalog: false,
  canAccessKDS: true,
  canManageTables: false,
  canManageInventory: true,
  canManageStaff: false,
  canViewReports: false,
  canVoidOrders: false,
  canManageSettings: false
};

export function getUserPermissions(user: UserAccount | null, customRoles: CustomRole[]): RolePermission {
  if (!user) return DEFAULT_KASIR_PERMISSIONS;

  // SuperAdmin or Owner has full permissions by default
  if (user.role === 'SuperAdmin' || user.role.toLowerCase().includes('owner')) {
    return DEFAULT_FULL_PERMISSIONS;
  }

  // Check if customRoleId exists
  if (user.customRoleId) {
    const found = customRoles.find(r => r.id === user.customRoleId);
    if (found) return found.permissions;
  }

  // Check by customRole name or fallback role name
  const foundByName = customRoles.find(r => r.name.toLowerCase() === user.role.toLowerCase() && r.entityId === user.tenantId);
  if (foundByName) return foundByName.permissions;

  // Fallbacks by role keywords
  if (user.role.toLowerCase().includes('barista') || user.role.toLowerCase().includes('chef') || user.role.toLowerCase().includes('kitchen')) {
    return DEFAULT_BARISTA_PERMISSIONS;
  }

  return DEFAULT_KASIR_PERMISSIONS;
}
