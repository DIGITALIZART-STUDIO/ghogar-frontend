"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { BarChart3, Building2, Home, TrendingUp, Loader2, Search, X } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

import { HeaderPage } from "@/components/common/HeaderPage";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { usePaginatedAllProjectsWithSearch } from "./_hooks/useProjects";
import { CreateProjectsDialog } from "./_components/create/CreateProjectsDialog";
import { ProjectCard } from "./_components/ProjectCard";
import { StatsCard } from "./_components/StatsCard";
import { ProjectData } from "./_types/project";
import { Input } from "@/components/ui/input";

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

export default function ProjectsPage() {
    // Usar el hook para obtener proyectos con paginación infinita
    const {
        allProjects: projects,
        handleScrollEnd,
        isLoading,
        isError,
        hasNextPage,
        isFetchingNextPage,
        handleSearchChange,
        search,
        resetSearch
    } = usePaginatedAllProjectsWithSearch(9); // 9 proyectos por página

    // Estado local para el input de búsqueda
    const [searchInput, setSearchInput] = useState("");

    // Ref para mantener el foco en el input
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Callback con debounce para búsqueda (igual que en AutoComplete)
    const debouncedSearch = useDebouncedCallback((term: string) => {
        if (term !== "None" && term !== null && term !== undefined) {
            handleSearchChange(term.trim());
        } else {
            handleSearchChange("");
        }
    }, 300); // 300ms de debounce como en AutoComplete

    // Función para manejar cambios en el input de búsqueda
    const handleInputChange = useCallback((value: string) => {
        setSearchInput(value);
        debouncedSearch(value);

        // Mantener el foco después del cambio
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [debouncedSearch]);

    // Función para limpiar la búsqueda
    const handleClearSearch = useCallback(() => {
        setSearchInput("");
        resetSearch();

        // Mantener el foco después de limpiar
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [resetSearch]);

    // Sincronizar el input local con el estado del hook (igual que en AutoComplete)
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
            <div>
                <HeaderPage title="Panel Inmobiliario" description="Gestiona tus proyectos inmobiliarios" />
                <LoadingSpinner text="Cargando proyectos..." />
            </div>
        );
    }

    // Mostrar error si hay algún problema
    if (isError) {
        return (
            <div>
                <HeaderPage title="Panel Inmobiliario" description="Gestiona tus proyectos inmobiliarios" />
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                    <Building2 className="w-12 h-12 text-red-400 mb-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        Error al cargar proyectos
                    </h3>
                    <p className="text-gray-500">
                        Ha ocurrido un error al cargar los proyectos. Inténtalo de nuevo.
                    </p>
                </div>
            </div>
        );
    }

    // Calcular estadísticas usando los datos reales del backend
    const stats = getOverallStats(projects ?? []);

    return (
        <div>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <HeaderPage title="Panel Inmobiliario" description="Gestiona tus proyectos inmobiliarios" />
                <CreateProjectsDialog />
            </div>

            <div className="space-y-6 pt-4">
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
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                        <HeaderPage title="Tus Proyectos" description="Administra y monitorea el progreso de cada desarrollo" />

                        {/* Buscador creativo */}
                        <div className="relative w-full lg:w-80">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Buscar proyectos por nombre o ubicación..."
                                    value={searchInput}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
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

                            {/* Indicador de resultados */}
                            {search && (
                                <div className="mt-2 text-sm text-muted-foreground">
                                    {projects.length > 0 ? (
                                        <span>
                                            {projects.length} proyecto{projects.length !== 1 ? "s" : ""} encontrado{projects.length !== 1 ? "s" : ""} para &quot;{search}&quot;
                                        </span>
                                    ) : (
                                        <span>No se encontraron proyectos para &quot;{search}&quot;</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {projects && projects.length > 0 ? (
                            projects.map((project: ProjectData) => <ProjectCard key={project.id} project={project} />)
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center gap-3 col-span-full">
                                <Building2 className="w-12 h-12 text-gray-400 mb-2" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                    {search ? "No se encontraron proyectos" : "No hay proyectos disponibles"}
                                </h3>
                                <p className="text-gray-500">
                                    {search
                                        ? `No se encontraron proyectos que coincidan con "${search}". Intenta con otros términos de búsqueda.`
                                        : "Crea tu primer proyecto inmobiliario para comenzar a gestionar lotes y ventas."
                                    }
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

                    {/* Indicador de carga para más proyectos */}
                    {isFetchingNextPage && (
                        <div className="flex justify-center items-center py-8">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">Cargando más proyectos...</span>
                            </div>
                        </div>
                    )}

                    {/* Elemento invisible para detectar scroll infinito */}
                    {hasNextPage && (
                        <div ref={loadMoreRef} className="h-4" />
                    )}
                </div>
            </div>
        </div>
    );
}
