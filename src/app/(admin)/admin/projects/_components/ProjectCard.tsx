"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Calendar, DollarSign, Edit, MapPin, MoreVertical, Power, PowerOff } from "lucide-react";
import { toast } from "sonner";

import ProjectsCardImage from "@/assets/images/ProjectsCard.webp";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useActivateProject, useDeactivateProject } from "../_hooks/useProjects";
import type { ProjectData } from "../_types/project";
import { UpdateProjectsSheet } from "./update/UpdateProjectsSheet";

interface ProjectCardProps {
  project: ProjectData;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [openUpdateProject, setOpenUpdateProject] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const activateProject = useActivateProject();
  const deactivateProject = useDeactivateProject();
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

    defaultDownPayment: project.defaultDownPayment ?? 0,
    defaultFinancingMonths: project.defaultFinancingMonths ?? 0,
    maxDiscountPercentage: project.maxDiscountPercentage ?? 0,
    projectUrlImage: project.projectUrlImage ?? null,
  };

  const completionRate =
    safeProject.totalLots > 0 ? Math.round((safeProject.soldLots / safeProject.totalLots) * 100) : 0;

  // Determinar qué imagen usar
  const imageSrc = safeProject.projectUrlImage ?? ProjectsCardImage.src ?? "/placeholder.svg";

  const handleToggleStatus = async () => {
    setIsToggling(true);
    try {
      if (safeProject.isActive) {
        // Desactivar proyecto
        const promise = deactivateProject.mutateAsync({
          params: {
            path: { id: safeProject.id },
          },
        });

        toast.promise(promise, {
          loading: "Desactivando proyecto...",
          success: `El proyecto ${safeProject.name} ha sido desactivado`,
          error: (e) => `Error al desactivar el proyecto: ${e.message}`,
        });

        await promise;
        // Actualiza el estado local del proyecto
        project.isActive = false;
      } else {
        // Activar proyecto
        const promise = activateProject.mutateAsync({
          params: {
            path: { id: safeProject.id },
          },
        });

        toast.promise(promise, {
          loading: "Activando proyecto...",
          success: `El proyecto ${safeProject.name} ha sido activado`,
          error: (e) => `Error al activar el proyecto: ${e.message}`,
        });

        await promise;
        // Actualiza el estado local del proyecto
        project.isActive = true;
      }
    } catch (error) {
      // Este catch es para errores inesperados
      console.error("Error inesperado:", error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleEdit = () => {
    setOpenUpdateProject(true);
  };

  return (
    <Card className="overflow-hidden hover-lift border-0 pt-0 bg-white dark:bg-gray-950">
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden group">
        <img
          src={imageSrc}
          alt={safeProject.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Estado sutil con indicador de punto */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${safeProject.isActive ? "bg-green-400" : "bg-gray-400"}`} />
        </div>

        {/* Botón de acciones - más elegante y discreto */}
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white hover:text-white transition-all duration-200"
              >
                <span className="sr-only">Abrir menú</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit />
                  Editar
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {safeProject.isActive ? (
                  <DropdownMenuItem variant="destructive" onClick={handleToggleStatus} disabled={isToggling}>
                    <PowerOff />
                    Desactivar
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={handleToggleStatus} disabled={isToggling}>
                    <Power />
                    Activar
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Información del proyecto */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold drop-shadow-lg">{safeProject.name}</h3>
              <p className="text-sm text-gray-200 flex items-center mt-1 drop-shadow-md">
                <MapPin className="mr-1 h-3 w-3" />
                {safeProject.location}
              </p>
            </div>
            {/* Estado visible pero discreto */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <div className={`h-1.5 w-1.5 rounded-full ${safeProject.isActive ? "bg-green-400" : "bg-gray-400"}`} />
              <span className="text-xs font-medium">{safeProject.isActive ? "Activo" : "Inactivo"}</span>
            </div>
          </div>
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
            {safeProject.totalBlocks} manzanas
          </span>
          <span className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            {new Date(safeProject.createdAt).getFullYear()}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">Progreso de ventas</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{completionRate}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-700 ease-out"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
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

        {/* Action Button */}
        <div className="pt-2">
          <Button asChild size="sm" className="w-full" disabled={isToggling}>
            <Link href={`/admin/projects/${safeProject.id}/blocks`}>
              Ver Manzanas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
      {openUpdateProject && (
        <UpdateProjectsSheet project={safeProject} onOpenChange={setOpenUpdateProject} open={openUpdateProject} />
      )}
    </Card>
  );
}
