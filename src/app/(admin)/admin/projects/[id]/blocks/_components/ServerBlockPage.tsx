
import Link from "next/link";

import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { GetProject } from "../../../_actions/ProjectActions";
import { GetBlocksByProject } from "../_actions/BlockActions";
import { BlocksClient } from "./BlocksClient";
import { CreateBlocksDialog } from "./create/CreateBlocksDialog";

export default async function BlocksServerComponent({ id }: { id: string }) {
    // Obtener datos del proyecto y bloques
    const [projectResult, projectError] = await GetProject(id);
    const [blocksResult, blocksError] = await GetBlocksByProject(id);

    if (projectError || blocksError || !id) {
        return (
            <div className="space-y-6">
                <HeaderPage title={"Manzanas"} description={"Sin ubicación"} />
                <ErrorGeneral />
            </div>
        );
    }

    const project = projectResult;
    const blocks = blocksResult ?? [];

    return (
        <div className="space-y-6">
            <div className="mb-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link href="/admin/projects">Proyectos</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem className="capitalize">
                            <Link href={"/admin/projects"}>{project?.name}</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbPage>Manzanas</BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <HeaderPage
                        title={`Manzanas - ${project?.name ?? "Sin nombre"}`}
                        description={project?.location ?? "Sin ubicación"}
                    />
                </div>
                <CreateBlocksDialog projectId={id} />
            </div>

            <BlocksClient blocks={blocks} projectId={id} />
        </div>
    );
}
