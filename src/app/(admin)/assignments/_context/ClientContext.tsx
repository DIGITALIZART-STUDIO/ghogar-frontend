"use client";

import { createContext, useContext, ReactNode, useEffect } from "react";
import { useClientsByCurrentUserSummary } from "../../clients/_hooks/useClients";
import { useSelectedProject } from "@/hooks/use-selected-project";
import { useClientStore } from "../_store/useClientStore";
import { ClientSummaryDto } from "../../clients/_types/client";

interface ClientContextType {
    clientsData: Array<ClientSummaryDto> | undefined;
    isLoading: boolean;
    error: unknown;
    refetch: () => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

interface ClientProviderProps {
  children: ReactNode;
}

export function ClientProvider({ children }: ClientProviderProps) {
    const { getSelectedProjectId } = useSelectedProject();
    const selectedProjectId = getSelectedProjectId();

    const { setClients } = useClientStore();

    // Una sola llamada centralizada para obtener los clientes
    const { data: clientsData, isLoading, error, refetch } = useClientsByCurrentUserSummary(selectedProjectId ?? undefined);

    // Actualizar el store cuando cambien los datos
    useEffect(() => {
        if (clientsData) {
            setClients(clientsData);
        }
    }, [clientsData, setClients]);

    const value: ClientContextType = {
        clientsData,
        isLoading,
        error,
        refetch,
    };

    return (
        <ClientContext.Provider value={value}>
            {children}
        </ClientContext.Provider>
    );
}

export function useClientContext() {
    const context = useContext(ClientContext);
    if (context === undefined) {
        throw new Error("useClientContext must be used within a ClientProvider");
    }
    return context;
}
