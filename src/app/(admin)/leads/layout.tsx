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
import { useLeadsContext, LeadsProvider } from "./_context/LeadsContext";
import { useLeadsStore } from "./_store/useLeadsStore";

function UsersWithLeadsTree() {
    const { usersData, usersLoading, usersError } = useLeadsContext();
    const { selectedUserId, setSelectedUserId } = useLeadsStore();

    if (usersLoading) {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground px-2 py-1">
                <Loader2 className="h-4 w-4 animate-spin" /> Cargando usuarios...
            </div>
        );
    }

    if (usersError || !usersData) {
        return (
            <div className="px-2 py-1 text-sm text-muted-foreground">
                Error al cargar usuarios
            </div>
        );
    }

    if (usersData.length === 0) {
        return (
            <div className="px-2 py-1 text-sm text-muted-foreground">
                Sin usuarios con leads
            </div>
        );
    }

    return (
        <div className="py-2">
            <TreeProvider
                showLines
                showIcons
                indent={16}
                className="pr-1"
                defaultExpandedIds={[]}
            >
                <TreeView>
                    <TreeNode nodeId="users-root" className="mb-0.5">
                        <TreeNodeTrigger>
                            <TreeExpander hasChildren />
                            <TreeIcon icon={<Users className="h-4 w-4" />} />
                            <TreeLabel title="Usuarios con Leads">
                                Usuarios con Leads ({usersData.length})
                            </TreeLabel>
                        </TreeNodeTrigger>
                        <TreeNodeContent hasChildren className="ml-2">
                            {usersData.map((user) => (
                                <TreeNode key={user.id} nodeId={user.id} level={1} className="mt-0.5">
                                    <TreeNodeTrigger
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedUserId(user.id ?? "");
                                        }}
                                        className={selectedUserId === user.id ? "bg-accent" : ""}
                                    >
                                        <TreeExpander hasChildren={false} />
                                        <TreeIcon icon={<User className="h-4 w-4" />} />
                                        <TreeLabel title={user.userName ?? "Usuario"}>
                                            {user.userName ?? "Usuario"}
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

function ClientsTree() {
    const { clientsData, clientsLoading, clientsError } = useLeadsContext();
    const { selectedClientId, setSelectedClientId } = useLeadsStore();

    if (clientsLoading) {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground px-2 py-1">
                <Loader2 className="h-4 w-4 animate-spin" /> Cargando clientes...
            </div>
        );
    }

    if (clientsError || !clientsData) {
        return (
            <div className="px-2 py-1 text-sm text-muted-foreground">
                Error al cargar clientes
            </div>
        );
    }

    if (clientsData.length === 0) {
        return (
            <div className="px-2 py-1 text-sm text-muted-foreground">
                Sin clientes
            </div>
        );
    }

    return (
        <div className="py-2">
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
                            <TreeLabel title="Clientes">
                                Clientes ({clientsData.length})
                            </TreeLabel>
                        </TreeNodeTrigger>
                        <TreeNodeContent hasChildren className="ml-2">
                            {clientsData.map((client) => (
                                <TreeNode key={client.id} nodeId={client.id} level={1} className="mt-0.5">
                                    <TreeNodeTrigger
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedClientId(client.id ?? null);
                                        }}
                                        className={selectedClientId === client.id ? "bg-accent" : ""}
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

function FilterClearButton() {
    const { selectedUserId, selectedClientId, setSelectedUserId, setSelectedClientId } = useLeadsStore();

    if (!selectedUserId && !selectedClientId) {
        return null;
    }

    return (
        <button
            onClick={() => {
                setSelectedUserId(null);
                setSelectedClientId(null);
            }}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
            title="Limpiar filtros"
        >
            <X className="h-3 w-3" />
            Limpiar filtros
        </button>
    );
}

export default function LeadsLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

    return (
        <LeadsProvider>
            <div className="flex h-full min-h-[calc(100vh-4rem)] relative">
                <aside className={`${sidebarOpen ? "block" : "hidden"} w-80 shrink-0 border-r bg-background`}>
                    <div className="h-full flex flex-col">
                        {/* Header minimalista */}
                        <div className="px-4 py-4 border-b">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-foreground/60" />
                                    <span className="text-sm font-medium">Filtros</span>
                                </div>
                                <FilterClearButton />
                            </div>
                        </div>

                        {/* Contenido del sidebar */}
                        <div className="flex-1 overflow-hidden">
                            <div className="h-full overflow-y-auto">
                                <div className="px-4">
                                    <div className="ml-2">
                                        <UsersWithLeadsTree />
                                    </div>
                                </div>
                                <div className="px-4 border-t">
                                    <div className="ml-2">
                                        <ClientsTree />
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
                                    aria-label={sidebarOpen ? "Ocultar filtros" : "Mostrar filtros"}
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
        </LeadsProvider>
    );
}
