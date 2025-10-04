"use client";

import { useState } from "react";
import { Users, Loader2, PanelLeftClose, PanelLeftOpen, User, X } from "lucide-react";
import {
    TreeExpander,
    TreeIcon,
    TreeLabel,
    TreeNode,
    TreeNodeContent,
    TreeNodeTrigger,
    TreeProvider,
    TreeView,
} from "@/components/ui/kibo-ui/tree";
import { ClientProvider, useClientContext } from "./_context/ClientContext";
import { useClientStore } from "./_store/useClientStore";

function ClientClearButton() {
    const { selectedClientId, setSelectedClientId } = useClientStore();

    if (!selectedClientId) {
        return null;
    }

    return (
        <button
            onClick={() => setSelectedClientId(null)}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
            title="Limpiar filtro de cliente"
        >
            <X className="h-3 w-3" />
            Limpiar filtro
        </button>
    );
}

function ClientsByCurrentUserTree() {
    const { clientsData, isLoading, error } = useClientContext();
    const { setSelectedClientId } = useClientStore();

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground px-2 py-1">
                <Loader2 className="h-4 w-4 animate-spin" /> Cargando clientes...
            </div>
        );
    }

    if (error || !clientsData) {
        return (
            <div className="px-2 py-1 text-sm text-muted-foreground">
                Error al cargar clientes
            </div>
        );
    }

    if (clientsData.length === 0) {
        return (
            <div className="px-2 py-1 text-sm text-muted-foreground">
                Sin clientes asignados
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto py-2">
            <TreeProvider
                showLines
                showIcons
                indent={16}
                className="pr-1"
                defaultExpandedIds={[]}
            >
                <TreeView>
                    <TreeNode nodeId="clients-root" className="mb-0.5">
                        <TreeNodeTrigger>
                            <TreeExpander hasChildren />
                            <TreeIcon icon={<Users className="h-4 w-4" />} />
                            <TreeLabel title="Mis Clientes">
                                Mis Clientes ({clientsData.length})
                            </TreeLabel>
                        </TreeNodeTrigger>
                        <TreeNodeContent hasChildren className="ml-2">
                            {clientsData.map((client) => (
                                <TreeNode key={client.id} nodeId={client.id} level={1} className="mt-0.5">
                                    <TreeNodeTrigger
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Actualizar el cliente seleccionado en el store
                                            setSelectedClientId(client.id ?? null);
                                            console.log("Cliente seleccionado:", client);
                                        }}
                                    >
                                        <TreeExpander hasChildren={false} />
                                        <TreeIcon icon={<User className="h-4 w-4" />} />
                                        <TreeLabel title={client.name ?? "Cliente"}>
                                            {client.name ?? "Cliente"}
                                        </TreeLabel>
                                    </TreeNodeTrigger>
                                </TreeNode>
                            ))}
                        </TreeNodeContent>
                    </TreeNode>
                </TreeView>
            </TreeProvider>
        </div>
    );
}

export default function AssignmentsLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

    return (
        <ClientProvider>
            <div className="flex h-full min-h-[calc(100vh-4rem)] relative">
                <aside className={`${sidebarOpen ? "block" : "hidden"} w-80 shrink-0 border-r bg-background`}>
                    <div className="h-full flex flex-col">
                        {/* Header minimalista */}
                        <div className="px-4 py-4 border-b">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-foreground/60" />
                                    <span className="text-sm font-medium">Clientes</span>
                                </div>
                                <ClientClearButton />
                            </div>
                        </div>

                        {/* Tree de clientes */}
                        <div className="flex-1 overflow-hidden">
                            <div className="h-full overflow-y-auto">
                                <div className="px-4">
                                    <div className="ml-2">
                                        <ClientsByCurrentUserTree />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto relative">
                    <div className="relative">
                        {/* Header flotante minimalista */}
                        <div className="sticky top-0 z-30 bg-background border-b">
                            <div className="flex items-center justify-between px-6 py-4">
                                <button
                                    type="button"
                                    aria-label={sidebarOpen ? "Ocultar clientes" : "Mostrar clientes"}
                                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-accent transition-colors group"
                                    onClick={() => setSidebarOpen((prev) => !prev)}
                                >
                                    {sidebarOpen ? (
                                        <PanelLeftClose className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                    ) : (
                                        <PanelLeftOpen className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                    )}
                                </button>
                                <div className="flex-1" />
                            </div>
                        </div>

                        {/* Contenido principal con mejor integración */}
                        <div className="px-6 py-6">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </ClientProvider>
    );
}
