"use client";

import { createContext, useContext, ReactNode, useEffect } from "react";
import { useClientsByCurrentUserSummary } from "../../clients/_hooks/useClients";
import { useUsersWithLeadsSummary } from "../_hooks/useLeads";
import { useSelectedProject } from "@/hooks/use-selected-project";
import { useLeadsStore } from "../_store/useLeadsStore";
import { ClientSummaryDto } from "../../clients/_types/client";

interface UserSummaryDto {
    id: string;
    userName: string | null;
}

interface LeadsContextType {
    // Clientes
    clientsData: Array<ClientSummaryDto> | undefined;
    clientsLoading: boolean;
    clientsError: unknown;
    clientsRefetch: () => void;

    // Usuarios
    usersData: Array<UserSummaryDto> | undefined;
    usersLoading: boolean;
    usersError: unknown;
    usersRefetch: () => void;
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

interface LeadsProviderProps {
    children: ReactNode;
}

export function LeadsProvider({ children }: LeadsProviderProps) {
    const { getSelectedProjectId } = useSelectedProject();
    const selectedProjectId = getSelectedProjectId();
    const { setClients, setUsers } = useLeadsStore();

    // Obtener todos los clientes (useCurrentUser=false)
    const {
        data: clientsData,
        isLoading: clientsLoading,
        error: clientsError,
        refetch: clientsRefetch
    } = useClientsByCurrentUserSummary(selectedProjectId ?? undefined, false);

    // Obtener usuarios con leads
    const {
        data: usersData,
        isLoading: usersLoading,
        error: usersError,
        refetch: usersRefetch
    } = useUsersWithLeadsSummary(selectedProjectId ?? undefined);

    // Sincronizar datos con el store
    useEffect(() => {
        if (clientsData) {
            setClients(clientsData);
        }
    }, [clientsData, setClients]);

    useEffect(() => {
        if (usersData) {
            setUsers(usersData);
        }
    }, [usersData, setUsers]);

    return (
        <LeadsContext.Provider value={{
            clientsData,
            clientsLoading,
            clientsError,
            clientsRefetch,
            usersData,
            usersLoading,
            usersError,
            usersRefetch
        }}
        >
            {children}
        </LeadsContext.Provider>
    );
}

export function useLeadsContext() {
    const context = useContext(LeadsContext);
    if (context === undefined) {
        throw new Error("useLeadsContext must be used within a LeadsProvider");
    }
    return context;
}
