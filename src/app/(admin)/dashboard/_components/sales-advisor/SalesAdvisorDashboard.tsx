"use client";

import { Activity, BarChart3, Calendar, ClipboardList, DollarSign, FileText, Target, User, UserCheck } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { FilterYear } from "@/components/ui/filter-year";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useDashboardSalesAdvisor } from "../../_hooks/useDashboard";
import LeadsTabsContent from "./leads/LeadsTabsContent";
import PerformanceTabsContent from "./performance/PerformanceTabsContent";
import QuotationsTabsContent from "./quotations/QuotationsTabsContent";
import ReservationsTabsContent from "./reservations/ReservationsTabsContent";
import TasksTabsContent from "./tasks/TasksTabsContent";

export default function SalesAdvisorDashboard() {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [activeTab, setActiveTab] = useState("leads");
    const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
    const { data, isLoading } = useDashboardSalesAdvisor(selectedYear);

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
                subtree: true
            });

            return () => observer.disconnect();
        }
    }, [portalElement]);

    return (
        <div>
            {portalElement &&
            createPortal(
                <FilterYear selectedYear={selectedYear} onSelectYear={setSelectedYear} />,
                portalElement
            )}
            <div className="space-y-6">
                {/* KPIs Personales siguiendo el patrón del sistema */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    <Card className="relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-slate-500/5 rounded-full -translate-y-10 translate-x-10" />
                        <CardContent className="p-4 relative">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                        <p className="text-slate-600 text-sm font-medium dark:text-slate-400">Mis Leads</p>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{data?.myLeads?.total ?? 0}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Asignados</p>
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
                                        <Activity className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                                        <p className="text-slate-600 text-sm font-medium dark:text-slate-400">En Seguimiento</p>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{data?.myLeads?.inFollowUp ?? 0}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Activos</p>
                                    </div>
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
                                        <FileText className="w-4 h-4 text-slate-800 dark:text-slate-200" />
                                        <p className="text-slate-600 text-sm font-medium dark:text-slate-400">Cotizaciones</p>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{data?.performance?.quotationsIssued ?? 0}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Generadas</p>
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
                                        <DollarSign className="w-4 h-4 text-primary" />
                                        <p className="text-slate-600 text-sm font-medium dark:text-slate-400">Reservaciones</p>
                                    </div>
                                    <p className="text-2xl font-bold text-primary">{data?.performance?.reservationsGenerated ?? 0}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Logradas</p>
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
                                        <Target className="w-4 h-4 text-slate-500 dark:text-slate-500" />
                                        <p className="text-slate-600 text-sm font-medium dark:text-slate-400">Conversión</p>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{data?.performance?.conversionRate ?? 0}%</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Mi tasa</p>
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
                                        <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        <p className="text-slate-600 text-sm font-medium dark:text-slate-400">Tareas Hoy</p>
                                    </div>
                                    <p className="text-2xl font-bold text-green-700 dark:text-green-400">{data?.performance?.tasksPending ?? 0}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Pendientes</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs organizadas */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="h-auto p-1 border border-card grid w-full grid-cols-5 ">
                        <TabsTrigger
                            value="leads"
                            className={cn(
                                "relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2",
                            )}
                        >
                            <UserCheck className="w-4 h-4 shrink-0" />
                            <span className="truncate text-ellipsis">Mis Leads</span>
                        </TabsTrigger>

                        <TabsTrigger
                            value="tasks"
                            className={cn(
                                "relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 ",
                            )}
                        >
                            <ClipboardList className="w-4 h-4 shrink-0" />
                            <span className="truncate text-ellipsis">Mis Tareas</span>
                        </TabsTrigger>

                        <TabsTrigger
                            value="quotations"
                            className={cn(
                                "relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2",
                            )}
                        >
                            <FileText className="w-4 h-4 shrink-0" />
                            <span className="truncate text-ellipsis">Cotizaciones</span>
                        </TabsTrigger>

                        <TabsTrigger
                            value="reservations"
                            className={cn(
                                "relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2",
                            )}
                        >
                            <Calendar className="w-4 h-4 shrink-0" />
                            <span className="truncate text-ellipsis">Reservaciones</span>
                        </TabsTrigger>

                        <TabsTrigger
                            value="performance"
                            className={cn(
                                "relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2",
                            )}
                        >
                            <BarChart3 className="w-4 h-4" />
                            <span className="truncate text-ellipsis">Mi Rendimiento</span>
                        </TabsTrigger>

                    </TabsList>

                    <LeadsTabsContent data={data ?? {}} isLoading={isLoading} />
                    <TasksTabsContent data={data ?? {}} isLoading={isLoading} />
                    <QuotationsTabsContent data={data ?? {}} isLoading={isLoading} />
                    <ReservationsTabsContent data={data ?? {}} isLoading={isLoading} />
                    <PerformanceTabsContent data={data ?? {}} isLoading={isLoading} />
                </Tabs>
            </div>
        </div>
    );
}
