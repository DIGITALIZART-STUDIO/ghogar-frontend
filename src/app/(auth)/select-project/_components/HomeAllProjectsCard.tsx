import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Building2, CheckCircle, Globe, Sparkles } from "lucide-react";
import ProjectsCardImage from "@/assets/images/ProjectsCard.webp";

interface HomeAllProjectsCardProps {
    isSelected: boolean;
    onSelect: () => void;
}

export default function HomeAllProjectsCard({ isSelected, onSelect }: HomeAllProjectsCardProps) {
    // Usar la misma imagen por defecto que los proyectos individuales
    const imageSrc = ProjectsCardImage.src ?? "/placeholder.svg";

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
                {/* Imagen de fondo para "Todos los proyectos" */}
                <div className="relative h-40 overflow-hidden">
                    <img
                        src={imageSrc}
                        alt="Todos los proyectos"
                        className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {/* Badge de selección */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        {isSelected && (
                            <Badge className="bg-primary hover:bg-primary/90">
                                <CheckCircle className="mr-1 h-3 w-3 shrink-0" />
                                Seleccionado
                            </Badge>
                        )}
                        <Badge variant="secondary">
                            <Globe className="mr-1 h-3 w-3 shrink-0" />
                            Global
                        </Badge>
                    </div>

                    {/* Información en la imagen */}
                    <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold">Todos los Proyectos</h3>
                        <p className="text-sm text-gray-200 flex items-center">
                            <Globe className="mr-1 h-3 w-3" />
                            Acceso completo
                        </p>
                    </div>
                </div>

                <CardContent className="p-6 pt-0 space-y-4">
                    {/* Información básica */}
                    <div className="flex flex-col gap-2 items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="flex items-center">
                            <Sparkles className="mr-1 h-4 w-4 shrink-0" />
                            Vista Global
                        </span>
                        <span className="flex items-center">
                            <Building2 className="mr-1 h-4 w-4 shrink-0" />
                            Todos los proyectos
                        </span>
                        <span className="flex items-center">
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Sin restricciones
                        </span>
                    </div>

                    {/* Características */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                            <Sparkles className="size-5 text-primary" />
                            <div>
                                <p className="font-medium text-sm">Vista global de todos los proyectos</p>
                                <p className="text-xs text-muted-foreground">Acceso sin restricciones</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                            <Globe className="size-5 text-primary" />
                            <div>
                                <p className="font-medium text-sm">Sin restricciones de proyecto</p>
                                <p className="text-xs text-muted-foreground">Navegación libre</p>
                            </div>
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="pt-2 border-t">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-300">Acceso:</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Completo
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
