import { backend as api } from "@/types/backend";
import { useAuthContext } from "@/context/auth-provider";

// Hook para obtener el tipo de cambio actual
export function useCurrentExchangeRate() {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/ExchangeRate", {
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}
