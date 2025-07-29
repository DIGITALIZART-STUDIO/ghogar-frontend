"use client";

import React from "react";
import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import CreateReservationPage from "./_components/CreateReservationPage";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAcceptedQuotationsByAdvisor } from "@/app/(admin)/quotation/_hooks/useQuotations";
import { useUsers } from "../../admin/users/_hooks/useUser";

export default function CreateReservationPageWrapper() {
    // Los hooks siempre deben ir aquí, nunca dentro de un if
    const { data: userData, isLoading: loadingUser, error: userError } = useUsers();
    // Si el usuario existe, obtenemos su id, si no, undefined
    const userId = userData?.user?.id;
    // El hook de cotizaciones se llama siempre, pero solo se activa si hay userId
    const { data: quotationsData = [], isLoading: loadingQuotations, error: quotationsError } = useAcceptedQuotationsByAdvisor(userId ?? "", !!userId);

    // Loading usuario
    if (loadingUser) {
        return (
            <div>
                <div className="mb-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href="/reservations">Separaciones</Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbPage>Crear</BreadcrumbPage>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <HeaderPage
                    title="Crear Separación"
                    description="Ingrese la información requerida para generar una nueva separación de lote"
                />
                <LoadingSpinner text="Cargando usuario..." />
            </div>
        );
    }

    // Error usuario
    if (userError || !userId) {
        return (
            <div>
                <div className="mb-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href="/reservations">Separaciones</Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbPage>Crear</BreadcrumbPage>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <HeaderPage
                    title="Crear Separación"
                    description="Ingrese la información requerida para generar una nueva separación de lote"
                />
                <ErrorGeneral />
            </div>
        );
    }

    // Loading cotizaciones
    if (loadingQuotations) {
        return (
            <div>
                <div className="mb-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href="/reservations">Separaciones</Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbPage>Crear</BreadcrumbPage>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <HeaderPage
                    title="Crear Separación"
                    description="Ingrese la información requerida para generar una nueva separación de lote"
                />
                <LoadingSpinner text="Cargando cotizaciones..." />
            </div>
        );
    }

    // Error cotizaciones
    if (quotationsError) {
        return (
            <div>
                <div className="mb-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href="/reservations">Separaciones</Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbPage>Crear</BreadcrumbPage>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <HeaderPage
                    title="Crear Separación"
                    description="Ingrese la información requerida para generar una nueva separación de lote"
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
                            <Link href="/reservations">Separaciones</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbPage>Crear</BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <HeaderPage
                title="Crear Separación"
                description="Ingrese la información requerida para generar una nueva separación de lote"
            />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <CreateReservationPage quotationsData={quotationsData} />
            </div>
        </div>
    );
}
