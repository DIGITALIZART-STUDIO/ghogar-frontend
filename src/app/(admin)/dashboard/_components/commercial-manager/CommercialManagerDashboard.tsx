"use client";

import { useEffect, useState } from "react";
import { Activity, BarChart3, TrendingUp, Users } from "lucide-react";
import { createPortal } from "react-dom";

import { useDashboardCommercialManager } from "@/app/(admin)/dashboard/_hooks/useDashboard";
import { Card, CardContent } from "@/components/ui/card";
import { FilterYear } from "@/components/ui/filter-year";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import TeamTabsContent from "../admin/team/TeamTabsContent";
import { LeadsTabsContent } from "../supervisor/leads/LeadsTabsContent";
import { OverviewTabsContent } from "../supervisor/overview/OverviewTabsContent";
import { PerformanceTabsContent } from "../supervisor/performance/PerformanceTabsContent";

export default function CommercialManagerDashboard() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  // Obtener datos del dashboard
  const { data, isLoading, isError } = useDashboardCommercialManager(selectedYear);

  // Buscar el elemento headerContent cuando el componente se monta
  useEffect(() => {
    const findElement = () => {
      const element = document.getElementById("headerContent");
      if (element) {
        setPortalElement(element);
      }
    };

    // Buscar inmediatamente
    findElement();

    // Si no existe, usar MutationObserver para detectar cuando se crea
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
        {/* Header con KPIs principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Leads Totales</p>
                  <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                    {data.leadsKpi?.totalLeads ?? 0}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {data.leadsKpi?.unassignedLeads ?? 0} sin asignar
                  </p>
                </div>
                <Users className="w-10 h-10 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-slate-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">En Seguimiento</p>
                  <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                    {data.leadsKpi?.inFollowUpLeads ?? 0}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Leads activos</p>
                </div>
                <Activity className="w-10 h-10 text-slate-600 dark:text-slate-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Tasa de Conversión</p>
                  <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                    {(data.teamMetrics?.avgConversionRate ?? 0).toFixed(1)}%
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Promedio del equipo</p>
                </div>
                <TrendingUp className="w-10 h-10 text-slate-700 dark:text-slate-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Completados</p>
                  <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                    {data.leadsKpi?.completedLeads ?? 0}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {(((data.leadsKpi?.completedLeads ?? 0) / (data.leadsKpi?.totalLeads ?? 1)) * 100).toFixed(1)}% del
                    total
                  </p>
                </div>
                <BarChart3 className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de contenido */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div>
            <TabsList className="h-auto p-1 border border-card grid w-full grid-cols-4">
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
                value="team"
                className={cn(
                  "relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2"
                )}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span className="truncate text-ellipsis">Equipo</span>
              </TabsTrigger>

              <TabsTrigger
                value="leads"
                className={cn(
                  "relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2"
                )}
              >
                <Activity className="w-4 h-4 shrink-0" />
                <span className="truncate text-ellipsis">Leads</span>
              </TabsTrigger>

              <TabsTrigger
                value="performance"
                className={cn(
                  "relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2"
                )}
              >
                <TrendingUp className="w-4 h-4 shrink-0" />
                <span className="truncate text-ellipsis">Rendimiento</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <OverviewTabsContent data={data} isLoading={isLoading} />
          <TeamTabsContent teamData={data.teamData ?? []} isLoading={isLoading} />
          <LeadsTabsContent data={data} isLoading={isLoading} />
          <PerformanceTabsContent data={data} isLoading={isLoading} />
        </Tabs>
      </div>
    </div>
  );
}
