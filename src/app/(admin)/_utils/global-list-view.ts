import { Role } from "../_authorization_context";

const GLOBAL_LIST_VIEW_ROLES: Array<Role> = ["SuperAdmin", "Admin"];

export function hasGlobalListView(role: string | undefined): boolean {
  return GLOBAL_LIST_VIEW_ROLES.includes(role as Role);
}
