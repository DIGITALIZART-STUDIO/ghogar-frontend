"use client";

import { useState } from "react";
import { Plus, Edit, Calendar, CreditCard, Building2, FileText, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PaymentHistoryDto, ReservationPendingValidationDto } from "../../reservations/_types/reservation";
import { PaymentMethodLabels } from "../../reservations/_utils/reservations.utils";
import { PaymentHistoryDialog } from "./PaymentHistoryDialog";
import { DeletePaymentDialog } from "./DeletePaymentDialog";

interface PaymentHistoryListProps {
    paymentHistory: Array<PaymentHistoryDto>;
    reservationId: string;
    currency: string;
    reservationData?: ReservationPendingValidationDto;
}

export function PaymentHistoryList({
    paymentHistory,
    reservationId,
    currency,
    reservationData,
}: PaymentHistoryListProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPayment, setEditingPayment] = useState<PaymentHistoryDto | null>(null);

    const handleAddPayment = () => {
        setEditingPayment(null);
        setIsDialogOpen(true);
    };

    const handleEditPayment = (payment: PaymentHistoryDto) => {
        setEditingPayment(payment);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setEditingPayment(null);
    };

    const formatAmount = (amount: number | undefined) => {
        if (amount === undefined || amount === null) {
            return "N/A";
        }
        const symbol = currency === "USD" ? "$" : "S/";
        return `${symbol}${amount.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`;
    };

    const formatDate = (date: string | undefined) => {
        if (!date) {
            return "N/A";
        }
        try {
            return format(new Date(date), "dd/MM/yyyy", { locale: es });
        } catch {
            return "Fecha inválida";
        }
    };

    return (
        <div className="space-y-4">
            {/* Header con botón de agregar */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Historial de Pagos
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        {paymentHistory.length} pago{paymentHistory.length !== 1 ? "s" : ""} registrado{paymentHistory.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Button
                    onClick={handleAddPayment}
                    size="sm"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Pago
                </Button>
            </div>

            <Separator className="bg-slate-200 dark:bg-slate-700" />

            {/* Lista de pagos */}
            {paymentHistory.length === 0 ? (
                <Card className="border-slate-200 dark:border-slate-700">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                        <DollarSign className="h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
                        <p className="text-slate-600 dark:text-slate-400 text-center">
                            No hay pagos registrados
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-500 text-center mt-1">
                            Haz clic en &quot;Agregar Pago&quot; para registrar el primer pago
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {paymentHistory.map((payment, index) => (
                        <Card key={payment.id ?? index} className="border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Badge
                                            variant="outline"
                                            className="text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                                        >
                                            {formatAmount(payment.amount)}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                                        >
                                            {payment.method ? (PaymentMethodLabels[payment.method as keyof typeof PaymentMethodLabels]?.label ?? payment.method) : "N/A"}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEditPayment(payment)}
                                            className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <DeletePaymentDialog
                                            payment={payment}
                                            reservationId={reservationId}
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-2">
                                    {/* Fecha del pago */}
                                    <div className="flex items-center space-x-2 text-sm">
                                        <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                        <span className="text-slate-600 dark:text-slate-400">
                                            {formatDate(payment.date)}
                                        </span>
                                    </div>

                                    {/* Método de pago */}
                                    <div className="flex items-center space-x-2 text-sm">
                                        <CreditCard className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                        <span className="text-slate-600 dark:text-slate-400">
                                            {payment.method ? (PaymentMethodLabels[payment.method as keyof typeof PaymentMethodLabels]?.label ?? payment.method) : "N/A"}
                                        </span>
                                    </div>

                                    {/* Banco (si aplica) */}
                                    {payment.bankName && (
                                        <div className="flex items-center space-x-2 text-sm">
                                            <Building2 className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                            <span className="text-slate-600 dark:text-slate-400">
                                                {payment.bankName}
                                            </span>
                                        </div>
                                    )}

                                    {/* Referencia (si aplica) */}
                                    {payment.reference && (
                                        <div className="flex items-center space-x-2 text-sm">
                                            <FileText className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                            <span className="text-slate-600 dark:text-slate-400">
                                                Ref: {payment.reference}
                                            </span>
                                        </div>
                                    )}

                                    {/* Notas (si aplica) */}
                                    {payment.notes && (
                                        <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-md">
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {payment.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Dialog para crear/editar pagos */}
            <PaymentHistoryDialog
                isOpen={isDialogOpen}
                onClose={handleDialogClose}
                reservationId={reservationId}
                payment={editingPayment}
                reservationData={reservationData}
            />
        </div>
    );
}
