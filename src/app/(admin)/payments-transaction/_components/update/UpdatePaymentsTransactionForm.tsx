"use client";

import type { UseFormReturn } from "react-hook-form";
import type { PaymentTransactionCreateFormData } from "../../_schemas/createPaymentTransactionSchema";
import { useEffect, useMemo } from "react";
import { Form } from "@/components/ui/form";
import type { PaymentQuotaSimple } from "../../_types/paymentTransaction";
import CreatePaymentsTransactionHeader from "../create/CreatePaymentsTransactionHeader";
import CreatePaymentsTransactionSelector from "../create/CreatePaymentsTransactionSelector";

interface UpdatePaymentsTransactionFormProps {
  form: UseFormReturn<PaymentTransactionCreateFormData>
  onSubmit: (data: PaymentTransactionCreateFormData) => void
  availablePayments: Array<PaymentQuotaSimple>
  selectedPayments: Array<string>
  setSelectedPayments: React.Dispatch<React.SetStateAction<Array<string>>>
  isLoading: boolean
  error: Error | null
  totalSelectedAmount: number
  onOpenChange: (open: boolean) => void
}

export default function UpdatePaymentsTransactionForm({
    form,
    onSubmit,
    availablePayments,
    selectedPayments,
    setSelectedPayments,
    isLoading,
    error,
    totalSelectedAmount,
}: UpdatePaymentsTransactionFormProps) {
    const totalAvailableAmount = useMemo(
        () => availablePayments.reduce((sum, payment) => sum + (payment.amountDue ?? 0), 0),
        [availablePayments],
    );

    const progressPercentage = useMemo(
        () => (totalSelectedAmount / totalAvailableAmount) * 100,
        [totalSelectedAmount, totalAvailableAmount],
    );

    // Actualizar el formulario cuando cambian las selecciones
    useEffect(() => {
        form.setValue("paymentIds", selectedPayments, { shouldValidate: true });
    }, [selectedPayments, form]);

    // Sugerir monto basado en selección
    useEffect(() => {
        if (selectedPayments.length > 0) {
            form.setValue("amountPaid", totalSelectedAmount);
        }
    }, [totalSelectedAmount, selectedPayments.length, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4">
                <CreatePaymentsTransactionHeader
                    form={form}
                    totalSelectedAmount={totalSelectedAmount}
                    selectedPayments={selectedPayments}
                    progressPercentage={progressPercentage}
                />

                <CreatePaymentsTransactionSelector
                    availablePayments={availablePayments}
                    selectedPayments={selectedPayments}
                    setSelectedPayments={setSelectedPayments}
                    isLoading={isLoading}
                    error={error}
                    totalSelectedAmount={totalSelectedAmount}
                    totalAvailableAmount={totalAvailableAmount}
                    form={form}
                />
            </form>
        </Form>
    );
}
