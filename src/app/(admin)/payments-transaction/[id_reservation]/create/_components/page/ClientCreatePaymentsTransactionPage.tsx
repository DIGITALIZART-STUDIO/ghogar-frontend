"use client";

import { useCreatePaymentTransaction } from "@/app/(admin)/payments-transaction/_hooks/usePaymentTransactions";
import { PaymentTransactionCreateFormData, paymentTransactionCreateSchema } from "@/app/(admin)/payments-transaction/_schemas/createPaymentTransactionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatISO } from "date-fns";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CreatePaymentsTransactionForm from "../CreatePaymentsTransactionForm";
import {  PaymentQuotaStatus } from "@/app/(admin)/payments-transaction/_types/paymentTransaction";

interface ClientCreatePaymentsTransactionPageProps {
    availablePayments: PaymentQuotaStatus;
    id: string;
}

export default function ClientCreatePaymentsTransactionPage({ availablePayments, id }: ClientCreatePaymentsTransactionPageProps) {

    const [selectedPayments, setSelectedPayments] = useState<Array<string>>([]);
    const createPaymentTransaction = useCreatePaymentTransaction();
    const router = useRouter();

    const form = useForm<PaymentTransactionCreateFormData>({
        resolver: zodResolver(paymentTransactionCreateSchema),
        defaultValues: {
            paymentDate: formatISO(new Date()),
            amountPaid: 0,
            paymentMethod: undefined,
            referenceNumber: "",
            paymentIds: [],
            reservationId: id, // Opcional según el backend
        },
    });
        // Calcular totales de manera segura
    const selectedPaymentDetails = useMemo(
        () => availablePayments.pendingQuotas?.filter((p) => selectedPayments.includes(p.id ?? "")),
        [selectedPayments, availablePayments],
    );

    const totalSelectedAmount = useMemo(
        () => selectedPaymentDetails?.reduce((sum, payment) => sum + (payment.amountDue ?? 0), 0),
        [selectedPaymentDetails],
    );

    const onSubmit = async (data: PaymentTransactionCreateFormData) => {
        // Si no hay cuotas seleccionadas, usar asignación automática
        if (selectedPayments.length === 0) {
            if (!data.amountPaid || data.amountPaid <= 0) {
                toast.error("Debes ingresar un monto para la asignación automática de cuotas");
                return;
            }

            // Para asignación automática, solo necesitamos el monto y reservationId
            const promise = createPaymentTransaction.mutateAsync({
                ...data,
                paymentIds: undefined, // El backend asignará automáticamente
                reservationId: id, // Necesario para asignación automática
            });

            toast.promise(promise, {
                loading: "Registrando transacción con asignación automática...",
                success: "Transacción registrada correctamente.",
                error: (e) => `Error al registrar transacción: ${e.message ?? e}`,
            });

            promise.then(() => {
                form.reset();
                setSelectedPayments([]);
                router.push("/payments-transaction");
            });
            return;
        }

        // Validación para cuotas seleccionadas manualmente
        if (data.amountPaid !== totalSelectedAmount) {
            toast.error("El monto ingresado no coincide con el total de las cuotas seleccionadas", {
                description: `Monto ingresado: ${data.amountPaid}, Total cuotas: ${totalSelectedAmount}`,
            });
            return;
        }

        const promise = createPaymentTransaction.mutateAsync({
            ...data,
            paymentIds: selectedPayments,
            reservationId: id,
        });

        toast.promise(promise, {
            loading: "Registrando transacción...",
            success: "Transacción registrada correctamente.",
            error: (e) => `Error al registrar transacción: ${e.message ?? e}`,
        });

        promise.then(() => {
            form.reset();
            setSelectedPayments([]);
            router.push("/payments-transaction");
        });
    };
    return (
        <CreatePaymentsTransactionForm
            form={form}
            onSubmit={onSubmit}
            availablePayments={availablePayments}
            selectedPayments={selectedPayments}
            setSelectedPayments={setSelectedPayments}
            totalSelectedAmount={totalSelectedAmount ?? 0}
        />
    );
}
