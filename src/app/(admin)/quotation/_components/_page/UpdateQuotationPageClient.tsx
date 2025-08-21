"use client";

import React from "react";
import Link from "next/link";
import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useQuotationById } from "../../_hooks/useQuotations";
import { useAvailableLeadsForQuotation } from "@/app/(admin)/leads/_hooks/useLeads";
import UpdateClientQuotationPage from "../../[id]/update/_components/UpdateClientQuotationPage";
import { SummaryLead } from "@/app/(admin)/leads/_types/lead";

interface UpdateQuotationPageClientProps {
    quotationId: string;
}

export default function UpdateQuotationPageClient({ quotationId }: UpdateQuotationPageClientProps) {

    // Obtener cotización
    const { data: quotationData, error: errorQuotation, isLoading: loadingQuotation } = useQuotationById(quotationId);

    const { data: leadsData, error: errorLeads, isLoading: loadingLeads } = useAvailableLeadsForQuotation(quotationId);

    // Loading
    if (loadingQuotation || loadingLeads) {
        return (
            <div>
                <HeaderPage
                    title="Actualización de Cotización"
                    description="Ingrese la información requerida para actualizar la cotización"
                />
                <LoadingSpinner text="Cargando información..." />
            </div>
        );
    }

    // Error
    if (errorQuotation || errorLeads) {
        return (
            <div>
                <HeaderPage
                    title="Actualización de Cotización"
                    description="Ingrese la información requerida para actualizar la cotización"
                />
                <ErrorGeneral />
            </div>
        );
    }

    // Sin datos de cotización
    if (!quotationData) {
        return (
            <div>
                <HeaderPage
                    title="Actualización de Cotización"
                    description="Ingrese la información requerida para actualizar la cotización"
                />
                <ErrorGeneral />
            </div>
        );
    }

    const code = quotationData.code ?? "0";
    const projectName = quotationData.projectName ?? "Proyecto";
    const clientName = quotationData.leadClientName ?? "Cliente";

    return (
        <div>
            <div className="mb-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link href="/quotation">
                                Cotizaciones
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem className="capitalize">
                            <Link href={"/quotation"}>
                                Actualizar
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbPage>
                            {projectName}
                        </BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <HeaderPage
                title={`Actualización de Cotización: ${code}`}
                description={`Ingrese la información requerida para actualizar la cotización de ${clientName}.`}
            />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0" />
            <UpdateClientQuotationPage data={quotationData} leadsData={leadsData as Array<SummaryLead>} />
        </div>
    );
}
