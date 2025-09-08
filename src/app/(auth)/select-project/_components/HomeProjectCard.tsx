import { ProjectData } from "@/app/(admin)/admin/projects/_types/project";
import { Building2,  CheckCircle, MapPin, DollarSign, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ProjectsCardImage from "@/assets/images/ProjectsCard.webp";

interface HomeProjectCardProps {
      project: ProjectData;
    isSelected: boolean;
    onSelect: () => void;
}

export default function HomeProjectCard({ project, isSelected, onSelect }: HomeProjectCardProps) {
    // Valores por defecto basados en el DTO real del backend (igual que ProjectCard.tsx)
    const safeProject = {
        id: project.id ?? "",
        name: project.name ?? "Sin nombre",
        location: project.location ?? "Sin ubicación",
        currency: project.currency ?? "COP",
        totalBlocks: project.totalBlocks ?? 0,
        createdAt: project.createdAt ?? new Date().toISOString(),
        isActive: project.isActive ?? false,
        availableLots: project.availableLots ?? 0,
        soldLots: project.soldLots ?? 0,
        totalLots: project.totalLots ?? 0,
        quotedLots: project.quotedLots ?? 0,
        reservedLots: project.reservedLots ?? 0,
        defaultDownPayment: project.defaultDownPayment ?? 0,
        defaultFinancingMonths: project.defaultFinancingMonths ?? 0,
        maxDiscountPercentage: project.maxDiscountPercentage ?? 0,
        projectUrlImage: project.projectUrlImage ?? null,
    };

    const completionRate = safeProject.totalLots > 0 ? Math.round((safeProject.soldLots / safeProject.totalLots) * 100) : 0;

    // Determinar qué imagen usar (igual que ProjectCard.tsx)
    const imageSrc = safeProject.projectUrlImage ?? ProjectsCardImage.src ?? "/placeholder.svg";

    return (
        <div className="transition-all duration-300 hover:scale-105">
            <Card
                className={cn(
                    "overflow-hidden hover-lift border-0 pt-0 bg-white dark:bg-gray-950 cursor-pointer transition-all duration-300",
                    isSelected
                        ? "ring-2 ring-primary shadow-lg shadow-primary/20"
                        : "hover:shadow-md"
                )}
                onClick={onSelect}
            >
                {/* Project Image - Mismo diseño que ProjectCard.tsx */}
                <div className="relative h-40 overflow-hidden">
                    <img
                        src={imageSrc}
                        alt={safeProject.name}
                        className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {/* Badge de selección */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        {isSelected && (
                            <Badge className="bg-primary hover:bg-primary/90">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Seleccionado
                            </Badge>
                        )}
                        <Badge
                            variant={safeProject.isActive ? "default" : "secondary"}
                            className={safeProject.isActive ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                            {safeProject.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                    </div>

                    {/* Información del proyecto en la imagen */}
                    <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold">{safeProject.name}</h3>
                        <p className="text-sm text-gray-200 flex items-center">
                            <MapPin className="mr-1 h-3 w-3" />
                            {safeProject.location}
                        </p>
                    </div>
                </div>

                <CardContent className="p-6 space-y-4">
                    {/* Project Info - Mismo diseño que ProjectCard.tsx */}
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                        <span className="flex items-center">
                            <DollarSign className="mr-1 h-4 w-4" />
                            {safeProject.currency}
                        </span>
                        <span className="flex items-center">
                            <Building2 className="mr-1 h-4 w-4" />
                            {safeProject.totalBlocks} manzanas
                        </span>
                        <span className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            {new Date(safeProject.createdAt).getFullYear()}
                        </span>
                    </div>

                    {/* Progress Bar - Mismo diseño que ProjectCard.tsx */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-300">Progreso de ventas</span>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">{completionRate}%</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700 ease-out"
                                style={{ width: `${completionRate}%` }}
                            />
                        </div>
                    </div>

                    {/* Stats Grid - Mismo diseño que ProjectCard.tsx */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-lg font-bold text-green-600">{safeProject.availableLots}</div>
                            <div className="text-xs text-green-700">Disponibles</div>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                            <div className="text-lg font-bold text-yellow-600">{safeProject.reservedLots}</div>
                            <div className="text-xs text-yellow-700">Reservados</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                            <div className="text-lg font-bold text-red-600">{safeProject.soldLots}</div>
                            <div className="text-xs text-red-700">Vendidos</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-lg font-bold text-blue-600">{safeProject.quotedLots}</div>
                            <div className="text-xs text-blue-700">Cotizados</div>
                        </div>
                    </div>

                    {/* Información adicional de financiamiento */}
                    {(safeProject.defaultDownPayment > 0 || safeProject.defaultFinancingMonths > 0) && (
                        <div className="space-y-2 pt-2 border-t">
                            {safeProject.defaultDownPayment > 0 && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-300">Descuento:</span>
                                    <Badge variant="outline">{safeProject.defaultDownPayment}%</Badge>
                                </div>
                            )}
                            {safeProject.defaultFinancingMonths > 0 && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-300">Financiamiento:</span>
                                    <Badge variant="outline">{safeProject.defaultFinancingMonths} meses</Badge>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

