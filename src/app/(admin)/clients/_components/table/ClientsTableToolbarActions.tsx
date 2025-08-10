"use client";

import { type Table } from "@tanstack/react-table";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDownloadClientsExcel } from "../../_hooks/useClients";
import { Client } from "../../_types/client";
import { CreateClientsDialog } from "../create/CreateClientsDialog";
import { DeleteClientsDialog } from "../state-management/DeleteClientsDialog";
import { ReactivateClientsDialog } from "../state-management/ReactivateClientsDialog";

export interface ClientsTableToolbarActionsProps {
  table?: Table<Client>;
}

export function ClientsTableToolbarActions({ table }: ClientsTableToolbarActionsProps) {
    const downloadExcelMutation = useDownloadClientsExcel();

    const handleDownloadExcel = async () => {
        try {
            const id = toast.loading("Descargando Excel de clientes...");
            const blob = await downloadExcelMutation.mutateAsync();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Clientes.xlsx";
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success("Excel de clientes descargado correctamente");
            toast.dismiss(id);
        } catch (error: unknown) {
            toast.dismiss();
            if (error instanceof Error) {
                toast.error(`Error al descargar el Excel de clientes: ${error.message}`);
            } else {
                toast.error(`Error al descargar el Excel de clientes: ${error}`);
            }
        }
    };

    return (
        <div className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadExcel}>
                <Download className="mr-2 size-4" aria-hidden="true" />
                Descargar Excel
            </Button>
            {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
                <>
                    <DeleteClientsDialog
                        clients={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
                        onSuccess={() => table.toggleAllRowsSelected(false)}
                    />
                    <ReactivateClientsDialog
                        clients={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
                        onSuccess={() => table.toggleAllRowsSelected(false)}
                        open={false}
                        onOpenChange={() => {}}
                    />
                </>
            ) : null}
            <CreateClientsDialog />
        </div>
    );
}
