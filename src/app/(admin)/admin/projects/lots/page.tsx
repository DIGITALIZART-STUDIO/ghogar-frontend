import LotsDataProvider from "./_components/LotsDataProvider";

type LotsPageProps = {
  searchParams: Promise<{
    blockId?: string;
    projectId?: string;
  }>;
};

export default async function LotsPage({ searchParams }: LotsPageProps) {
    const { blockId, projectId } = await searchParams;

    // Títulos y descripciones por defecto
    let title = "Gestión de Lotes";
    let description = "Administra todos los lotes de tus proyectos inmobiliarios";

    if (blockId) {
        title = "Lotes - Manzana";
        description = "Administra los lotes de la manzana";
    } else if (projectId) {
        title = "Lotes - Proyecto";
        description = "Administra todos los lotes del proyecto";
    }

    // No mostrar el botón de crear si no tenemos un projectId válido
    const canCreateLot = !!(projectId ?? blockId);

    return (
        <LotsDataProvider
            blockId={blockId}
            projectId={projectId}
            title={title}
            description={description}
            canCreateLot={canCreateLot}
        />
    );
}
