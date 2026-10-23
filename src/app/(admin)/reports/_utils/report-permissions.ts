import { Role } from "@/app/(admin)/_authorization_context";

export const COMMERCIAL_REPORT_ROLES: Array<Role> = [
  "SuperAdmin",
  "Admin",
  "Supervisor",
  "Manager",
  "CommercialManager",
];

export const ADMINISTRATIVE_REPORT_ROLES: Array<Role> = ["SuperAdmin", "Admin", "Manager", "FinanceManager"];

export function canViewCommercialReports(role: string | undefined): boolean {
  return COMMERCIAL_REPORT_ROLES.includes(role as Role);
}

export function canViewAdministrativeReports(role: string | undefined): boolean {
  return ADMINISTRATIVE_REPORT_ROLES.includes(role as Role);
}
