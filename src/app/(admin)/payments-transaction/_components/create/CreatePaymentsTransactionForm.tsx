import {
    ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { UseFormReturn } from "react-hook-form";
import { PaymentTransactionCreateFormData } from "../../_schemas/createPaymentTransactionSchema";
import { useEffect, useMemo } from "react";

import { PaymentQuotaSimple } from "../../_types/paymentTransaction";
import CreatePaymentsTransactionHeader from "./CreatePaymentsTransactionHeader";
import CreatePaymentsTransactionSelector from "./CreatePaymentsTransactionSelector";

interface CreatePaymentsTransactionFormProps {
      form: UseFormReturn<PaymentTransactionCreateFormData>;
      onSubmit: (data: PaymentTransactionCreateFormData) => void;
      availablePayments: Array<PaymentQuotaSimple>;
      selectedPayments: Array<string>;
      setSelectedPayments: React.Dispatch<React.SetStateAction<Array<string>>>;
      isLoading: boolean;
      error: Error | null;
      totalSelectedAmount: number;
      onOpenChange: (open: boolean) => void;
}

export default function CreatePaymentsTransactionForm({ form, onSubmit, availablePayments, selectedPayments, setSelectedPayments, isLoading, error, totalSelectedAmount, onOpenChange }: CreatePaymentsTransactionFormProps) {

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <CreatePaymentsTransactionHeader
                    form={form}
                    totalSelectedAmount={totalSelectedAmount}
                    selectedPayments={selectedPayments}
                    progressPercentage={progressPercentage}
                />

                {/* Selector de cuotas ultra moderno */}
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

                {/* Botones de acción mejorados */}
                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="px-6 py-2 border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant={"default"}
                        disabled={selectedPayments.length === 0}
                        className="disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Procesar Pago
                        {selectedPayments.length > 0 && (
                            <Badge className="ml-2 bg-white/20  border-white/30">{selectedPayments.length}</Badge>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
