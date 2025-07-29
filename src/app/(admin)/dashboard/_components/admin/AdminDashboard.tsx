"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Building2,
    MapPin,
    Users,
    FileText,
    DollarSign,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Target,
    BarChart3,
    PieChart,
    UserCheck,
    Mail,
    CreditCard,
    Banknote,
    Timer,
    Activity,
    Filter,
    Search,
    Download,
} from "lucide-react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Line,
    PieChart as RechartsPieChart,
    Cell,
    Pie,
    AreaChart,
    Area,
    ComposedChart,
} from "recharts";
import { useDashboardAdmin } from "../../_hooks/useDashboard";

// Datos simulados basados en los modelos reales
const dashboardData = {

    // Fuentes de captación
    leadSources: [
        { source: "Empresa", count: 89, percentage: 35.2 },
        { source: "Facebook Personal", count: 67, percentage: 26.5 },
        { source: "Feria Inmobiliaria", count: 45, percentage: 17.8 },
        { source: "Institucional", count: 34, percentage: 13.4 },
        { source: "Fidelizado", count: 18, percentage: 7.1 },
    ],

    // Rendimiento mensual
    monthlyPerformance: [
        { month: "Ene", leads: 89, quotations: 45, reservations: 23, sales: 12, revenue: 420000 },
        { month: "Feb", leads: 112, quotations: 67, reservations: 34, sales: 18, revenue: 630000 },
        { month: "Mar", leads: 98, quotations: 56, reservations: 28, sales: 15, revenue: 525000 },
        { month: "Abr", leads: 134, quotations: 78, reservations: 42, sales: 24, revenue: 840000 },
        { month: "May", leads: 156, quotations: 89, reservations: 48, sales: 28, revenue: 980000 },
        { month: "Jun", leads: 167, quotations: 95, reservations: 52, sales: 31, revenue: 1085000 },
    ],

    // Proyectos con métricas
    projectMetrics: [
        {
            name: "Villa Los Jardines",
            location: "San Isidro",
            blocks: 4,
            totalLots: 180,
            available: 98,
            quoted: 45,
            reserved: 23,
            sold: 14,
            revenue: 1250000,
            avgPrice: 45000,
            efficiency: 45.6,
        },
        {
            name: "Residencial San Carlos",
            location: "Miraflores",
            blocks: 6,
            totalLots: 240,
            available: 156,
            quoted: 48,
            reserved: 24,
            sold: 12,
            revenue: 1680000,
            avgPrice: 52000,
            efficiency: 35.0,
        },
        {
            name: "Urbanización El Bosque",
            location: "Surco",
            blocks: 5,
            totalLots: 200,
            available: 89,
            quoted: 67,
            reserved: 28,
            sold: 16,
            revenue: 1450000,
            avgPrice: 38000,
            efficiency: 55.5,
        },
    ],

    // Alertas operativas
    operationalAlerts: [
        {
            type: "critical",
            icon: AlertTriangle,
            message: "12 reservaciones vencen en 24h",
            count: 12,
            color: "text-red-600",
        },
        {
            type: "warning",
            icon: Clock,
            message: "23 leads expirados requieren reciclaje",
            count: 23,
            color: "text-amber-600",
        },
        { type: "info", icon: CheckCircle2, message: "34 tareas completadas hoy", count: 34, color: "text-emerald-600" },
        { type: "urgent", icon: Timer, message: "8 cronogramas de pago vencidos", count: 8, color: "text-red-600" },
    ],

    // Análisis de clientes
    clientAnalysis: {
        totalClients: 1847,
        naturalPersons: 1234,
        legalEntities: 613,
        withEmail: 1456,
        withCompleteData: 1289,
        separateProperty: 234,
        coOwners: 456,
    },

    // Métricas de pagos
    paymentMetrics: {
        totalScheduled: 2340000,
        totalPaid: 1890000,
        pending: 450000,
        overdue: 125000,
        cashPayments: 567000,
        bankTransfers: 890000,
        deposits: 433000,
    },
};

