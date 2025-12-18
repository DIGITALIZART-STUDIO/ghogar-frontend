import { useAuthContext } from "@/context/auth-provider";
import { backend as api } from "@/types/backend";

// Hook para obtener información de RUC
export function useRucFullInfo(ruc: string) {
  const { handleAuthError } = useAuthContext();

  return api.useQuery(
    "get",
    "/api/apiperu/ruc/{ruc}/info",
    {
      params: {
        path: { ruc },
      },
    },
    {
      enabled: !!ruc,
      retry: false,
      onError: async (error: unknown) => {
        await handleAuthError(error);
      },
    }
  );
}

// Hook para obtener información de DNI
export function useDniInfo(dni: string) {
  const { handleAuthError } = useAuthContext();

  return api.useQuery(
    "get",
    "/api/apiperu/dni/{dni}/info",
    {
      params: {
        path: { dni },
      },
    },
    {
      enabled: !!dni,
      retry: false,
      onError: async (error: unknown) => {
        await handleAuthError(error);
      },
    }
  );
}
