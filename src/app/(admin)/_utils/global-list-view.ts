import { Role } from "../_authorization_context";

const GLOBAL_LIST_VIEW_ROLES: Array<Role> = ["SuperAdmin", "Admin"];
const TEAM_SALES_LIST_VIEW_ROLES: Array<Role> = ["Supervisor", "CommercialManager"];

export function hasGlobalListView(role: string | undefined): boolean {
  return GLOBAL_LIST_VIEW_ROLES.includes(role as Role);
}

export function hasSharedSalesListView(role: string | undefined): boolean {
  return hasGlobalListView(role) || TEAM_SALES_LIST_VIEW_ROLES.includes(role as Role);
}
