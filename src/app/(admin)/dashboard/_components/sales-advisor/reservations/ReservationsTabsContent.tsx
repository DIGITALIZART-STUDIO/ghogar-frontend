"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle, DollarSign, Eye, MapPin, MessageSquare, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TabsContent } from "@/components/ui/tabs";
import { SalesAdvisorDashboard } from "../../../_types/dashboard";
import { PaymentMethodLabels, ReservationStatusLabels } from "../../../../reservations/_utils/reservations.utils";
import { EmptyState } from "../../EmptyState";

interface ReservationsTabsContentProps {
  data: SalesAdvisorDashboard | undefined;
  isLoading: boolean;
}

export default function ReservationsTabsContent({ data, isLoading }: ReservationsTabsContentProps) {
  const router = useRouter();
  const hasReservations = data?.myReservations && data.myReservations.length > 0;

  if (isLoading) {
    return (
      <TabsContent value="reservations" className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="reservations" className="space-y-6">
      {/* Mis reservaciones */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
                <DollarSign className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">
                  Mis Reservaciones
                </CardTitle>
                <CardDescription>Tus reservaciones activas y gestionadas</CardDescription>
              </div>
            </div>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => router.push("/reservations")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Reservación
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!hasReservations ? (
            <EmptyState icon={DollarSign} title="Sin reservaciones" description="No has gestionado reservaciones aún" />
          ) : (
            <div className="space-y-4">
              {data?.myReservations?.map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-100">{reservation.clientName}</h4>
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {reservation.projectName} - Lote {reservation.lotNumber}
                        </span>
                        <span>Fecha: {reservation.reservationDate}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {(() => {
                          const statusConfig =
                            ReservationStatusLabels[reservation.status as keyof typeof ReservationStatusLabels];
                          const StatusIcon = statusConfig?.icon || CheckCircle;
                          return (
                            <Badge
                              className={`text-xs ${statusConfig?.className || "bg-slate-600 hover:bg-slate-700"} flex items-center gap-1`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig?.label || reservation.status}
                            </Badge>
                          );
                        })()}
                        {(() => {
                          const paymentConfig =
                            PaymentMethodLabels[reservation.paymentMethod as keyof typeof PaymentMethodLabels];
                          const PaymentIcon = paymentConfig?.icon || DollarSign;
                          return (
                            <Badge
                              variant="outline"
                              className={`text-xs ${paymentConfig?.className || ""} flex items-center gap-1`}
                            >
                              <PaymentIcon className="w-3 h-3" />
                              {paymentConfig?.label || reservation.paymentMethod}
                            </Badge>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                        {reservation.currency === "SOLES" ? "S/" : "$"}
                        {reservation.amountPaid?.toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Monto pagado</p>
                      <p
                        className={`text-xs font-medium ${
                          new Date(reservation.expiresAt ?? "") < new Date()
                            ? "text-red-600 dark:text-red-400"
                            : new Date(reservation.expiresAt ?? "").getTime() - new Date().getTime() < 86400000
                              ? "text-orange-600 dark:text-orange-400"
                              : "text-green-600 dark:text-green-400"
                        }`}
                      >
                        Vence: {reservation.expiresAt}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      {!reservation.notified && (
                        <Badge variant="destructive" className="text-xs">
                          Sin notificar
                        </Badge>
                      )}
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estados de reservaciones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-green-600">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              <span className="font-medium text-slate-800 dark:text-slate-100">Activas</span>
            </div>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              {data?.myReservations?.filter((r) => r.status === "ISSUED").length ?? 0}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Reservaciones vigentes</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-500 dark:text-orange-400" />
              <span className="font-medium text-slate-800 dark:text-slate-100">Por Vencer</span>
            </div>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              {data?.myReservations?.filter(
                (r) =>
                  new Date(r.expiresAt ?? "").getTime() - new Date().getTime() < 86400000 &&
                  new Date(r.expiresAt ?? "") > new Date()
              ).length ?? 0}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">En las próximas 24h</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-6 h-6 text-primary" />
              <span className="font-medium text-slate-800 dark:text-slate-100">Monto Total</span>
            </div>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              S/{data?.myReservations?.reduce((sum, r) => sum + (r.amountPaid ?? 0), 0).toLocaleString() ?? 0}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">En reservaciones</p>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
}
