"use client";

import { Building2, DollarSign, FileText, MapPin, UserCheck, Users, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useDashboardAdmin } from "../../_hooks/useDashboard";
import OverviewTabsContent from "./overview/OverviewTabsContent";
import ProjectsTabsContent from "./projects/ProjectsTabsContent";
import TeamTabsContent from "./team/TeamTabsContent";
import LeadsTabsContent from "./leads/LeadsTabsContent";
import ClientsTabsContent from "./clients/ClientsTabsContent";
import PaymentsTabsContent from "./payments/PaymentsTabsContent";
import { cn } from "@/lib/utils";
import { AdminDashboard } from "../../_types/dashboard";

export default function AdminDashboardComponent() {
    const { data, isLoading } = useDashboardAdmin(2025);

    return (
        <div>
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
                                            S/ {((data?.monthlyRevenue ?? 0) / 1000000).toFixed(1)}M
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
                <Tabs defaultValue="overview" className="space-y-6">
                    <div>
                        <TabsList className="h-auto p-1 border border-card grid w-full grid-cols-6 ">
                            <TabsTrigger
                                value="overview"
                                className={cn(
                                    "relative px-4 py-3 text-sm font-medium transition-all duration-200",
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>Resumen</span>
                                </div>
                            </TabsTrigger>

                            <TabsTrigger
                                value="projects"
                                className={cn(
                                    "relative px-4 py-3 text-sm font-medium transition-all duration-200",
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    <span>Proyectos</span>
                                </div>
                            </TabsTrigger>

                            <TabsTrigger
                                value="team"
                                className={cn(
                                    "relative px-4 py-3 text-sm font-medium transition-all duration-200",
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span>Equipo</span>
                                </div>
                            </TabsTrigger>

                            <TabsTrigger
                                value="leads"
                                className={cn(
                                    "relative px-4 py-3 text-sm font-medium transition-all duration-200",
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <UserCheck className="w-4 h-4" />
                                    <span>Leads & Ventas</span>
                                </div>
                            </TabsTrigger>

                            <TabsTrigger
                                value="clients"
                                className={cn(
                                    "relative px-4 py-3 text-sm font-medium transition-all duration-200",
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span>Clientes</span>
                                </div>
                            </TabsTrigger>

                            <TabsTrigger
                                value="payments"
                                className={cn(
                                    "relative px-4 py-3 text-sm font-medium transition-all duration-200",
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" />
                                    <span>Pagos</span>
                                </div>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <OverviewTabsContent data={data as AdminDashboard} isLoading={isLoading} />
                    <ProjectsTabsContent data={data as AdminDashboard} isLoading={isLoading} />
                    <TeamTabsContent data={data as AdminDashboard} isLoading={isLoading} />
                    <LeadsTabsContent data={data as AdminDashboard} isLoading={isLoading} />
                    <ClientsTabsContent data={data as AdminDashboard} isLoading={isLoading} />
                    <PaymentsTabsContent data={data as AdminDashboard} isLoading={isLoading} />
                </Tabs>
            </div>
        </div>
    );
}
