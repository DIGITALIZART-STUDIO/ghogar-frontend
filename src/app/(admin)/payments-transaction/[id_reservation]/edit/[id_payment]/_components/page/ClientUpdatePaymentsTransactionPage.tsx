"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatISO } from "date-fns";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useUpdatePaymentTransaction } from "@/app/(admin)/payments-transaction/_hooks/usePaymentTransactions";
import {
  PaymentTransactionCreateFormData,
  paymentTransactionCreateSchema,
} from "@/app/(admin)/payments-transaction/_schemas/createPaymentTransactionSchema";
import { PaymentQuotaStatus, PaymentTransaction } from "@/app/(admin)/payments-transaction/_types/paymentTransaction";
import { PaymentMethod } from "@/app/(admin)/reservations/_types/reservation";
import CreatePaymentsTransactionForm from "../../../../create/_components/CreatePaymentsTransactionForm";

interface ClientUpdatePaymentsTransactionPageProps {
  availablePayments: PaymentQuotaStatus;
  id: string;
  transaction: PaymentTransaction | undefined;
  paymentTransactionId: string;
}

export default function ClientUpdatePaymentsTransactionPage({
  availablePayments,
  id,
  transaction,
  paymentTransactionId,
}: ClientUpdatePaymentsTransactionPageProps) {
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
      contractId: id,
    },
  });

  // Calcular totales de manera segura
  const selectedPaymentDetails = useMemo(
    () => availablePayments?.pendingQuotas?.filter((p) => selectedPayments.includes(p.id ?? "")),
    [selectedPayments, availablePayments]
  );

  const totalSelectedAmount = useMemo(
    () => selectedPaymentDetails?.reduce((sum, payment) => sum + (payment.amountDue ?? 0), 0),
    [selectedPaymentDetails]
  );

  const onSubmit = async (data: PaymentTransactionCreateFormData) => {
    if (data.amountPaid !== totalSelectedAmount) {
      toast.error("El monto ingresado no coincide con el total de las cuotas seleccionadas", {
        description: "Verifica los montos antes de continuar.",
      });
      return;
    }

    const body: Record<string, unknown> = {
      paymentDate: data.paymentDate,
      amountPaid: data.amountPaid,
      paymentMethod: data.paymentMethod,
      referenceNumber: data.referenceNumber,
      paymentIds: selectedPayments,
      contractId: id,
    };

    // Agregar comprobanteFile solo si es un File real
    if (data.comprobanteFile && data.comprobanteFile instanceof File) {
      body.comprobanteFile = data.comprobanteFile;
    }

    try {
      const promise = updatePaymentTransaction.mutateAsync({
        params: {
          path: { id: paymentTransactionId },
        },
        body,
      });

      toast.promise(promise, {
        loading: "Actualizando transacción...",
        success: "Transacción actualizada correctamente.",
        error: (e: unknown) => {
          const error = e as { message?: string; error?: string };
          return error?.message ?? error?.error ?? "Error desconocido al actualizar transacción";
        },
      });

      await promise;

      form.reset();
      setSelectedPayments([]);
      router.push("/payments-transaction");
    } catch (error) {
      console.error("Error updating payment transaction:", error);
    }
  };

  const handleCancel = () => {
    router.push("/payments-transaction");
  };

  return (
    <CreatePaymentsTransactionForm
      form={form}
      onSubmit={onSubmit}
      availablePayments={availablePayments}
      selectedPayments={selectedPayments}
      setSelectedPayments={setSelectedPayments}
      totalSelectedAmount={totalSelectedAmount ?? 0}
      initialImageUrl={transaction?.comprobanteUrl ?? undefined}
      onCancel={handleCancel}
    />
  );
}
