"use client";

import type { Row } from "@tanstack/react-table";
import { RefreshCcwDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { toastWrapper } from "@/types/toasts";
import { ActivateClients } from "../../_actions/ClientActions";
import type { Client } from "../../_types/client";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

interface ReactivateClientsDialogProps {
    clients: Array<Row<Client>["original"]>;
    showTrigger?: boolean;
    onSuccess?: () => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ReactivateClientsDialog({
    clients,
    showTrigger = true,
    onSuccess,
    open,
    onOpenChange,
}: ReactivateClientsDialogProps) {
    const handleReactivateClients = async () => {
        const clientIds = clients.map((client) => client.id).filter((id): id is string => id !== undefined);

        if (clientIds.length === 0) {
            toast.error("No hay clientes válidos para reactivar");
            return;
        }

        const [, error] = await toastWrapper(ActivateClients(clientIds), {
            loading: `Reactivando ${clients.length === 1 ? "cliente" : "clientes"}...`,
            success: `${clients.length} ${clients.length === 1 ? "cliente reactivado" : "clientes reactivados"} correctamente`,
            error: (e) => `Error al reactivar: ${e.message}`,
        });

        if (error) {
            throw error;
        }
    };

    return (
        <ConfirmationDialog
            title="¿Estás absolutamente seguro?"
            description={
                <>
                    Esta acción reactivará a
                    <span className="font-medium"> {clients.length}</span>
                    {clients.length === 1 ? " cliente" : " clientes"}
                </>
            }
            confirmText="Reactivar"
            cancelText="Cancelar"
            variant="default"
            trigger={
                <Button variant="outline" size="sm">
                    <RefreshCcwDot className="mr-2 size-4" aria-hidden="true" />
                    Reactivar ({clients.length})
                </Button>
            }
            showTrigger={showTrigger}
            open={open}
            onOpenChange={onOpenChange}
            onConfirm={handleReactivateClients}
            onSuccess={onSuccess}
        />
    );
}
