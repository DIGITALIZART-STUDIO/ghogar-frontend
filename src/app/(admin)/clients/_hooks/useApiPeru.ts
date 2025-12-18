import { useQuery } from "@tanstack/react-query";
import { GetDniInfo, GetRucFullInfo } from "../_actions/ApiPeruActions";

// Hook para obtener información de RUC
export function useRucFullInfo(ruc: string) {
    return useQuery({
        queryKey: ["rucFullInfo", ruc],
        queryFn: async () => {
            const [data, error] = await GetRucFullInfo(ruc);
            if (error) {
                throw new Error(error.message);
            }
            return data;
        },
        enabled: !!ruc,
    });
}

// Hook para obtener información de DNI
export function useDniInfo(dni: string) {
    return useQuery({
        queryKey: ["dniInfo", dni],
        queryFn: async () => {
            const [data, error] = await GetDniInfo(dni);
            if (error) {
                throw new Error(error.message);
            }
            return data;
        },
        enabled: !!dni,
    });
}
