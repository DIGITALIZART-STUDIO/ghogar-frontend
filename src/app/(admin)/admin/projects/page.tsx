import { BarChart3, Building2, Home, TrendingUp } from "lucide-react";

import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { GetAllProjects } from "./_actions/ProjectActions";
import { CreateProjectsDialog } from "./_components/create/CreateProjectsDialog";
import { ProjectCard } from "./_components/ProjectCard";
import { StatsCard } from "./_components/StatsCard";
import { ProjectData } from "./_types/project";

// Función para calcular estadísticas usando los datos del DTO
function getOverallStats(projects: Array<ProjectData>) {
    if (!projects || projects.length === 0) {
        return {
            totalProjects: 0,
            activeProjects: 0,
            totalLots: 0,
            available: 0,
            reserved: 0,
            sold: 0,
            quoted: 0,
        };
    }

    return {
        totalProjects: projects.length,
        activeProjects: projects.filter((p) => p.isActive).length,
        totalLots: projects.reduce((sum, project) => sum + (project.totalLots ?? 0), 0),
        available: projects.reduce((sum, project) => sum + (project.availableLots ?? 0), 0),
        reserved: projects.reduce((sum, project) => sum + (project.reservedLots ?? 0), 0),
        sold: projects.reduce((sum, project) => sum + (project.soldLots ?? 0), 0),
        quoted: projects.reduce((sum, project) => sum + (project.quotedLots ?? 0), 0),
    };
}

export default async function ProjectsPage() {
    // Llamada a la API para obtener todos los proyectos
    const [result, error] = await GetAllProjects();

    if (error) {
        return (
            <div>
                <HeaderPage title="Panel Inmobiliario" description="Gestiona tus proyectos inmobiliarios" />
                <ErrorGeneral />
            </div>
        );
    }

    // Calcular estadísticas usando los datos reales del backend
    const stats = getOverallStats(result);

    return (
        <div>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <HeaderPage title="Panel Inmobiliario" description="Gestiona tus proyectos inmobiliarios" />
                <CreateProjectsDialog />
            </div>

            <div className="space-y-6">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Proyectos Activos"
                        value={stats.activeProjects}
                        total={stats.totalProjects}
                        icon={Building2}
                        gradient="gradient-purple"
                        description="proyectos en desarrollo"
                    />
                    <StatsCard
                        title="Lotes Disponibles"
                        value={stats.available}
                        total={stats.totalLots}
                        icon={Home}
                        gradient="gradient-green"
                        description="listos para venta"
                    />
                    <StatsCard
                        title="Lotes Vendidos"
                        value={stats.sold}
                        total={stats.totalLots}
                        icon={TrendingUp}
                        gradient="gradient-orange"
                        description="transacciones completadas"
                    />
                    <StatsCard
                        title="En Proceso"
                        value={stats.reserved + stats.quoted}
                        total={stats.totalLots}
                        icon={BarChart3}
                        gradient="gradient-teal"
                        description="reservados y cotizados"
                    />
                </div>

                {/* Projects Grid */}
                <div>
                    <HeaderPage title="Tus Proyectos" description="Administra y monitorea el progreso de cada desarrollo" />

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {result?.length > 0 ? (
                            result.map((project) => <ProjectCard key={project.id} project={project} />)
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center gap-3 col-span-full">
                                <Building2 className="w-12 h-12 text-gray-400 mb-2" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                    No hay proyectos disponibles
                                </h3>
                                <p className="text-gray-500">
                                    Crea tu primer proyecto inmobiliario para comenzar a gestionar lotes y ventas.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
