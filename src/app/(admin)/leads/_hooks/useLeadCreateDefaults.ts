import { useCallback } from "react";

import { useUsers } from "@/app/(admin)/admin/users/_hooks/useUser";

export function useLeadCreateDefaults() {
  const { data: userData, isLoading: isLoadingUser } = useUsers();

  const currentUserId = userData?.user?.id ?? "";
  const currentUserName = userData?.user?.name ?? userData?.user?.userName ?? "";
  const isSalesAdvisor = userData?.roles?.[0] === "SalesAdvisor";

  const validateAssignment = useCallback(
    (assignedToId: string) => {
      if (isSalesAdvisor && assignedToId !== currentUserId) {
        return "Solo puedes asignarte leads a ti mismo";
      }
      return null;
    },
    [isSalesAdvisor, currentUserId]
  );

  return {
    currentUserId,
    currentUserName,
    isSalesAdvisor,
    isLoadingUser,
    validateAssignment,
  };
}
