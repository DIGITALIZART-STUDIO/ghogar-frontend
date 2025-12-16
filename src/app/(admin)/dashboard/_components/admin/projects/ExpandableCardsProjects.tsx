import { AdminDashboard } from "../../../_types/dashboard";
import { EmptyState } from "../../EmptyState";
import {
    MapPin,
    Building2,
    TrendingUp,
    DollarSign,
    Users,
    Target,
    Home,
    ShoppingCart,
    Eye,
    FileText,
    GripHorizontal,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCallback, useRef, useState } from "react";

interface CardSize {
  width: number
  height: number
}

interface ExpandableCardsProjectsProps {
    data: AdminDashboard;
}

export default function ExpandableCardsProjects({ data }: ExpandableCardsProjectsProps) {
    const [cardSizes, setCardSizes] = useState<Map<number, CardSize>>(new Map());
    const [isResizing, setIsResizing] = useState<number | null>(null);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const resizeRef = useRef<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);

    const handleMouseDown = useCallback((e: React.MouseEvent, index: number) => {
        e.preventDefault();
        setIsResizing(index);

        const card = e.currentTarget.closest(".resizable-card") as HTMLElement;
        const rect = card.getBoundingClientRect();

        resizeRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            startWidth: rect.width,
            startHeight: rect.height,
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!resizeRef.current) {
                return;
            }

            const deltaX = e.clientX - resizeRef.current.startX;
            const deltaY = e.clientY - resizeRef.current.startY;

            // Límites adaptativos - permitir que las cards lleguen al máximo para 2 por fila
            const viewportWidth = window.innerWidth;
            const containerWidth = containerRef.current?.clientWidth ?? viewportWidth - 100;
            const maxCardWidth = Math.floor((containerWidth - 24) / 2); // Máximo permitido para 2 cards por fila

            const newWidth = Math.min(Math.max(resizeRef.current.startWidth + deltaX, 280), maxCardWidth);
            const newHeight = Math.min(Math.max(resizeRef.current.startHeight + deltaY, 320), 650);

            // Actualización optimizada para mejor performance
            setCardSizes((prev) => new Map(prev.set(index, { width: newWidth, height: newHeight })));
        };

        const handleMouseUp = () => {
            setIsResizing(null);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    }, []);
    return (
        <div>
            {!data.projectMetrics || data.projectMetrics.length === 0 ? (
                <EmptyState
                    icon={Building2}
                    title="Sin proyectos registrados"
                    description="No hay proyectos disponibles para mostrar detalles"
                />
            ) : (
                <div className="space-y-6">
                    {/* Contenedor híbrido: flexible como wrap pero controlado */}
                    <div className="w-full" ref={containerRef}>
                        <div
                            className="flex flex-wrap gap-6 items-start justify-start"
                            style={{
                                // Asegurar que las cards no excedan el ancho disponible
                                maxWidth: "100%",
                                alignContent: "flex-start",
                            }}
                        >
                            {data.projectMetrics.map((project, index) => {
                                const cardSize = cardSizes.get(index);
                                const currentWidth = cardSize?.width ?? 320;
                                const currentHeight = cardSize?.height ?? 380;

                                // Lógica mejorada para distribución del espacio
                                const containerAvailableWidth = containerRef.current?.clientWidth ?? window.innerWidth - 100;
                                const gapSize = 24;
                                const maxCardWidthForTwoColumns = Math.floor((containerAvailableWidth - gapSize) / 2);

                                // Si la carta es muy grande para 2 columnas, que use todo el ancho disponible
                                const shouldSpanFullWidth = currentWidth > maxCardWidthForTwoColumns;

                                const totalLots = project.totalLots ?? 0;
                                const hasLots = totalLots > 0;
                                const salesRate = hasLots ? ((project.sold ?? 0) / totalLots) * 100 : 0;
                                const occupancyRate = hasLots
                                    ? (((project.quoted ?? 0) + (project.reserved ?? 0) + (project.sold ?? 0)) / totalLots) * 100
                                    : 0;

                                // Sistema de breakpoints mejorado para contenido adaptativo
                                const breakpoints = {
                                    xs: currentWidth >= 280 && currentHeight >= 320,  // Mínimo
                                    sm: currentWidth >= 340 && currentHeight >= 380,  // Básico
                                    md: currentWidth >= 420 && currentHeight >= 440,  // Intermedio
                                    lg: currentWidth >= 520 && currentHeight >= 500,  // Amplio
                                    xl: currentWidth >= 640 && currentHeight >= 540,  // Expandido
                                    xxl: currentWidth >= 720 && currentHeight >= 580, // Máximo
                                };

                                // Configuración de contenido visible según breakpoints
                                const showContent = {
                                    badges: breakpoints.xs,
                                    quotedReserved: breakpoints.sm,
                                    occupancyProgress: breakpoints.md,
                                    detailedFinancial: breakpoints.lg,
                                    extraDetails: breakpoints.xl,
                                    fullDetails: breakpoints.xxl,
                                    compactMode: currentWidth < 340 || currentHeight < 360,
                                };

                                return (
                                    <Card
                                        key={index}
                                        className={cn(
                                            "resizable-card relative",
                                            isResizing === index && "ring-2 ring-primary/30 z-10",
                                            // Comportamiento flex adaptativo
                                            "flex-shrink-0"
                                        )}
                                        style={{
                                            width: `${currentWidth}px`,
                                            height: `${currentHeight}px`,
                                            minWidth: "280px",
                                            maxWidth: shouldSpanFullWidth ? `${containerAvailableWidth}px` : `${maxCardWidthForTwoColumns}px`,
                                            minHeight: "320px",
                                            maxHeight: "650px",
                                            // Control mejorado del flex-basis
                                            flexBasis: shouldSpanFullWidth ? `${containerAvailableWidth - gapSize}px` : `${currentWidth}px`,
                                            // Si ocupa toda la fila, centrarla
                                            alignSelf: shouldSpanFullWidth ? "center" : "stretch",
                                        }}
                                        onMouseEnter={() => setHoveredCard(index)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        <CardHeader className={cn("pb-3", showContent.compactMode && "pb-2")}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle
                                                        className={cn(
                                                            "font-bold text-foreground flex items-center gap-2 mb-2 leading-tight",
                                                            showContent.compactMode ? "text-sm" : breakpoints.lg ? "text-lg" : "text-base",
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "p-1.5 rounded-lg bg-primary/8 border border-primary/15 flex-shrink-0",
                                                            showContent.compactMode && "p-1"
                                                        )}
                                                        >
                                                            <Building2 className={cn(
                                                                "text-primary",
                                                                showContent.compactMode ? "w-3 h-3 shrink-0" : "w-4 h-4 shrink-0"
                                                            )}
                                                            />
                                                        </div>
                                                        <span className="truncate" title={project.name}>
                                                            {project.name}
                                                        </span>
                                                    </CardTitle>

                                                    {!showContent.compactMode && (
                                                        <CardDescription
                                                            className={cn(
                                                                "flex items-center gap-2",
                                                                breakpoints.lg ? "text-sm" : "text-xs"
                                                            )}
                                                        >
                                                            <MapPin className="w-3 h-3 flex-shrink-0" />
                                                            <span className="truncate" title={project.location}>
                                                                {project.location}
                                                            </span>
                                                        </CardDescription>
                                                    )}
                                                </div>
                                            </div>

                                            {showContent.badges && (
                                                <div className={cn(
                                                    "flex flex-wrap gap-1.5",
                                                    showContent.compactMode ? "mt-1" : "mt-2"
                                                )}
                                                >
                                                    <Badge
                                                        variant="secondary"
                                                        className={cn(
                                                            "bg-slate-100 text-slate-700 border-slate-200 px-2 py-0.5 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
                                                            showContent.compactMode ? "text-xs" : "text-xs"
                                                        )}
                                                    >
                                                        {project.blocks} bloques
                                                    </Badge>
                                                    <Badge
                                                        variant="secondary"
                                                        className={cn(
                                                            "bg-slate-100 text-slate-700 border-slate-200 px-2 py-0.5 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
                                                            showContent.compactMode ? "text-xs" : "text-xs"
                                                        )}
                                                    >
                                                        {project.totalLots} lotes
                                                    </Badge>
                                                    {!hasLots && (
                                                        <Badge variant="outline" className="border-muted-foreground/30 text-xs px-2 py-0.5">
                                                            Sin inventario
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}
                                        </CardHeader>

                                        <CardContent className={cn(
                                            "space-y-3 overflow-hidden",
                                            showContent.compactMode ? "pb-6 px-3" : "pb-8 px-4"
                                        )}
                                        >
                                            {!hasLots ? (
                                                <div className="text-center py-6">
                                                    <div className="p-3 rounded-xl bg-muted/20 inline-block mb-2">
                                                        <Home className={cn(
                                                            "text-muted-foreground",
                                                            showContent.compactMode ? "w-5 h-5" : "w-6 h-6"
                                                        )}
                                                        />
                                                    </div>
                                                    <p className={cn(
                                                        "text-muted-foreground",
                                                        showContent.compactMode ? "text-xs" : "text-sm"
                                                    )}
                                                    >Sin lotes registrados</p>
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Métricas principales - layout adaptativo */}
                                                    <div
                                                        className={cn(
                                                            "grid gap-3",
                                                            showContent.compactMode
                                                                ? "grid-cols-2"
                                                                : breakpoints.xxl
                                                                    ? "grid-cols-4"
                                                                    : showContent.quotedReserved
                                                                        ? "grid-cols-2"
                                                                        : "grid-cols-2",
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "text-center bg-primary/5 border border-primary/10 rounded-lg transition-all duration-200",
                                                            showContent.compactMode ? "p-2" : "p-3",
                                                            "hover:bg-primary/8"
                                                        )}
                                                        >
                                                            <Eye className={cn(
                                                                "text-primary mx-auto mb-2",
                                                                showContent.compactMode ? "w-3 h-3 mb-1" : "w-4 h-4"
                                                            )}
                                                            />
                                                            <p
                                                                className={cn(
                                                                    "font-bold text-primary",
                                                                    showContent.compactMode
                                                                        ? "text-sm"
                                                                        : currentWidth >= 500
                                                                            ? "text-xl"
                                                                            : "text-lg",
                                                                )}
                                                            >
                                                                {project.available}
                                                            </p>
                                                            <p className={cn(
                                                                "text-muted-foreground",
                                                                showContent.compactMode ? "text-xs" : "text-xs"
                                                            )}
                                                            >
                                                                Disponibles
                                                            </p>
                                                        </div>

                                                        <div className={cn(
                                                            "text-center bg-slate-100 border border-slate-200 rounded-lg dark:bg-slate-800 dark:border-slate-700 transition-all duration-200",
                                                            showContent.compactMode ? "p-2" : "p-3",
                                                            "hover:bg-slate-200 dark:hover:bg-slate-700"
                                                        )}
                                                        >
                                                            <ShoppingCart className={cn(
                                                                "mx-auto mb-2 text-slate-600 dark:text-slate-400",
                                                                showContent.compactMode ? "w-3 h-3 mb-1" : "w-4 h-4"
                                                            )}
                                                            />
                                                            <p
                                                                className={cn(
                                                                    "font-bold text-slate-700 dark:text-slate-300",
                                                                    showContent.compactMode
                                                                        ? "text-sm"
                                                                        : currentWidth >= 500
                                                                            ? "text-xl"
                                                                            : "text-lg",
                                                                )}
                                                            >
                                                                {project.sold}
                                                            </p>
                                                            <p className={cn(
                                                                "text-muted-foreground",
                                                                showContent.compactMode ? "text-xs" : "text-xs"
                                                            )}
                                                            >
                                                                Vendidos
                                                            </p>
                                                        </div>

                                                        {showContent.quotedReserved && (
                                                            <>
                                                                <div className="text-center p-3 bg-slate-200 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600">
                                                                    <FileText className="w-4 h-4 mx-auto mb-2 text-slate-600 dark:text-slate-400" />
                                                                    <p
                                                                        className={cn(
                                                                            "font-bold text-slate-700 dark:text-slate-300",
                                                                            currentWidth >= 500 ? "text-xl" : "text-lg",
                                                                        )}
                                                                    >
                                                                        {project.quoted}
                                                                    </p>
                                                                    <p className="text-xs text-muted-foreground">Cotizados</p>
                                                                </div>

                                                                <div className="text-center p-3 bg-slate-300 border border-slate-400 rounded-lg dark:bg-slate-600 dark:border-slate-500">
                                                                    <Users className="w-4 h-4 mx-auto mb-2 text-slate-700 dark:text-slate-300" />
                                                                    <p
                                                                        className={cn(
                                                                            "font-bold text-slate-800 dark:text-slate-200",
                                                                            currentWidth >= 500 ? "text-xl" : "text-lg",
                                                                        )}
                                                                    >
                                                                        {project.reserved}
                                                                    </p>
                                                                    <p className="text-xs text-muted-foreground">Reservados</p>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Progreso de ventas */}
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between mb-2">
                                                            <span className={cn(
                                                                "font-medium flex items-center gap-1.5",
                                                                showContent.compactMode ? "text-xs" : "text-sm"
                                                            )}
                                                            >
                                                                <Target className={cn(
                                                                    "text-primary",
                                                                    showContent.compactMode ? "w-3 h-3" : "w-4 h-4"
                                                                )}
                                                                />
                                                                Tasa de Ventas
                                                            </span>
                                                            <span className={cn(
                                                                "font-bold text-primary",
                                                                showContent.compactMode ? "text-xs" : "text-sm"
                                                            )}
                                                            >
                                                                {salesRate.toFixed(1)}%
                                                            </span>
                                                        </div>
                                                        <Progress
                                                            value={salesRate}
                                                            className={cn(
                                                                showContent.compactMode ? "h-2" : "h-2.5"
                                                            )}
                                                        />
                                                    </div>

                                                    {/* Progreso de ocupación - condicional */}
                                                    {showContent.occupancyProgress && (
                                                        <div>
                                                            <div className="flex justify-between text-sm mb-2">
                                                                <span className="font-medium flex items-center gap-1.5">
                                                                    <TrendingUp className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                                    Ocupación Total
                                                                </span>
                                                                <span className="font-bold text-slate-700 dark:text-slate-300">
                                                                    {occupancyRate.toFixed(1)}%
                                                                </span>
                                                            </div>
                                                            <Progress value={occupancyRate} className="h-2.5" />
                                                        </div>
                                                    )}

                                                    {/* Información financiera */}
                                                    <div className={cn(
                                                        "pt-3 border-t border-slate-200 dark:border-slate-700",
                                                        showContent.compactMode ? "space-y-1" : "space-y-2"
                                                    )}
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <span className={cn(
                                                                "text-muted-foreground flex items-center gap-1.5",
                                                                showContent.compactMode ? "text-xs" : "text-sm"
                                                            )}
                                                            >
                                                                <DollarSign className={cn(
                                                                    showContent.compactMode ? "w-3 h-3" : "w-4 h-4"
                                                                )}
                                                                />
                                                                Ingresos Generados
                                                            </span>
                                                            <span
                                                                className={cn(
                                                                    "font-bold text-primary",
                                                                    showContent.compactMode
                                                                        ? "text-sm"
                                                                        : currentWidth >= 500
                                                                            ? "text-lg"
                                                                            : "text-base",
                                                                )}
                                                            >
                                                                S/ {((project.revenue ?? 0) / 1000).toFixed(1)}K
                                                            </span>
                                                        </div>

                                                        {showContent.detailedFinancial && (
                                                            <>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-sm text-muted-foreground">Precio promedio por lote</span>
                                                                    <span className="text-sm font-semibold">
                                                                        S/ {(project.avgPrice ?? 0).toLocaleString()}
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-sm text-muted-foreground">Eficiencia del proyecto</span>
                                                                    <span className="text-sm font-semibold">{(project.efficiency ?? 0).toFixed(1)}%</span>
                                                                </div>
                                                            </>
                                                        )}

                                                        {showContent.extraDetails && (
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm text-muted-foreground">Promedio lotes por bloque</span>
                                                                <span className="text-sm font-semibold">
                                                                    {(project.blocks ?? 0) > 0 && (project.totalLots ?? 0) > 0 ? Math.round((project.totalLots ?? 0) / (project.blocks ?? 1)) : 0}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {showContent.fullDetails && (
                                                            <>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-sm text-muted-foreground">Porcentaje de ocupación</span>
                                                                    <span className="text-sm font-semibold">
                                                                        {((occupancyRate / 100) * (project.totalLots ?? 0)).toFixed(0)} de{" "}
                                                                        {(project.totalLots ?? 0)} lotes
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-sm text-muted-foreground">Estado del proyecto</span>
                                                                    <Badge variant={(project.sold ?? 0) > 0 ? "default" : "secondary"} className="text-xs">
                                                                        {(project.sold ?? 0) > 0 ? "Con ventas" : "Sin ventas"}
                                                                    </Badge>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </CardContent>

                                        {/* Handle de redimensionamiento mejorado */}
                                        <div
                                            className={cn(
                                                "absolute bottom-2 right-2 w-6 h-6 cursor-se-resize",
                                                "hover:bg-slate-200 rounded-lg transition-all duration-200",
                                                "flex items-center justify-center group border border-slate-300",
                                                "hover:border-slate-400 dark:hover:bg-slate-700 dark:border-slate-600",
                                                "hover:scale-105 active:scale-95",
                                                isResizing === index && "bg-slate-300 border-slate-500 scale-105",
                                                // Mejora la visibilidad del handle
                                                hoveredCard === index && "opacity-100",
                                                hoveredCard !== null && hoveredCard !== index && "opacity-40"
                                            )}
                                            onMouseDown={(e) => handleMouseDown(e, index)}
                                        >
                                            <GripHorizontal
                                                className={cn(
                                                    "text-slate-500 group-hover:text-slate-700 rotate-45 dark:text-slate-400 dark:group-hover:text-slate-200 transition-all duration-200",
                                                    "w-3 h-3",
                                                    isResizing === index && "text-slate-700 dark:text-slate-200"
                                                )}
                                            />
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
