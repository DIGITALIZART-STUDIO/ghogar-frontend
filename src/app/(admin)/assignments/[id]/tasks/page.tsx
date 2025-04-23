import Link from "next/link";

import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { GetTasksByLead } from "./_actions/LeadTaskActions";
import ManageLeadTasks from "./_components/ManageLeadTasks";

export default async function TaskPage({ params }: { params: Promise<{ id: string }> }) {
    // Cargar datos directamente en el servidor
    const { id } = await params;
    const [tasksResult, error] = await GetTasksByLead(id);

    if (error) {
        return (
            <div>
                <HeaderPage title="Tareas del Lead" description="Gestión de tareas asociadas al lead seleccionado." />
                <ErrorGeneral />
            </div>
        );
    } // Formateo especial de los datos según el requisito
    const data = tasksResult;

    if (!data) {
        return (
            <div>
                <HeaderPage title="Tareas del Lead" description="Gestión de tareas asociadas al lead seleccionado." />
                <ErrorGeneral />
            </div>
        );
    }

    // Ahora accedemos al nombre del cliente desde el nuevo tipo
    const clientName = data.lead?.client?.name ?? "Cliente";
    const leadId = data.lead?.id ?? "0";
    const assignedToId = data.lead?.assignedToId ?? "0";

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
                                Lead:
                                {clientName}
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
                {/* Utiliza data en lugar de tasksData.tasks si es necesario */}
                <ManageLeadTasks data={data} leadId={leadId} assignedToId={assignedToId} />
            </div>
        </div>
    );
}
