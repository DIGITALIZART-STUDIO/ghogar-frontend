import type { Role } from "@/app/(admin)/_authorization_context";

const CONTRACT_EDITOR_ROLES: Array<Role> = ["SuperAdmin", "Admin", "Manager", "CommercialManager"];
const PROJECT_MANAGER_ROLES: Array<Role> = ["SuperAdmin", "Admin"];

export function canEditProjectContract(roles: Array<Role> | null | undefined): boolean {
  return (roles ?? []).some((role) => CONTRACT_EDITOR_ROLES.includes(role));
}

export function canManageProject(roles: Array<Role> | null | undefined): boolean {
  return (roles ?? []).some((role) => PROJECT_MANAGER_ROLES.includes(role));
}

export function canDeleteProjectContract(roles: Array<Role> | null | undefined): boolean {
  return (roles ?? []).includes("SuperAdmin");
}