export default function AdminDashboard() {
    const { data } = useDashboardAdmin(2025);
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            <div className="space-y-8">
                {/* Header con métricas principales */}
                <div className="mb-8">

                    {/* KPIs principales */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm font-medium">Proyectos</p>
                                        <p className="text-2xl font-bold">{data?.totalProjects}</p>
                                        <p className="text-blue-200 text-xs">{data?.totalBlocks} bloques</p>
                                    </div>
                                    <Building2 className="w-8 h-8 text-blue-200" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-teal-600 to-teal-700 text-white border-0">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-teal-100 text-sm font-medium">Lotes</p>
                                        <p className="text-2xl font-bold">{(data?.totalLots ?? 0).toLocaleString()}</p>
                                        <p className="text-teal-200 text-xs">Total inventario</p>
                                    </div>
                                    <MapPin className="w-8 h-8 text-teal-200" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-0">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-emerald-100 text-sm font-medium">Clientes</p>
                                        <p className="text-2xl font-bold">{(data?.totalClients ?? 0).toLocaleString()}</p>
                                        <p className="text-emerald-200 text-xs">Base de datos</p>
                                    </div>
                                    <Users className="w-8 h-8 text-emerald-200" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-amber-600 to-amber-700 text-white border-0">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-amber-100 text-sm font-medium">Leads</p>
                                        <p className="text-2xl font-bold">{data?.activeLeads}</p>
                                        <p className="text-amber-200 text-xs">Activos</p>
                                    </div>
                                    <UserCheck className="w-8 h-8 text-amber-200" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white border-0">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100 text-sm font-medium">Cotizaciones</p>
                                        <p className="text-2xl font-bold">{data?.activeQuotations}</p>
                                        <p className="text-purple-200 text-xs">Emitidas</p>
                                    </div>
                                    <FileText className="w-8 h-8 text-purple-200" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white border-0">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100 text-sm font-medium">Ingresos</p>
                                        <p className="text-2xl font-bold">S/ {((data?.monthlyRevenue ?? 0) / 1000000).toFixed(1)}M</p>
                                        <p className="text-green-200 text-xs">Este mes</p>
                                    </div>
                                    <DollarSign className="w-8 h-8 text-green-200" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Alertas operativas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {dashboardData.operationalAlerts.map((alert, index) => (
                        <Card key={index} className="border-l-4 border-l-current">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <alert.icon className={`w-5 h-5 ${alert.color}`} />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-800">{alert.message}</p>
                                        <Badge variant="secondary" className="mt-1">
                                            {alert.count}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Tabs principales */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-6 bg-white shadow-sm">
                        <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                            Resumen
                        </TabsTrigger>
                        <TabsTrigger value="projects" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                            Proyectos
                        </TabsTrigger>
                        <TabsTrigger value="team" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                            Equipo
                        </TabsTrigger>
                        <TabsTrigger value="leads" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                            Leads & Ventas
                        </TabsTrigger>
                        <TabsTrigger value="clients" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                            Clientes
                        </TabsTrigger>
                        <TabsTrigger value="payments" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                            Pagos
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Estado de lotes */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-slate-800">
                                        <PieChart className="w-5 h-5" />
                                        Estado del Inventario
                                    </CardTitle>
                                    <CardDescription>Distribución actual de lotes por estado</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <RechartsPieChart>
                                            <Pie
                                                data={data?.lotsByStatus}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="count"
                                                label={({ status, percentage }) => `${status}: ${percentage}%`}
                                            >
                                                {(data?.lotsByStatus ?? []).map((entry, index) => (
                                                    <Cell key={`cell-${index}`} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Tendencia mensual */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-slate-800">
                                        <TrendingUp className="w-5 h-5" />
                                        Tendencia de Conversión
                                    </CardTitle>
                                    <CardDescription>Evolución de leads a ventas</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <ComposedChart data={dashboardData.monthlyPerformance}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="leads" fill="#73BFB7" name="Leads" />
                                            <Bar dataKey="quotations" fill="#17949B" name="Cotizaciones" />
                                            <Line type="monotone" dataKey="sales" stroke="#072b3d" strokeWidth={3} name="Ventas" />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Métricas de conversión */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-slate-800">Tasa de Conversión</CardTitle>
                                    <CardDescription>Lead a venta</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-blue-600 mb-2">{data?.conversionRate}%</div>
                                        <Progress value={data?.conversionRate ?? 0} className="h-3" />
                                        <p className="text-sm text-slate-600 mt-2">Meta: 20%</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-slate-800">Ticket Promedio</CardTitle>
                                    <CardDescription>Valor promedio por venta</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-green-600 mb-2">
                                            S/ {((data?.averageTicket ?? 0) / 1000).toFixed(0)}K
                                        </div>
                                        <p className="text-sm text-slate-600">Por lote vendido</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-slate-800">Eficiencia Operativa</CardTitle>
                                    <CardDescription>Reservaciones vs ventas</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-purple-600 mb-2">
                                            {Math.round(((data?.completedSales ?? 0) / (data?.pendingReservations ?? 1)) * 100)}%
                                        </div>
                                        <p className="text-sm text-slate-600">Cierre efectivo</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="projects" className="space-y-6">
                        {/* Rendimiento por proyecto */}
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                    <BarChart3 className="w-5 h-5" />
                                    Rendimiento por Proyecto
                                </CardTitle>
                                <CardDescription>Comparativo de eficiencia y ventas</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={dashboardData.projectMetrics}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="available" fill="#73BFB7" name="Disponibles" />
                                        <Bar dataKey="quoted" fill="#17949B" name="Cotizados" />
                                        <Bar dataKey="reserved" fill="#105D88" name="Reservados" />
                                        <Bar dataKey="sold" fill="#072b3d" name="Vendidos" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Detalles de proyectos */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {dashboardData.projectMetrics.map((project, index) => (
                                <Card key={index} className="shadow-lg">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg font-semibold text-slate-800">{project.name}</CardTitle>
                                        <CardDescription className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            {project.location} • {project.blocks} bloques • {project.totalLots} lotes
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                                <p className="text-2xl font-bold text-blue-600">{project.available}</p>
                                                <p className="text-sm text-slate-600">Disponibles</p>
                                            </div>
                                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                                <p className="text-2xl font-bold text-green-600">{project.sold}</p>
                                                <p className="text-sm text-slate-600">Vendidos</p>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="font-medium">Eficiencia de Ventas</span>
                                                <span className="font-bold">{project.efficiency}%</span>
                                            </div>
                                            <Progress value={project.efficiency} className="h-3" />
                                        </div>

                                        <div className="pt-2 border-t">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-600">Ingresos generados</span>
                                                <span className="text-lg font-bold text-green-600">
                                                    S/ {(project.revenue / 1000000).toFixed(1)}M
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-sm text-slate-600">Precio promedio</span>
                                                <span className="text-sm font-semibold">S/ {project.avgPrice.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="team" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-[#072b3d]">Rendimiento del Equipo</CardTitle>
                                    <CardDescription>Eficiencia individual de cada miembro</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={data?.teamData} layout="horizontal">
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis dataKey="name" type="category" width={100} />
                                            <Tooltip />
                                            <Bar dataKey="quotations" fill="#73BFB7" name="Cotizaciones" />
                                            <Bar dataKey="reservations" fill="#105D88" name="Reservaciones" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-[#072b3d]">Detalles del Equipo</CardTitle>
                                    <CardDescription>Métricas individuales de rendimiento</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {Array.isArray(data?.teamData) &&
                                            data.teamData.map((member, index) => (
                                                <div key={index} className="p-3 bg-[#C3E7DF]/10 rounded-lg">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-[#105D88] rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                                {(member.name ?? "")
                                                                    .split(" ")
                                                                    .map((n) => n[0])
                                                                    .join("")}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-[#072b3d] text-sm">{member.name}</p>
                                                                <p className="text-xs text-gray-600">{member.role}</p>
                                                            </div>
                                                        </div>
                                                        <Badge
                                                            className={`text-xs ${(member.efficiency ?? 0) > 50 ? "bg-[#73BFB7]" : "bg-[#17949B]"} text-white`}
                                                        >
                                                            {member.efficiency}%
                                                        </Badge>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                        <div className="text-center">
                                                            <p className="font-bold text-[#072b3d]">{member.quotations}</p>
                                                            <p className="text-gray-600">Cotizaciones</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="font-bold text-[#072b3d]">{member.reservations}</p>
                                                            <p className="text-gray-600">Reservaciones</p>
                                                        </div>
                                                    </div>
                                                    <Progress value={member.efficiency} className="h-1 mt-2" />
                                                </div>
                                            ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="leads" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Estados de leads */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-slate-800">
                                        <Activity className="w-5 h-5" />
                                        Estado de Leads
                                    </CardTitle>
                                    <CardDescription>Distribución actual del pipeline</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={data?.leadsByStatus} layout="horizontal">
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis dataKey="status" type="category" width={100} />
                                            <Tooltip />
                                            <Bar dataKey="count" fill="#17949B" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Fuentes de captación */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-slate-800">
                                        <Target className="w-5 h-5" />
                                        Fuentes de Captación
                                    </CardTitle>
                                    <CardDescription>Origen de los leads</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {dashboardData.leadSources.map((source, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-sm font-medium">{source.source}</span>
                                                        <span className="text-sm text-slate-600">{source.count} leads</span>
                                                    </div>
                                                    <Progress value={source.percentage} className="h-2" />
                                                </div>
                                                <Badge variant="secondary" className="ml-3">
                                                    {source.percentage}%
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Métricas de leads críticas */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card className="shadow-lg border-l-4 border-l-red-500">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <Timer className="w-8 h-8 text-red-500" />
                                        <div>
                                            <p className="text-2xl font-bold text-red-600">{data?.expiredLeads}</p>
                                            <p className="text-sm text-slate-600">Leads Expirados</p>
                                            <p className="text-xs text-red-500">Requieren reciclaje</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-lg border-l-4 border-l-amber-500">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-8 h-8 text-amber-500" />
                                        <div>
                                            <p className="text-2xl font-bold text-amber-600">{data?.pendingReservations}</p>
                                            <p className="text-sm text-slate-600">Reservaciones</p>
                                            <p className="text-xs text-amber-500">Pendientes</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-lg border-l-4 border-l-blue-500">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-8 h-8 text-blue-500" />
                                        <div>
                                            <p className="text-2xl font-bold text-blue-600">{data?.activeQuotations}</p>
                                            <p className="text-sm text-slate-600">Cotizaciones</p>
                                            <p className="text-xs text-blue-500">Activas</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-lg border-l-4 border-l-green-500">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                                        <div>
                                            <p className="text-2xl font-bold text-green-600">{data?.completedSales}</p>
                                            <p className="text-sm text-slate-600">Ventas</p>
                                            <p className="text-xs text-green-500">Completadas</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="clients" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Análisis de clientes */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-slate-800">
                                        <Users className="w-5 h-5" />
                                        Base de Clientes
                                    </CardTitle>
                                    <CardDescription>Análisis demográfico y completitud de datos</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                                            <p className="text-3xl font-bold text-blue-600">
                                                {dashboardData.clientAnalysis.naturalPersons.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-slate-600">Personas Naturales</p>
                                        </div>
                                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                                            <p className="text-3xl font-bold text-purple-600">
                                                {dashboardData.clientAnalysis.legalEntities.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-slate-600">Personas Jurídicas</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    Clientes con Email
                                                </span>
                                                <span>
                                                    {Math.round(
                                                        (dashboardData.clientAnalysis.withEmail / dashboardData.clientAnalysis.totalClients) * 100,
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                            <Progress
                                                value={
                                                    (dashboardData.clientAnalysis.withEmail / dashboardData.clientAnalysis.totalClients) * 100
                                                }
                                                className="h-3"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="flex items-center gap-2">
                                                    <UserCheck className="w-4 h-4" />
                                                    Datos Completos
                                                </span>
                                                <span>
                                                    {Math.round(
                                                        (dashboardData.clientAnalysis.withCompleteData /
                              dashboardData.clientAnalysis.totalClients) *
                              100,
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                            <Progress
                                                value={
                                                    (dashboardData.clientAnalysis.withCompleteData / dashboardData.clientAnalysis.totalClients) *
                          100
                                                }
                                                className="h-3"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Características especiales */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-slate-800">Características Especiales</CardTitle>
                                    <CardDescription>Propiedades y configuraciones especiales</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-5 h-5 text-amber-600" />
                                                <span className="font-medium">Co-propietarios</span>
                                            </div>
                                            <Badge className="bg-amber-600 text-white">{dashboardData.clientAnalysis.coOwners}</Badge>
                                        </div>

                                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-5 h-5 text-green-600" />
                                                <span className="font-medium">Bienes Separados</span>
                                            </div>
                                            <Badge className="bg-green-600 text-white">{dashboardData.clientAnalysis.separateProperty}</Badge>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <Button variant="outline" size="sm" className="flex-col h-16 gap-1 bg-transparent">
                                                <Search className="w-4 h-4" />
                                                <span className="text-xs">Buscar</span>
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex-col h-16 gap-1 bg-transparent">
                                                <Filter className="w-4 h-4" />
                                                <span className="text-xs">Filtrar</span>
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex-col h-16 gap-1 bg-transparent">
                                                <Download className="w-4 h-4" />
                                                <span className="text-xs">Exportar</span>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="payments" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Estado financiero */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-slate-800">
                                        <CreditCard className="w-5 h-5" />
                                        Estado Financiero
                                    </CardTitle>
                                    <CardDescription>Cronogramas de pago y transacciones</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="p-4 bg-green-50 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-green-800">Total Programado</span>
                                                <span className="text-xl font-bold text-green-600">
                                                    S/ {(dashboardData.paymentMetrics.totalScheduled / 1000000).toFixed(1)}M
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-blue-800">Total Pagado</span>
                                                <span className="text-xl font-bold text-blue-600">
                                                    S/ {(dashboardData.paymentMetrics.totalPaid / 1000000).toFixed(1)}M
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-amber-50 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-amber-800">Pendiente</span>
                                                <span className="text-xl font-bold text-amber-600">
                                                    S/ {(dashboardData.paymentMetrics.pending / 1000).toFixed(0)}K
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-red-50 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-red-800">Vencido</span>
                                                <span className="text-xl font-bold text-red-600">
                                                    S/ {(dashboardData.paymentMetrics.overdue / 1000).toFixed(0)}K
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Progreso de Cobranza</span>
                                            <span>
                                                {Math.round(
                                                    (dashboardData.paymentMetrics.totalPaid / dashboardData.paymentMetrics.totalScheduled) * 100,
                                                )}
                                                %
                                            </span>
                                        </div>
                                        <Progress
                                            value={
                                                (dashboardData.paymentMetrics.totalPaid / dashboardData.paymentMetrics.totalScheduled) * 100
                                            }
                                            className="h-4"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Métodos de pago */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-slate-800">
                                        <Banknote className="w-5 h-5" />
                                        Métodos de Pago
                                    </CardTitle>
                                    <CardDescription>Distribución por tipo de transacción</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Banknote className="w-6 h-6 text-green-600" />
                                                <div>
                                                    <p className="font-medium text-green-800">Efectivo</p>
                                                    <p className="text-sm text-green-600">
                                                        S/ {(dashboardData.paymentMetrics.cashPayments / 1000).toFixed(0)}K
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge className="bg-green-600 text-white">
                                                {Math.round(
                                                    (dashboardData.paymentMetrics.cashPayments / dashboardData.paymentMetrics.totalPaid) * 100,
                                                )}
                                                %
                                            </Badge>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <CreditCard className="w-6 h-6 text-blue-600" />
                                                <div>
                                                    <p className="font-medium text-blue-800">Transferencias</p>
                                                    <p className="text-sm text-blue-600">
                                                        S/ {(dashboardData.paymentMetrics.bankTransfers / 1000).toFixed(0)}K
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge className="bg-blue-600 text-white">
                                                {Math.round(
                                                    (dashboardData.paymentMetrics.bankTransfers / dashboardData.paymentMetrics.totalPaid) * 100,
                                                )}
                                                %
                                            </Badge>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Building2 className="w-6 h-6 text-purple-600" />
                                                <div>
                                                    <p className="font-medium text-purple-800">Depósitos</p>
                                                    <p className="text-sm text-purple-600">
                                                        S/ {(dashboardData.paymentMetrics.deposits / 1000).toFixed(0)}K
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge className="bg-purple-600 text-white">
                                                {Math.round(
                                                    (dashboardData.paymentMetrics.deposits / dashboardData.paymentMetrics.totalPaid) * 100,
                                                )}
                                                %
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Gráfico de ingresos mensuales */}
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                    <BarChart3 className="w-5 h-5" />
                                    Evolución de Ingresos
                                </CardTitle>
                                <CardDescription>Ingresos mensuales por ventas</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={dashboardData.monthlyPerformance}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => [`S/ ${value.toLocaleString()}`, "Ingresos"]} />
                                        <Area type="monotone" dataKey="revenue" stroke="#105D88" fill="#73BFB7" fillOpacity={0.6} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
