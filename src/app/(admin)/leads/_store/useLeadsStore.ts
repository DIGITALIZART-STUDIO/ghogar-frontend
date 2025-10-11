import { create } from "zustand";
import { ClientSummaryDto } from "../../clients/_types/client";
import { UserSummaryDto } from "../_types/lead";

interface LeadsStore {
    // Clientes
    clients: Array<ClientSummaryDto>;
    setClients: (clients: Array<ClientSummaryDto>) => void;
    selectedClientId: string | null;
    setSelectedClientId: (clientId: string | null) => void;

    // Usuarios
    users: Array<UserSummaryDto>;
    setUsers: (users: Array<UserSummaryDto>) => void;
    selectedUserId: string | null;
    setSelectedUserId: (userId: string | null) => void;
}

export const useLeadsStore = create<LeadsStore>((set: (partial: Partial<LeadsStore>) => void) => ({
    // Clientes
    clients: [],
    setClients: (clients: Array<ClientSummaryDto>) => set({ clients }),
    selectedClientId: null,
    setSelectedClientId: (selectedClientId: string | null) => set({ selectedClientId }),

    // Usuarios
    users: [],
    setUsers: (users: Array<UserSummaryDto>) => set({ users }),
    selectedUserId: null,
    setSelectedUserId: (selectedUserId: string | null) => set({ selectedUserId }),
}));

