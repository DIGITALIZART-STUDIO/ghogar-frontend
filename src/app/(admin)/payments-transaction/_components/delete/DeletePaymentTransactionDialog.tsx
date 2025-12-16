"use client";

import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { useDeletePaymentTransaction } from "../../_hooks/usePaymentTransactions";

interface DeletePaymentTransactionDialogProps {
    paymentTransactionId: string;
    onSuccess?: () => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function DeletePaymentTransactionDialog({
    paymentTransactionId,
    onSuccess,
    open,
    onOpenChange,
}: DeletePaymentTransactionDialogProps) {
    const deletePaymentTransaction = useDeletePaymentTransaction();

    const handleDeletePaymentTransaction = async () => {
        if (!paymentTransactionId) {
            toast.error("No hay transacción de pago válida para eliminar");
            return;
        }

        const promise = deletePaymentTransaction.mutateAsync({
            params: {
                path: { id: paymentTransactionId }
            }
        });

        toast.promise(promise, {
            loading: "Eliminando transacción de pago...",
            success: "Transacción de pago eliminada correctamente",
            error: (e) => `Error al eliminar: ${e.message ?? e}`,
        });

        promise.then(() => {
            if (onSuccess) {
                onSuccess();
            }
        });
    };

    return (
        <ConfirmationDialog
            title="¿Estás absolutamente seguro?"
            description={
                <>
                    Esta acción eliminará <span className="font-medium">1</span> transacción de pago.
                </>
            }
            confirmText="Eliminar"
            cancelText="Cancelar"
            variant="destructive"
            onConfirm={handleDeletePaymentTransaction}
            onSuccess={onSuccess}
            open={open}
            onOpenChange={onOpenChange}
        />
    );
}
