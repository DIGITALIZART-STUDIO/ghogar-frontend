import React from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Ban, Calendar, Clock, CreditCard, DollarSign, MapPin, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Quotation, QuotationStatus } from "../../_types/quotation";
import { QuotationStatusLabels } from "../../_utils/quotations.utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface QuotationViewContentProps {
  data?: Quotation;
  isLoading: boolean;
  calculateMonthlyPayment: () => number;
  daysLeft: number;
}

export default function QuotationViewContent({
    data,
    isLoading,
    calculateMonthlyPayment,
    daysLeft,
}: QuotationViewContentProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
                <LoadingSpinner text="Cargando datos de cotización..." />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground">
                <Ban className="h-8 w-8 mb-2" />
                <p className="font-semibold">No hay datos disponibles</p>
                <p className="text-sm">No se encontró información para esta cotización.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 font-montserrat">
            {/* Encabezado con información principal */}
            <div className="rounded-lg bg-card p-6 text-card-foreground">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">
                        {data.code}
                    </h3>
                    {data.status && QuotationStatusLabels[data.status as QuotationStatus] ? (
                        <Badge variant="outline" className={QuotationStatusLabels[data.status as QuotationStatus].className}>
                            {React.createElement(QuotationStatusLabels[data.status as QuotationStatus].icon, {
                                className: "size-4 flex-shrink-0 mr-1",
                            })}
                            {QuotationStatusLabels[data.status as QuotationStatus].label}
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
                            <p className="text-sm text-muted-foreground">
                                Cliente
                            </p>
                            <p className="font-medium">
                                {data.leadClientName}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Proyecto
                            </p>
                            <p className="font-medium">
                                {data.projectName}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">
                            {data.quotationDate ? format(parseISO(data.quotationDate), "dd 'de' MMMM yyyy", { locale: es }) : "No disponible"}
                        </span>
                    </div>

                    <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">
                            {daysLeft > 0 ? `${daysLeft} días restantes` : "Expirada"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Información del lote */}
            <div className="bg-card rounded-lg p-5 border-l-4 border-chart-2">
                <h4 className="flex items-center font-semibold mb-4">
                    <MapPin className="h-5 w-5 mr-2 text-chart-2" />
                    Información del Lote
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Manzana
                        </p>
                        <p className="font-medium">
                            {data.blockName}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Lote
                        </p>
                        <p className="font-medium">
                            {data.lotNumber}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Área
                        </p>
                        <p className="font-medium">
                            {data.areaAtQuotation}
                            {" "}
                            m²
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Precio/m²
                        </p>
                        <p className="font-medium">
                            $
                            {data.pricePerM2AtQuotation}
                        </p>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                            Ubicación
                        </span>
                        <span className="font-medium">
                            Manzana
                            {" "}
                            {data.blockName}
                            , Lote
                            {data.lotNumber}
                        </span>
                    </div>
                </div>
            </div>

            {/* Información financiera */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card rounded-lg p-5 border-l-4 border-primary">
                    <h4 className="flex items-center font-semibold mb-4">
                        <DollarSign className="h-5 w-5 mr-2 text-primary" />
                        Precios
                    </h4>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                Precio Total
                            </span>
                            <span className="font-medium">
                                $
                                {(data?.totalPrice ?? 0).toLocaleString()}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                Descuento
                            </span>
                            <span className="font-medium text-chart-1">
                                -$
                                {(data.discount ?? 0).toLocaleString()}
                            </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border">
                            <span className="font-medium">
                                Precio Final
                            </span>
                            <span className="font-bold text-lg">
                                $
                                {(data?.finalPrice ?? 0).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>
                                Tipo de Cambio
                            </span>
                            <span>
                                $
                                {data.exchangeRate}
                                {" "}
                                USD
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-lg p-5 border-l-4 border-chart-3">
                    <h4 className="flex items-center font-semibold mb-4">
                        <CreditCard className="h-5 w-5 mr-2 text-chart-3" />
                        Financiamiento
                    </h4>

                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-muted-foreground">
                                    Inicial (
                                    {data.downPayment}
                                    %)
                                </span>
                                <span className="font-medium">
                                    $
                                    {Math.round(((data?.finalPrice ?? 0) * (data?.downPayment ?? 0)) / 100).toLocaleString()}
                                </span>
                            </div>
                            <Progress value={data.downPayment} className="h-2 bg-muted" indicatorClassName="bg-chart-3" />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-muted-foreground">
                                    A Financiar
                                </span>
                                <span className="font-medium">
                                    $
                                    {(data.amountFinanced ?? 0).toLocaleString()}
                                </span>
                            </div>
                            <Progress
                                value={100 - (data.downPayment ?? 0)}
                                className="h-2 bg-muted"
                                indicatorClassName="bg-chart-3"
                            />
                        </div>

                        <div className="pt-3 border-t border-border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-sm text-muted-foreground">
                                        Plazo
                                    </span>
                                    <div className="font-medium">
                                        {data.monthsFinanced}
                                        {" "}
                                        meses
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span className="text-sm text-muted-foreground">
                                        Cuota Mensual
                                    </span>
                                    <div className="font-bold text-lg">
                                        $
                                        {calculateMonthlyPayment().toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información adicional */}
            <div className="bg-muted rounded-lg p-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <User className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Asesor
                            </p>
                            <p className="font-medium">
                                {data.advisorName}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Válido hasta
                            </p>
                            <p className="font-medium">
                                {data.validUntil ? format(parseISO(data.validUntil), "dd MMM yyyy", { locale: es }) : "No disponible"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
