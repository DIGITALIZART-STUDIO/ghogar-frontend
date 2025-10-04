import { create } from "zustand";

import { ClientSummaryDto } from "../../clients/_types/client";

interface ClientStore {
    clients: Array<ClientSummaryDto>;
    setClients: (clients: Array<ClientSummaryDto>) => void;
    selectedClientId: string | null;
    setSelectedClientId: (clientId: string | null) => void;
}

export const useClientStore = create<ClientStore>((set: (partial: Partial<ClientStore>) => void) => ({
    clients: [],
    setClients: (clients: Array<ClientSummaryDto>) => set({ clients }),
    selectedClientId: null,
    setSelectedClientId: (selectedClientId: string | null) => set({ selectedClientId }),
}));
