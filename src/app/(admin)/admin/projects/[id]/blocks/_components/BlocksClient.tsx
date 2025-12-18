"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Filter, Home, Loader2, Search, X } from "lucide-react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useActivateBlock, useBlocks, useDeactivateBlock } from "../_hooks/useBlocks";
import { BlockData } from "../_types/block";
import { ProjectData } from "../../../_types/project";
import { BlockCard } from "./BlockCard";
import { CreateBlocksDialog } from "./create/CreateBlocksDialog";

interface BlocksClientProps {
  projectId: string;
  project: ProjectData;
}

export function BlocksClient({ projectId, project }: BlocksClientProps) {
  // Usar el hook paginado para obtener bloques con búsqueda
  const {
    allBlocks: blocks,
    handleScrollEnd,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    handleSearchChange,
    search,
    resetSearch,
  } = useBlocks(projectId, 9); // 9 bloques por página

  const [isPending, startTransition] = useTransition();

  // Estado local para el input de búsqueda
  const [searchInput, setSearchInput] = useState("");

  // Ref para mantener el foco en el input
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activateBlock = useActivateBlock();
  const deactivateBlock = useDeactivateBlock();

  // Callback con debounce para búsqueda (300ms como en projects)
  const debouncedSearch = useDebouncedCallback((term: string) => {
    if (term !== "None" && term !== null && term !== undefined) {
      handleSearchChange(term.trim());
    } else {
      handleSearchChange("");
    }
  }, 300);

  // Función para manejar cambios en el input de búsqueda
  const handleInputChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      debouncedSearch(value);

      // Mantener el foco después del cambio
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    },
    [debouncedSearch]
  );

  // Función para limpiar la búsqueda
  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    resetSearch();

    // Mantener el foco después de limpiar
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [resetSearch]);

  // Sincronizar el input local con el estado del hook
  useEffect(() => {
    if (!search) {
      setSearchInput("");
    }
  }, [search]);

  // Mantener el foco en el input durante la búsqueda
  useEffect(() => {
    if (searchInputRef.current && searchInput && !isLoading) {
      // Pequeño delay para asegurar que el re-render haya terminado
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [searchInput, isLoading]);

  // Ref para el elemento que detectará cuando hacer scroll infinito
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Intersection Observer para detectar cuando el usuario llega al final
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          handleScrollEnd();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // Cargar cuando esté a 100px del final
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, handleScrollEnd]);

  // Mostrar loading spinner mientras carga
  if (isLoading) {
    return (
      <div className="space-y-6">
        <HeaderPage
          title={`Manzanas - ${project?.name ?? "Sin nombre"}`}
          description={project?.location ?? "Sin ubicación"}
        />
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Cargando manzanas...</span>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error si ocurre
  if (isError) {
    return (
      <div className="space-y-6">
        <HeaderPage
          title={`Manzanas - ${project?.name ?? "Sin nombre"}`}
          description={project?.location ?? "Sin ubicación"}
        />
        <ErrorGeneral />
      </div>
    );
  }

  const handleToggleActive = (blockId: string, isActive: boolean) => {
    startTransition(async () => {
      try {
        if (isActive) {
          // Activar bloque
          const promise = activateBlock.mutateAsync({
            params: {
              path: { id: blockId },
            },
          });

          toast.promise(promise, {
            loading: "Activando manzana...",
            success: "Manzana activada exitosamente",
            error: (e) => `Error al activar manzana: ${e.message}`,
          });

          await promise;
        } else {
          // Desactivar bloque
          const promise = deactivateBlock.mutateAsync({
            params: {
              path: { id: blockId },
            },
          });

          toast.promise(promise, {
            loading: "Desactivando manzana...",
            success: "Manzana desactivada exitosamente",
            error: (e) => `Error al desactivar manzana: ${e.message}`,
          });

          await promise;
        }
      } catch (error) {
        // Este catch es para errores inesperados
        console.error("Error inesperado:", error);
      }
    });
  };

  return (
    <>
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
        <CreateBlocksDialog projectId={projectId} refetch={refetch} />
      </div>
      <div className="space-y-6">
        {/* Buscador */}
        <div className="w-full gap-4">
          <Card className="border pt-0">
            <CardHeader className="my-4">
              <CardTitle className="text-xl flex items-center mt-2">
                <Filter className="mr-2 h-5 w-5 text-primary" />
                Filtros de Búsqueda
              </CardTitle>
              <CardDescription>Encuentra manzanas específicas usando los filtros disponibles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Buscar manzana por nombre..."
                    value={searchInput}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  {searchInput && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Indicador de resultados */}
          {search && (
            <div className="mt-2 text-sm text-muted-foreground">
              {blocks.length > 0 ? (
                <span>
                  {blocks.length} manzana{blocks.length !== 1 ? "s" : ""} encontrada{blocks.length !== 1 ? "s" : ""}{" "}
                  para &quot;{search}&quot;
                </span>
              ) : (
                <span>No se encontraron manzanas para &quot;{search}&quot;</span>
              )}
            </div>
          )}
        </div>

        {/* Resultados */}
        {blocks && blocks.length > 0 ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {blocks.map((block: BlockData) => (
                <BlockCard
                  key={block.id}
                  block={block}
                  projectId={projectId}
                  onToggleActive={handleToggleActive}
                  isLoading={isPending}
                  refetch={refetch}
                />
              ))}
            </div>

            {/* Indicador de carga para más bloques */}
            {isFetchingNextPage && (
              <div className="flex justify-center items-center py-8">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Cargando más manzanas...</span>
                </div>
              </div>
            )}

            {/* Elemento invisible para detectar scroll infinito */}
            {hasNextPage && <div ref={loadMoreRef} className="h-4" />}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <Home className="w-12 h-12 text-gray-400 mb-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {search ? "No se encontraron manzanas" : "No hay manzanas disponibles"}
            </h3>
            <p className="text-gray-500">
              {search
                ? `No se encontraron manzanas que coincidan con "${search}". Intenta con otros términos de búsqueda.`
                : "No hay manzanas disponibles para este proyecto."}
            </p>
            {search && (
              <button
                onClick={handleClearSearch}
                className="mt-2 px-4 py-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
