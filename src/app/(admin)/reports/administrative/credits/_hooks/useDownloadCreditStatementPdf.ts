import { useCallback } from "react";

import { useAuthContext } from "@/context/auth-provider";

export function useDownloadCreditStatementPdf() {
  const { handleAuthError } = useAuthContext();

  return useCallback(
    async (contractId: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports/administrative/credits/${contractId}/pdf`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.blob();
      } catch (error) {
        await handleAuthError(error);
        throw error;
      }
    },
    [handleAuthError]
  );
}
