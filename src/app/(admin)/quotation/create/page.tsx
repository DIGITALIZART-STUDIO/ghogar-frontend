"use client";

import React from "react";
import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { useAvailableLeadsForQuotation } from "../../leads/_hooks/useLeads";
import CreateClientQuotationPage from "./_components/CreateClientQuotationPage";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useUsers } from "../../admin/users/_hooks/useUser";
import { SummaryLead } from "../../leads/_types/lead";

export default function CreateQuotationPage() {
    const { data: userData, isLoading: loadingUser, isError: errorUser } = useUsers();
    // Obtener userId aunque sea undefined
    const userId = userData?.user?.id ?? "";

    const { data: leadsData, isLoading: loadingLeads, isError: errorLeads } = useAvailableLeadsForQuotation(userId);

    if (loadingUser) {
        return (
            <div>
                <HeaderPage
                    title="Creación de Cotizaciones"
                    description="Ingrese la información requerida para generar una nueva cotización"
                />
                <LoadingSpinner text="Cargando usuario..." />
            </div>
        );
    }

    if (errorUser || !userId) {
        return (
            <div>
                <HeaderPage
                    title="Creación de Cotizaciones"
                    description="Ingrese la información requerida para generar una nueva cotización"
                />
                <ErrorGeneral />
            </div>
        );
    }

    if (loadingLeads) {
        return (
            <div>
                <HeaderPage
                    title="Creación de Cotizaciones"
                    description="Ingrese la información requerida para generar una nueva cotización"
                />
                <LoadingSpinner text="Cargando leads disponibles..." />
            </div>
        );
    }

    if (errorLeads) {
        return (
            <div>
                <HeaderPage
                    title="Creación de Cotizaciones"
                    description="Ingrese la información requerida para generar una nueva cotización"
                />
                <ErrorGeneral />
            </div>
        );
    }

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
                        <BreadcrumbPage>
                            Crear
                        </BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <HeaderPage
                title="Creación de Cotizaciones"
                description="Ingrese la información requerida para generar una nueva cotización"
            />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <CreateClientQuotationPage leadsData={leadsData as Array<SummaryLead>} advisorId={userId} />
            </div>
        </div>
    );
}
