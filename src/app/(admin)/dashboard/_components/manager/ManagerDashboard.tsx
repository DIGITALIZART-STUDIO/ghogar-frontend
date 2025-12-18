"use client";

import { useEffect, useState } from "react";
import { BarChart3, Building2, DollarSign, Target, TrendingUp, Users } from "lucide-react";
import { createPortal } from "react-dom";

import { useDashboardManager } from "@/app/(admin)/dashboard/_hooks/useDashboard";
import { Card, CardContent } from "@/components/ui/card";
import { FilterYear } from "@/components/ui/filter-year";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { AlertsTabsContent } from "./alerts/AlertsTabsContent";
import { AnalyticsTabsContent } from "./analytics/AnalyticsTabsContent";
import { OverviewTabsContent } from "./overview/OverviewTabsContent";
import { ProjectsTabsContent } from "./projects/ProjectsTabsContent";
import { TeamTabsContent } from "./team/TeamTabsContent";

export default function ManagerDashboard() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  const { data, isLoading, isError } = useDashboardManager(selectedYear);

  // Buscar el elemento headerContent cuando el componente se monta
  useEffect(() => {
    const findElement = () => {
      const element = document.getElementById("headerContent");
      if (element) {
        setPortalElement(element);
      }
    };

    findElement();

    if (!portalElement) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const foundElement = (node as Element).querySelector("#headerContent");
                if (foundElement) {
                  setPortalElement(foundElement as HTMLElement);
                  observer.disconnect();
                }
              }
            });
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      return () => observer.disconnect();
    }
  }, [portalElement]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 dark:text-red-400">Error al cargar los datos del dashboard</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Por favor, intenta recargar la página</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {portalElement &&
        createPortal(<FilterYear selectedYear={selectedYear} onSelectYear={setSelectedYear} />, portalElement)}

      <div className="space-y-6">
        {/* KPIs Estratégicos Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-10 translate-x-10" />
            <CardContent className="p-4 relative">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-4 h-4 text-primary" />
                    <p className="text-slate-600 text-sm font-medium dark:text-slate-400">Proyectos</p>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {data.kpis?.totalProjects ?? 0}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{data.kpis?.activeProjects ?? 0} activos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-slate-600/5 rounded-full -translate-y-10 translate-x-10" />
            <CardContent className="p-4 relative">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <p className="text-slate-600 text-sm font-medium dark:text-slate-400">Total Leads</p>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{data.kpis?.totalLeads ?? 0}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">En el sistema</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-slate-700/5 rounded-full -translate-y-10 translate-x-10" />
            <CardContent className="p-4 relative">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                    <p className="text-slate-600 text-sm font-medium dark:text-slate-400">Conversión</p>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {(data.kpis?.conversionRate ?? 0).toFixed(1)}%
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tasa global</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-600/5 rounded-full -translate-y-10 translate-x-10" />
            <CardContent className="p-4 relative">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <p className="text-slate-600 text-sm font-medium dark:text-slate-400">Cotizaciones</p>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {data.kpis?.totalQuotations ?? 0}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Generadas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-10 translate-x-10" />
            <CardContent className="p-4 relative">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <p className="text-slate-600 text-sm font-medium dark:text-slate-400">Reservaciones</p>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {data.kpis?.totalReservations ?? 0}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Activas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-600/5 rounded-full -translate-y-10 translate-x-10" />
            <CardContent className="p-4 relative">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <p className="text-slate-600 text-sm font-medium dark:text-slate-400">Revenue</p>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    ${((data.kpis?.totalReservationAmount ?? 0) / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Total reservado</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de contenido */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div>
            <TabsList className="h-auto p-1 border border-card grid w-full grid-cols-5">
              <TabsTrigger
                value="overview"
                className={cn(
                  "relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2"
                )}
              >
                <BarChart3 className="w-4 h-4 shrink-0" />
                <span className="truncate text-ellipsis">Resumen</span>
              </TabsTrigger>

              <TabsTrigger
                value="projects"
                className={cn(
                  "relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2"
                )}
              >
                <Building2 className="w-4 h-4 shrink-0" />
                <span className="truncate text-ellipsis">Proyectos</span>
              </TabsTrigger>

              <TabsTrigger
                value="team"
                className={cn(
                  "relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2"
                )}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span className="truncate text-ellipsis">Equipo</span>
              </TabsTrigger>

              <TabsTrigger
                value="analytics"
                className={cn(
                  "relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2"
                )}
              >
                <TrendingUp className="w-4 h-4 shrink-0" />
                <span className="truncate text-ellipsis">Análisis</span>
              </TabsTrigger>

              <TabsTrigger
                value="alerts"
                className={cn(
                  "relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2"
                )}
              >
                <Target className="w-4 h-4 shrink-0" />
                <span className="truncate text-ellipsis">Alertas</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <OverviewTabsContent data={data} isLoading={isLoading} />
          <ProjectsTabsContent data={data} isLoading={isLoading} />
          <TeamTabsContent data={data} isLoading={isLoading} />
          <AnalyticsTabsContent data={data} isLoading={isLoading} />
          <AlertsTabsContent data={data} isLoading={isLoading} />
        </Tabs>
      </div>
    </div>
  );
}
