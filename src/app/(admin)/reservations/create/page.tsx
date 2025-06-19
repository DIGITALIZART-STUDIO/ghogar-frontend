import React from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";

export default async function CreateReservationPage() {
    return (
        <div>
            <div className="mb-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link href="/reservations">
                                Separaciones
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
                title="Crear Separación"
                description="Ingrese la información requerida para generar una nueva separación de lote"
            />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <div className="bg-card rounded-lg border p-6">
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-muted-foreground mb-2">
                            Formulario de Creación
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            El formulario de creación de separaciones estará disponible próximamente.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}