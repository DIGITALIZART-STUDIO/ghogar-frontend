"use client";

import { useUpdatePaymentTransaction } from "@/app/(admin)/payments-transaction/_hooks/usePaymentTransactions";
import { PaymentTransactionCreateFormData, paymentTransactionCreateSchema } from "@/app/(admin)/payments-transaction/_schemas/createPaymentTransactionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatISO } from "date-fns";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PaymentQuotaSimple, PaymentTransaction } from "@/app/(admin)/payments-transaction/_types/paymentTransaction";
import CreatePaymentsTransactionForm from "../../../../create/_components/CreatePaymentsTransactionForm";
import { PaymentMethod } from "@/app/(admin)/reservations/_types/reservation";

interface ClientUpdatePaymentsTransactionPageProps {
    availablePayments: Array<PaymentQuotaSimple>;
    id: string;
    transaction: PaymentTransaction | undefined;
    paymentTransactionId: string;
}

export default function ClientUpdatePaymentsTransactionPage({ availablePayments, id, transaction, paymentTransactionId }: ClientUpdatePaymentsTransactionPageProps) {

    // Inicializar selectedPayments con los valores existentes de la transacción
    const [selectedPayments, setSelectedPayments] = useState<Array<string>>(
        transaction?.payments?.map((p) => p.id ?? "").filter(Boolean) ?? []
    );
    const updatePaymentTransaction = useUpdatePaymentTransaction();
    const router = useRouter();

    const form = useForm<PaymentTransactionCreateFormData>({
        resolver: zodResolver(paymentTransactionCreateSchema),
        defaultValues: {
            paymentDate: transaction?.paymentDate ?? formatISO(new Date()),
            amountPaid: transaction?.amountPaid ?? 0,
            paymentMethod: (transaction?.paymentMethod ?? "") as PaymentMethod,
            referenceNumber: transaction?.referenceNumber ?? "",
            paymentIds: transaction?.payments?.map((p) => p.id ?? "") ?? [],
            reservationId: id,
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
            id: paymentTransactionId,
            transactionData: {
                ...data,
                // reservationId se envía desde el formulario si existe
                // comprobanteFile se envía desde el ModernImageCropper si existe
            }
        });

        toast.promise(promise, {
            loading: "Actualizando transacción...",
            success: "Transacción actualizada correctamente.",
            error: (e) => `Error al actualizar transacción: ${e.message ?? e}`,
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
            totalSelectedAmount={totalSelectedAmount}
            initialImageUrl={transaction?.comprobanteUrl ?? undefined}
        />
    );
}
