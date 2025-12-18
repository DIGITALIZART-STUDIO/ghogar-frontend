"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Building2, Calendar, CreditCard, DollarSign, Edit, FileText, MoreVertical, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { PaymentHistoryDto, ReservationPendingValidationDto } from "../../../reservations/_types/reservation";
import { PaymentMethodLabels } from "../../../reservations/_utils/reservations.utils";
import { DeletePaymentDialog } from "./DeletePaymentDialog";
import { PaymentHistoryDialog } from "./PaymentHistoryDialog";

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
    <div className="space-y-5">
      {/* Header mejorado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Historial de Pagos</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {paymentHistory.length} pago{paymentHistory.length !== 1 ? "s" : ""} registrado
              {paymentHistory.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Button onClick={handleAddPayment} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Agregar Pago
        </Button>
      </div>

      {/* Lista de pagos */}
      {paymentHistory.length === 0 ? (
        <Card className="border-slate-200 dark:border-slate-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <DollarSign className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">No hay pagos registrados</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
              Haz clic en &quot;Agregar Pago&quot; para registrar el primer pago
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {paymentHistory.map((payment, index) => {
            const methodConfig = payment.method
              ? PaymentMethodLabels[payment.method as keyof typeof PaymentMethodLabels]
              : null;
            const MethodIcon = methodConfig?.icon ?? CreditCard;

            return (
              <Card
                key={payment.id ?? index}
                className="group border-slate-200 dark:border-slate-700 hover:border-primary/30 dark:hover:border-primary/30 transition-colors"
              >
                <CardHeader className="border-b  [.border-b]:pb-3">
                  <div className="flex items-start justify-between gap-4">
                    {/* Información principal */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Icono del método de pago */}
                      <div
                        className={cn(
                          "p-3 rounded-lg shrink-0 transition-colors",
                          methodConfig?.className
                            ? `bg-current/10 ${methodConfig.className}`
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        )}
                      >
                        <MethodIcon className="h-5 w-5" />
                      </div>

                      {/* Contenido principal */}
                      <div className="flex-1 min-w-0 space-y-2">
                        {/* Monto destacado */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {formatAmount(payment.amount)}
                          </span>
                          {methodConfig && (
                            <Badge
                              variant="outline"
                              className={cn("text-xs border-current/20", methodConfig.className)}
                            >
                              {methodConfig.label}
                            </Badge>
                          )}
                        </div>

                        {/* Fecha */}
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <span>{formatDate(payment.date)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Menú de acciones */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => handleEditPayment(payment)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DeletePaymentDialog payment={payment} reservationId={reservationId} showTrigger={false} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                {/* Detalles adicionales */}
                {(payment.bankName || payment.reference || payment.notes) && (
                  <CardContent>
                    <div className="space-y-2.5">
                      {/* Banco */}
                      {payment.bankName && (
                        <div className="flex items-center gap-2.5 text-sm">
                          <Building2 className="h-4 w-4 text-slate-500 dark:text-slate-400 shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300">{payment.bankName}</span>
                        </div>
                      )}

                      {/* Referencia */}
                      {payment.reference && (
                        <div className="flex items-center gap-2.5 text-sm">
                          <FileText className="h-4 w-4 text-slate-500 dark:text-slate-400 shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300">Ref: {payment.reference}</span>
                        </div>
                      )}

                      {/* Notas */}
                      {payment.notes && (
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{payment.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
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
