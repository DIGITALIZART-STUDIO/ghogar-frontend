import React from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock, DollarSign, FileText, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ReservationDto } from "../../../reservations/_types/reservation";
import {
  CurrencyLabels,
  PaymentMethodLabels,
  ReservationStatusLabels,
} from "../../../reservations/_utils/reservations.utils";

interface ReservationViewContentProps {
  data?: ReservationDto;
  isLoading: boolean;
  daysLeft: number;
}

export default function ReservationViewContent({ data, isLoading, daysLeft }: ReservationViewContentProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-muted-foreground">Cargando datos...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-muted-foreground">No hay datos disponibles</p>
      </div>
    );
  }

  const isExpired = daysLeft < 0;
  const currencySymbol = data.currency === "SOLES" ? "S/" : "$";

  return (
    <div className="space-y-6 font-montserrat">
      {/* Encabezado con información principal */}
      <div className="rounded-lg bg-card p-6 text-card-foreground">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Reserva</h3>
          {data.status && ReservationStatusLabels[data.status as keyof typeof ReservationStatusLabels] ? (
            <Badge
              variant="outline"
              className={ReservationStatusLabels[data.status as keyof typeof ReservationStatusLabels].className}
            >
              {React.createElement(ReservationStatusLabels[data.status as keyof typeof ReservationStatusLabels].icon, {
                className: "size-4 flex-shrink-0 mr-1",
              })}
              {ReservationStatusLabels[data.status as keyof typeof ReservationStatusLabels].label}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-gray-700 border-gray-200">
              Sin estado
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <User className="h-5 w-5 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Cliente</p>
              <p className="font-medium">{data.clientName}</p>
            </div>
          </div>

          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Cotización</p>
              <p className="font-medium font-mono text-sm">{data.quotationCode}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">
              {data.reservationDate
                ? format(parseISO(data.reservationDate), "dd 'de' MMMM yyyy", { locale: es })
                : "No disponible"}
            </span>
          </div>

          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className={`text-sm ${isExpired ? "text-red-600 font-medium" : ""}`}>
              {isExpired ? "Vencida" : daysLeft > 0 ? `${daysLeft} días restantes` : "Vence hoy"}
            </span>
          </div>
        </div>
      </div>

      {/* Información de pago */}
      <div className="bg-card rounded-lg p-5 border-l-4 border-primary">
        <h4 className="flex items-center font-semibold mb-4">
          <DollarSign className="h-5 w-5 mr-2 text-primary" />
          Información de Pago
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Monto Pagado</p>
            <p className="font-bold text-lg">
              {currencySymbol} {data.amountPaid?.toLocaleString("es-PE", { minimumFractionDigits: 2 }) ?? "0.00"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Método de Pago</p>
            <p className="font-medium flex items-center gap-2">
              {data.paymentMethod && PaymentMethodLabels[data.paymentMethod as keyof typeof PaymentMethodLabels] ? (
                <>
                  {React.createElement(
                    PaymentMethodLabels[data.paymentMethod as keyof typeof PaymentMethodLabels].icon,
                    {
                      className: `${PaymentMethodLabels[data.paymentMethod as keyof typeof PaymentMethodLabels].className} w-4 h-4`,
                    }
                  )}
                  <span
                    className={PaymentMethodLabels[data.paymentMethod as keyof typeof PaymentMethodLabels].className}
                  >
                    {PaymentMethodLabels[data.paymentMethod as keyof typeof PaymentMethodLabels].label}
                  </span>
                </>
              ) : (
                "No especificado"
              )}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Moneda</p>
            <p className="font-medium">
              {data.currency ? CurrencyLabels[data.currency as keyof typeof CurrencyLabels] : "No especificado"}
            </p>
            {data.exchangeRate && <p className="text-xs text-muted-foreground">T.C: {data.exchangeRate}</p>}
          </div>
        </div>

        {data.schedule && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-1">Cronograma/Notas</p>
            <p className="text-sm bg-muted p-3 rounded">{data.schedule}</p>
          </div>
        )}

        {data.bankName && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-1">Banco</p>
            <p className="font-medium">{data.bankName}</p>
          </div>
        )}
      </div>

      {/* Información de vencimiento */}
      <div className={`bg-card rounded-lg p-5 border-l-4 ${isExpired ? "border-red-500" : "border-chart-3"}`}>
        <h4 className="flex items-center font-semibold mb-4">
          <Clock className={`h-5 w-5 mr-2 ${isExpired ? "text-red-500" : "text-chart-3"}`} />
          Vencimiento
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Fecha de Vencimiento</p>
            <p className={`font-medium ${isExpired ? "text-red-600" : ""}`}>
              {data.expiresAt
                ? format(parseISO(data.expiresAt), "dd 'de' MMMM yyyy", { locale: es })
                : "No especificado"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Estado de Vencimiento</p>
            <div className="flex items-center">
              {isExpired ? (
                <Badge variant="destructive" className="text-xs">
                  Vencida
                </Badge>
              ) : daysLeft === 0 ? (
                <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                  Vence hoy
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                  Vigente
                </Badge>
              )}
            </div>
          </div>
        </div>

        {isExpired && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              <strong>Atención:</strong> Esta reserva ha vencido hace {Math.abs(daysLeft)} días.
            </p>
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="bg-muted rounded-lg p-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Fecha de Reserva</p>
              <p className="font-medium">
                {data.reservationDate
                  ? format(parseISO(data.reservationDate), "dd MMM yyyy", { locale: es })
                  : "No disponible"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
