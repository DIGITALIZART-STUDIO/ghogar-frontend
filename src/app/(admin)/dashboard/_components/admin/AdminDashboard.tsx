"use client";

import { useEffect, useState } from "react";
import { Building2, DollarSign, FileText, MapPin, TrendingUp, UserCheck, Users } from "lucide-react";
import { createPortal } from "react-dom";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FilterYear } from "@/components/ui/filter-year";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useDashboardAdmin } from "../../_hooks/useDashboard";
import { AdminDashboard } from "../../_types/dashboard";
import ClientsTabsContent from "./clients/ClientsTabsContent";
import LeadsTabsContent from "./leads/LeadsTabsContent";
import OverviewTabsContent from "./overview/OverviewTabsContent";
import PaymentsTabsContent from "./payments/PaymentsTabsContent";
import ProjectsTabsContent from "./projects/ProjectsTabsContent";
import TeamTabsContent from "./team/TeamTabsContent";

export default function AdminDashboardComponent() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState("overview");
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  const { data, isLoading } = useDashboardAdmin(selectedYear);

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

  return (
    <div>
      {portalElement &&
        createPortal(<FilterYear selectedYear={selectedYear} onSelectYear={setSelectedYear} />, portalElement)}

      <div className="space-y-4">
        {/* Header con métricas principales rediseñado */}
        <div className="mb-4">
          {/* KPIs principales rediseñados */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-slate-500/5 rounded-full -translate-y-10 translate-x-10" />
              <CardContent className="p-4 relative">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      <p className="text-slate-600 text-sm font-medium dark:text-slate-400">Proyectos</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{data?.totalProjects}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge
                        variant="secondary"
                        className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {data?.totalBlocks} bloques
                      </Badge>
                    </div>
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
                      <MapPin className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                      <p className="text-slate-600 text-sm font-medium dark:text-slate-400">Lotes</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {(data?.totalLots ?? 0).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge
                        variant="secondary"
                        className="text-xs bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
                      >
                        Inventario total
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden ">
              <div className="absolute top-0 right-0 w-20 h-20 bg-slate-700/5 rounded-full -translate-y-10 translate-x-10" />
              <CardContent className="p-4 relative">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-slate-800 dark:text-slate-200" />
                      <p className="text-slate-600 text-sm font-medium dark:text-slate-400">Clientes</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {(data?.totalClients ?? 0).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge
                        variant="secondary"
                        className="text-xs bg-slate-300 text-slate-900 dark:bg-slate-600 dark:text-slate-100"
                      >
                        Base de datos
                      </Badge>
                    </div>
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
                      <UserCheck className="w-4 h-4 text-primary" />
                      <p className="text-slate-600 text-sm font-medium dark:text-slate-400">Leads</p>
                    </div>
                    <p className="text-2xl font-bold text-primary">{data?.activeLeads}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                        Activos
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-slate-400/5 rounded-full -translate-y-10 translate-x-10" />
              <CardContent className="p-4 relative">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-slate-500 dark:text-slate-500" />
                      <p className="text-slate-600 text-sm font-medium dark:text-slate-400">Cotizaciones</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{data?.activeQuotations}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge
                        variant="secondary"
                        className="text-xs bg-slate-400/10 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300"
                      >
                        Emitidas
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-full -translate-y-10 translate-x-10" />
              <CardContent className="p-4 relative">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <p className="text-slate-600 text-sm font-medium dark:text-slate-400">Ingresos</p>
                    </div>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                      S/ {(data?.annualRevenue ?? 0).toFixed(1)}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge
                        variant="secondary"
                        className="text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      >
                        Este mes
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs principales rediseñados */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div>
            <TabsList className="h-auto p-1 border border-card grid w-full grid-cols-6 ">
              <TabsTrigger
                value="overview"
                className={cn(
                  "relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2"
                )}
              >
                <TrendingUp className="w-4 h-4 shrink-0" />
                <span className="truncate text-ellipsis">Resumen</span>
              </TabsTrigger>

              <TabsTrigger
                value="projects"
                className={cn(
                  "relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 "
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
                value="leads"
                className={cn(
                  "relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2"
                )}
              >
                <UserCheck className="w-4 h-4 shrink-0" />
                <span className="truncate text-ellipsis">Leads & Ventas</span>
              </TabsTrigger>

              <TabsTrigger
                value="clients"
                className={cn(
                  "relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2"
                )}
              >
                <Users className="w-4 h-4" />
                <span className="truncate text-ellipsis">Clientes</span>
              </TabsTrigger>

              <TabsTrigger
                value="payments"
                className={cn(
                  "relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2"
                )}
              >
                <DollarSign className="w-4 h-4 shrink-0" />
                <span className="truncate text-ellipsis">Pagos</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <OverviewTabsContent data={data as AdminDashboard} isLoading={isLoading} />
          <ProjectsTabsContent data={data as AdminDashboard} isLoading={isLoading} />
          <TeamTabsContent teamData={data?.teamData ?? []} isLoading={isLoading} />
          <LeadsTabsContent data={data as AdminDashboard} isLoading={isLoading} />
          <ClientsTabsContent data={data as AdminDashboard} isLoading={isLoading} />
          <PaymentsTabsContent data={data as AdminDashboard} isLoading={isLoading} />
        </Tabs>
      </div>
    </div>
  );
}
