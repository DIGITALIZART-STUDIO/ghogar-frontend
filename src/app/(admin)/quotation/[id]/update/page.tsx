import Link from "next/link";

import { GetAssignedLeadsSummary } from "@/app/(admin)/leads/_actions/LeadActions";
import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { backend, wrapper } from "@/types/backend";
import { GetQuotationById } from "../../_actions/QuotationActions";
import UpdateClientQuotationPage from "./_components/UpdateClientQuotationPage";

export default async function UpdateQuotationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Obtener datos del usuario actual desde la API
    const [userData, errorUser] = await wrapper((auth) => backend.GET("/api/Users", auth));

    if (errorUser || !userData) {
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

    // Usar el ID del usuario obtenido de la API
    const userId = userData.user.id;

    if (!userId) {
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

    const [leadsAssignedResult, leadsAssignedError] = await GetAssignedLeadsSummary(userId);

    // Manejar el error si ocurre al obtener las cotizaciones
    if (leadsAssignedError) {
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

    const [quotationResult, error] = await GetQuotationById(id);

    if (error) {
        return (
            <div>
                <HeaderPage
                    title="Actualización de Cotización"
                    description="Ingrese la información requerida para actualizar la cotización"
                />
                <ErrorGeneral />
            </div>
        );
    } // Formateo especial de los datos según el requisito
    const data = quotationResult;

    const leadsData = leadsAssignedResult;

    if (!data) {
        return (
            <div>
                <HeaderPage
                    title="Actualización de Cotización"
                    description="Ingrese la información requerida para actualizar la cotización"
                />
            </div>
        );
    }

    const code = data.code ?? "0";
    const projectName = data.projectName ?? "Proyecto";
    const clientName = data.leadClientName ?? "Cliente";

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
            <UpdateClientQuotationPage advisorId={userId} data={data} leadsData={leadsData} />
        </div>
    );
}
