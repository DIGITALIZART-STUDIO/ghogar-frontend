
import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";

import { GetProject } from "../../../_actions/ProjectActions";
import { BlocksClient } from "./BlocksClient";

export default async function BlocksServerComponent({ id }: { id: string }) {
    // Solo obtener datos del proyecto
    const [projectResult, projectError] = await GetProject(id);

    if (projectError || !id) {
        return (
            <div className="space-y-6">
                <HeaderPage title={"Manzanas"} description={"Sin ubicación"} />
                <ErrorGeneral />
            </div>
        );
    }

    const project = projectResult;

    return (
        <div className="space-y-6">

            <BlocksClient projectId={id} project={project} />
        </div>
    );
}
