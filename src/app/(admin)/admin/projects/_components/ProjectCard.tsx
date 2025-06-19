import Link from "next/link";
import { ArrowRight, Building2, Calendar, DollarSign, MapPin } from "lucide-react";

import ProjectsCardImage from "@/assets/images/ProjectsCard.webp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectData } from "../_types/project";

interface ProjectCardProps {
  project: ProjectData;
}

export function ProjectCard({ project }: ProjectCardProps) {
    // Guard clause - Si no hay proyecto, retorna null o un componente de loading
    if (!project) {
        return null;
    }

    // Valores por defecto basados en el DTO real del backend
    const safeProject = {
        id: project.id ?? "",
        name: project.name ?? "Sin nombre",
        location: project.location ?? "Sin ubicación",
        currency: project.currency ?? "COP",
        totalBlocks: project.totalBlocks ?? 0,
        createdAt: project.createdAt ?? new Date().toISOString(),
        isActive: project.isActive ?? false,
        // Usar los nombres correctos del DTO
        availableLots: project.availableLots ?? 0,
        soldLots: project.soldLots ?? 0,
        totalLots: project.totalLots ?? 0,
        quotedLots: project.quotedLots ?? 0,
        reservedLots: project.reservedLots ?? 0,
    };

    const completionRate =
    safeProject.totalLots > 0 ? Math.round((safeProject.soldLots / safeProject.totalLots) * 100) : 0;

    return (
        <Card className="overflow-hidden hover-lift border-0 pt-0 bg-white dark:bg-gray-950">
            {/* Project Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={ProjectsCardImage.src}
                    alt={safeProject.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 right-4">
                    <Badge
                        variant={safeProject.isActive ? "default" : "secondary"}
                        className={safeProject.isActive ? "bg-green-500 hover:bg-green-600" : ""}
                    >
                        {safeProject.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">
                        {safeProject.name}
                    </h3>
                    <p className="text-sm text-gray-200 flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        {safeProject.location}
                    </p>
                </div>
            </div>

            <CardContent className="p-6 space-y-4">
                {/* Project Info */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex items-center">
                        <DollarSign className="mr-1 h-4 w-4" />
                        {safeProject.currency}
                    </span>
                    <span className="flex items-center">
                        <Building2 className="mr-1 h-4 w-4" />
                        {safeProject.totalBlocks}
                        {" "}
                        manzanas
                    </span>
                    <span className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        {new Date(safeProject.createdAt).getFullYear()}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">
                            Progreso de ventas
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {completionRate}
                            %
                        </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700 ease-out"
                            style={{ width: `${completionRate}%` }}
                        />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                            {safeProject.availableLots}
                        </div>
                        <div className="text-xs text-green-700">
                            Disponibles
                        </div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-lg font-bold text-yellow-600">
                            {safeProject.reservedLots}
                        </div>
                        <div className="text-xs text-yellow-700">
                            Reservados
                        </div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-lg font-bold text-red-600">
                            {safeProject.soldLots}
                        </div>
                        <div className="text-xs text-red-700">
                            Vendidos
                        </div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                            {safeProject.quotedLots}
                        </div>
                        <div className="text-xs text-blue-700">
                            Cotizados
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link href={`/admin/projects/${safeProject.id}/blocks`}>
                            Ver Bloques
                        </Link>
                    </Button>
                    <Button asChild size="sm" className="flex-1">
                        <Link href={`/admin/projects/lots?projectId=${safeProject.id}`}>
                            Ver Lotes
                            <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
