"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    type PaymentTransactionCreateFormData,
    paymentTransactionCreateSchema,
} from "../../_schemas/createPaymentTransactionSchema";
import { useUpdatePaymentTransaction, useQuotaStatusByReservation } from "../../_hooks/usePaymentTransactions";
import { formatISO } from "date-fns";
import { GenericSheet } from "@/components/common/GenericSheet";
import { PaymentTransaction } from "../../_types/paymentTransaction";
import { PaymentMethod } from "@/app/(admin)/reservations/_types/reservation";
import UpdatePaymentsTransactionForm from "./UpdatePaymentsTransactionForm";

interface UpdatePaymentTransactionSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reservationId: string
  transaction: PaymentTransaction
}

export function UpdatePaymentTransactionSheet({
    open,
    onOpenChange,
    reservationId,
    transaction,
}: UpdatePaymentTransactionSheetProps) {
    const { data: availablePayments = [], isLoading, error } = useQuotaStatusByReservation(reservationId, transaction.id);
    const [selectedPayments, setSelectedPayments] = useState<Array<string>>(
        transaction.payments?.map((p) => p.id ?? "") ?? []
    );
    const updatePaymentTransaction = useUpdatePaymentTransaction();

    const form = useForm<PaymentTransactionCreateFormData>({
        resolver: zodResolver(paymentTransactionCreateSchema),
        defaultValues: {
            paymentDate: transaction.paymentDate ?? formatISO(new Date()),
            amountPaid: transaction.amountPaid ?? 0,
            paymentMethod: transaction.paymentMethod as PaymentMethod,
            referenceNumber: transaction.referenceNumber ?? "",
            paymentIds: transaction.payments?.map((p) => p.id ?? "") ?? [],
        },
    });

    // Calcular totales de manera segura
    const selectedPaymentDetails = useMemo(
        () => availablePayments.filter((p) => selectedPayments.includes(p.id ?? "")),
        [selectedPayments, availablePayments],
    );

    const totalSelectedAmount = useMemo(
        () => selectedPaymentDetails.reduce((sum, payment) => sum + (payment.amountDue ?? 0), 0),
        [selectedPaymentDetails],
    );

    const onSubmit = async (data: PaymentTransactionCreateFormData) => {
        if (data.amountPaid !== totalSelectedAmount) {
            toast.error("El monto ingresado no coincide con el total de las cuotas seleccionadas", {
                description: "Verifica los montos antes de continuar.",
            });
            return;
        }

        const promise = updatePaymentTransaction.mutateAsync({
            id: transaction.id ?? "",
            dto: {
                ...data,
                reservationId: reservationId ?? "",
            },
        });

        toast.promise(promise, {
            loading: "Actualizando transacción...",
            success: "Transacción actualizada correctamente.",
            error: (e) => `Error al actualizar transacción: ${e.message ?? e}`,
        });

        promise.then(() => {
            form.reset();
            setSelectedPayments([]);
            onOpenChange(false);
        });
    };

    const handleCancel = () => {
        form.reset();
        setSelectedPayments(transaction.payments?.map((p) => p.id ?? "") ?? []);
        onOpenChange(false);
    };

    const handleConfirm = () => {
        form.handleSubmit(onSubmit)();
    };

    return (
        <GenericSheet
            open={open}
            onOpenChange={onOpenChange}
            title="Actualizar Transacción de Pago"
            description="Modifica los datos de la transacción y las cuotas asociadas"
            badge={{
                text: `${selectedPayments.length} cuotas seleccionadas`,
                variant: "secondary",
                className:
                    selectedPayments.length > 0
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                        : "bg-gray-100 text-gray-600 border-gray-200",
            }}
            maxWidth="xl"
            rounded="lg"
            showDefaultFooter={false}
            footer={
                <div className="flex flex-row-reverse gap-2 w-full">
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={selectedPayments.length === 0 || updatePaymentTransaction.isPending}
                        className="disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {updatePaymentTransaction.isPending && (
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        )}
                        Actualizar Pago
                        {selectedPayments.length > 0 && (
                            <span className="ml-2 bg-white/20 px-2 py-1 rounded text-xs">{selectedPayments.length}</span>
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={updatePaymentTransaction.isPending}
                    >
                        Cancelar
                    </Button>
                </div>
            }
        >
            <div className="space-y-6 px-1">
                <UpdatePaymentsTransactionForm
                    form={form}
                    onSubmit={onSubmit}
                    availablePayments={availablePayments}
                    selectedPayments={selectedPayments}
                    setSelectedPayments={setSelectedPayments}
                    isLoading={isLoading}
                    error={error}
                    totalSelectedAmount={totalSelectedAmount}
                    onOpenChange={onOpenChange}
                />
            </div>
        </GenericSheet>
    );
}
