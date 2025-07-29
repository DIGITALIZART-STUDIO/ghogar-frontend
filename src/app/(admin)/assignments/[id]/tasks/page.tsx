"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import ManageLeadTasks from "./_components/ManageLeadTasks";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useTasksByLead } from "./_hooks/useLeadTasks";

export default function TaskPage() {
    // Obtener el id del lead desde los params de la ruta
    const params = useParams();
    const leadId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

    // Hook para obtener las tareas del lead
    const { data, isLoading, isError } = useTasksByLead(leadId);

    // Obtener nombre del cliente si está disponible
    const clientName = data?.lead?.client?.name ?? "Cliente";
    const assignedToId = data?.lead?.assignedToId ?? "0";

    if (isLoading) {
        return (
            <div>
                <HeaderPage title="Tareas del Lead" description="Gestión de tareas asociadas al lead seleccionado." />
                <LoadingSpinner text="Cargando tareas..." />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div>
                <HeaderPage title="Tareas del Lead" description="Gestión de tareas asociadas al lead seleccionado." />
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
                            <Link href="/assignments">
                                Mis Leads
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem className="capitalize">
                            <Link href={"/assignments"}>
                                Lead: {clientName}
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbPage>
                            Tareas
                        </BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <HeaderPage
                title={`Tareas del Lead: ${clientName}`}
                description={`Lista de tareas programadas asociadas al cliente ${clientName}.`}
            />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <ManageLeadTasks data={data} leadId={leadId} assignedToId={assignedToId} />
            </div>
        </div>
    );
}
