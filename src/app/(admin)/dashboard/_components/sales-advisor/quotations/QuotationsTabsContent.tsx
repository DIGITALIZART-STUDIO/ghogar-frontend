"use client";

import { CheckCircle, DollarSign, Edit, Eye, FileText, MapPin, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "../../EmptyState";
import { SalesAdvisorDashboard } from "../../../_types/dashboard";

interface QuotationsTabsContentProps {
    data: SalesAdvisorDashboard | undefined;
    isLoading: boolean;
}

export default function QuotationsTabsContent({ data, isLoading }: QuotationsTabsContentProps) {
    const hasQuotations = data?.myQuotations && data.myQuotations.length > 0;

    if (isLoading) {
        return (
            <TabsContent value="quotations" className="space-y-6">
                <div className="flex items-center justify-center py-12">
                    <LoadingSpinner />
                </div>
            </TabsContent>
        );
    }

    return (
        <TabsContent value="quotations" className="space-y-6">
            {/* Mis cotizaciones */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-slate-800 dark:text-slate-100">Mis Cotizaciones</CardTitle>
                            <CardDescription>Cotizaciones generadas basadas en Quotation model</CardDescription>
                        </div>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Plus className="w-4 h-4 mr-2" />
                            Nueva Cotización
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {!hasQuotations ? (
                        <EmptyState
                            icon={FileText}
                            title="Sin cotizaciones"
                            description="No has generado cotizaciones aún"
                        />
                    ) : (
                        <div className="space-y-4">
                            {data?.myQuotations?.map((quotation) => (
                                <div
                                    key={quotation.id}
                                    className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-slate-800 dark:text-slate-100">
                                                {quotation.code}
                                            </h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{quotation.clientName}</p>
                                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {quotation.projectName} - Lote {quotation.lotNumber}
                                                </span>
                                                <span>Fecha: {quotation.quotationDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                                ${quotation.finalPrice?.toLocaleString()} {quotation.currency}
                                            </p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                Original: ${quotation.totalPrice?.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Válida hasta: {quotation.validUntil}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <Badge
                                                className={`${
                                                    quotation.status === "ISSUED"
                                                        ? "bg-slate-600 hover:bg-slate-700"
                                                        : quotation.status === "ACCEPTED"
                                                            ? "bg-green-600 hover:bg-green-700"
                                                            : "bg-red-500 hover:bg-red-600"
                                                } text-white`}
                                            >
                                                {quotation.status}
                                            </Badge>
                                            <div className="flex gap-1">
                                                <Button variant="outline" size="sm">
                                                    <Eye className="w-3 h-3" />
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="w-3 h-3" />
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

            {/* Estados de cotizaciones */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-slate-600">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                            <span className="font-medium text-slate-800 dark:text-slate-100">Emitidas</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            {data?.myQuotations?.filter((q) => q.status === "ISSUED").length ?? 0}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Pendientes de respuesta</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-600">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            <span className="font-medium text-slate-800 dark:text-slate-100">Aceptadas</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            {data?.myQuotations?.filter((q) => q.status === "ACCEPTED").length ?? 0}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Listas para reservar</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <DollarSign className="w-6 h-6 text-primary" />
                            <span className="font-medium text-slate-800 dark:text-slate-100">Valor Total</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            ${data?.myQuotations?.reduce((sum, q) => sum + (q.finalPrice ?? 0), 0).toLocaleString() ?? 0}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">En cotizaciones activas</p>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
    );
}
