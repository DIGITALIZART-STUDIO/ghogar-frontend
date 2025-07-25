"use client";

import { useState,  useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/common/ResponsiveDialog";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/use-media-query";
import { PaymentTransactionCreateFormData, paymentTransactionCreateSchema } from "../../_schemas/createPaymentTransactionSchema";
import { ReservationDto } from "@/app/(admin)/reservations/_types/reservation";
import { useCreatePaymentTransaction, useQuotaStatusByReservation } from "../../_hooks/usePaymentTransactions";
import CreatePaymentsTransactionForm from "./CreatePaymentsTransactionForm";
import { formatISO } from "date-fns";

interface CreatePaymentTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reservation: ReservationDto
  showTrigger?: boolean
}

export function CreatePaymentTransactionDialog({ open, onOpenChange, reservation, showTrigger = false }: CreatePaymentTransactionDialogProps) {
    const isDesktop = useMediaQuery("(min-width: 900px)");

    const { data: availablePayments = [], isLoading, error } = useQuotaStatusByReservation(reservation.id ?? "");

    const [selectedPayments, setSelectedPayments] = useState<Array<string>>([]);
    const createPaymentTransaction = useCreatePaymentTransaction();

    const form = useForm<PaymentTransactionCreateFormData>({
        resolver: zodResolver(paymentTransactionCreateSchema),
        defaultValues: {
            paymentDate: formatISO(new Date()),
            amountPaid: 0,
            paymentMethod: undefined,
            referenceNumber: "",
            paymentIds: [],
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

        const promise = createPaymentTransaction.mutateAsync({
            ...data,
            reservationId: reservation.id ?? "",
        });

        toast.promise(promise, {
            loading: "Registrando transacción...",
            success: "Transacción registrada correctamente.",
            error: (e) => `Error al registrar transacción: ${e.message ?? e}`,
        });

        promise.then(() => {
            form.reset();
            setSelectedPayments([]);
            onOpenChange(false);
        });
    };

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={onOpenChange}
            isDesktop={isDesktop}
            title="Registrar Transacción de Pago"
            description="Completa los datos para procesar el pago y asociar las cuotas seleccionadas"
            dialogScrollAreaHeight="90vh"
            drawerScrollAreaHeight="80vh"
            dialogContentClassName="sm:max-w-[1000px] px-0"
            trigger={
                showTrigger ? (
                    <Button variant="outline" size="sm">
                        <Plus className="mr-2 size-4" aria-hidden="true" />
                        Nueva Transacción
                    </Button>
                ) : null
            }
        >
            <div className="space-y-8">

                <CreatePaymentsTransactionForm
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
        </ResponsiveDialog>
    );
}
