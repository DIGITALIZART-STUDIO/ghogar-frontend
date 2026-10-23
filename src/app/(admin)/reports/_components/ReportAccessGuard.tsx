"use client";

import { Role, useClaims } from "@/app/(admin)/_authorization_context";
import UnauthorizedPage from "@/app/unauthorized";

interface ReportAccessGuardProps {
  allowedRoles: Array<Role>;
  children: React.ReactNode;
}

export function ReportAccessGuard({ allowedRoles, children }: ReportAccessGuardProps) {
  const roles = useClaims();
  const currentRole = roles[0];

  if (!currentRole || !allowedRoles.includes(currentRole)) {
    return <UnauthorizedPage />;
  }

  return children;
}
