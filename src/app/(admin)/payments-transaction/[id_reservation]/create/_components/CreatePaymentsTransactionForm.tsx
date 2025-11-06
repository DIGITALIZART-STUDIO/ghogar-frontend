import {
    ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { UseFormReturn } from "react-hook-form";
import { PaymentTransactionCreateFormData } from "../../../_schemas/createPaymentTransactionSchema";
import { useEffect, useMemo } from "react";

import { PaymentQuotaStatus } from "../../../_types/paymentTransaction";
import CreatePaymentsTransactionHeader from "./CreatePaymentsTransactionHeader";
import CreatePaymentsTransactionSelector from "./CreatePaymentsTransactionSelector";
import CropperReceiptForm from "./CropperReceiptForm";

interface CreatePaymentsTransactionFormProps {
    form: UseFormReturn<PaymentTransactionCreateFormData>;
    onSubmit: (data: PaymentTransactionCreateFormData) => void;
    availablePayments: PaymentQuotaStatus;
    selectedPayments: Array<string>;
    setSelectedPayments: React.Dispatch<React.SetStateAction<Array<string>>>;
    totalSelectedAmount: number;
    initialImageUrl?: string; // URL de imagen existente para edición
    onCancel?: () => void; // Función opcional para manejar la cancelación
}

export default function CreatePaymentsTransactionForm({
    form,
    onSubmit,
    availablePayments,
    selectedPayments,
    setSelectedPayments,
    totalSelectedAmount,
    initialImageUrl,
    onCancel,
}: CreatePaymentsTransactionFormProps) {

    // Usar el totalAmountRemaining de la BD si está disponible, sino calcularlo
    const totalAvailableAmount = useMemo(
        () => availablePayments.totalAmountRemaining ?? availablePayments.pendingQuotas?.reduce((sum, payment) => sum + (payment.amountDue ?? 0), 0) ?? 0,
        [availablePayments],
    );

    const progressPercentage = useMemo(() => {
        if (totalAvailableAmount > 0) {
            return (totalSelectedAmount / totalAvailableAmount) * 100;
        }
        return 0;
    }, [totalSelectedAmount, totalAvailableAmount]);

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

    // Manejar la imagen recortada
    const handleImageCropped = (blob: Blob) => {
        // Convertir blob a File para el formulario (JPEG con máxima calidad)
        const file = new File([blob], "comprobante.jpg", { type: "image/jpeg" });
        form.setValue("comprobanteFile", file);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Layout responsive: Header y Selector a la izquierda, Imagen a la derecha */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Columna izquierda: Header y Selector */}
                    <div className="space-y-6">
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
                            totalSelectedAmount={totalSelectedAmount}
                            totalAvailableAmount={totalAvailableAmount}
                            form={form}
                        />
                    </div>

                    {/* Columna derecha: Comprobante Cropper */}
                    <div className="space-y-6">
                        <CropperReceiptForm
                            onImageCropped={handleImageCropped}
                            initialImageUrl={initialImageUrl}
                        />
                    </div>
                </div>

                {/* Botones de acción mejorados */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        className="px-6 py-2 border-slate-300 text-slate-700 hover:bg-slate-50"
                        onClick={onCancel}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant={"default"}
                        className="disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowRight className="h-4 w-4 mr-2" />

                        Procesar Pago
                        <Badge className="ml-2 bg-white/20 border-white/30">{selectedPayments.length}</Badge>

                    </Button>
                </div>
            </form>
        </Form>
    );
}
