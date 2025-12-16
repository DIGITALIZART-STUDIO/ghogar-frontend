"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Shield,
    Users,
    Building2,
    MapPin,
    DollarSign,
    TrendingUp,
    AlertTriangle,
    Settings,
    Database,
    Activity,
    UserPlus,
    FileText,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    BarChart3,
    LucidePieChart,
    LineChart,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart as RechartsPieChart,
    Cell,
    Area,
    AreaChart,
    Pie, // Import Pie from recharts
} from "recharts";

// Datos simulados más completos basados en los modelos
const mockData = {
    // Métricas principales
    totalUsers: 45,
    activeUsers: 42,
    inactiveUsers: 3,
    newUsersThisMonth: 8,
    totalProjects: 8,
    activeProjects: 6,
    totalBlocks: 24,
    totalLots: 1250,
    availableLots: 890,
    quotedLots: 180,
    reservedLots: 120,
    soldLots: 60,

    // Reservaciones
    totalReservations: 120,
    activeReservations: 95,
    expiredReservations: 15,
    canceledReservations: 10,

    // Financiero
    totalRevenue: 2450000,
    monthlyRevenue: 185000,
    averageTicket: 28500,
    conversionRate: 15.8,

    // Leads
    totalLeads: 456,
    activeLeads: 234,
    expiredLeads: 89,
    convertedLeads: 133,

    // Tareas
    totalTasks: 1250,
    completedTasks: 980,
    pendingTasks: 270,
    overdueTasks: 45,

    // Cotizaciones
    totalQuotations: 234,
    issuedQuotations: 156,
    acceptedQuotations: 89,
    canceledQuotations: 45,

    // Datos para gráficas
    monthlyData: [
        { month: "Ene", leads: 45, quotations: 28, reservations: 15, revenue: 125000 },
        { month: "Feb", leads: 52, quotations: 35, reservations: 22, revenue: 165000 },
        { month: "Mar", leads: 48, quotations: 31, reservations: 18, revenue: 145000 },
        { month: "Apr", leads: 61, quotations: 42, reservations: 28, revenue: 195000 },
        { month: "May", leads: 55, quotations: 38, reservations: 25, revenue: 175000 },
        { month: "Jun", leads: 67, quotations: 45, reservations: 32, revenue: 225000 },
    ],

    lotStatusData: [
        { name: "Disponibles", value: 890, color: "#73BFB7" },
        { name: "Cotizados", value: 180, color: "#17949B" },
        { name: "Reservados", value: 120, color: "#105D88" },
        { name: "Vendidos", value: 60, color: "#072b3d" },
    ],

    leadSourceData: [
        { source: "Facebook", count: 156, percentage: 34.2 },
        { source: "Empresa", count: 123, percentage: 27.0 },
        { source: "Feria", count: 89, percentage: 19.5 },
        { source: "Institucional", count: 67, percentage: 14.7 },
        { source: "Fidelizado", count: 21, percentage: 4.6 },
    ],

    projectPerformance: [
        { name: "Villa Los Jardines", lots: 120, sold: 45, revenue: 850000, efficiency: 37.5 },
        { name: "Residencial San Carlos", lots: 200, sold: 78, revenue: 1200000, efficiency: 39.0 },
        { name: "Urbanización El Bosque", lots: 180, sold: 52, revenue: 980000, efficiency: 28.9 },
        { name: "Condominio Las Flores", lots: 150, sold: 67, revenue: 1150000, efficiency: 44.7 },
        { name: "Proyecto Alameda", lots: 100, sold: 23, revenue: 450000, efficiency: 23.0 },
    ],

    userActivity: [
        { role: "SuperAdmin", count: 2, active: 2 },
        { role: "Admin", count: 5, active: 5 },
        { role: "Gerente", count: 3, active: 3 },
        { role: "Supervisor", count: 8, active: 7 },
        { role: "SalesAdvisor", count: 27, active: 25 },
    ],
};

export default function SuperAdminDashboard() {
    return (

        <div className="space-y-6">
            {/* Métricas Principales Expandidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                <Card className="bg-gradient-to-br from-[#072b3d] to-[#105D88] text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-xs">Usuarios Totales</p>
                                <p className="text-2xl font-bold">{mockData.totalUsers}</p>
                                <p className="text-white/60 text-xs">{mockData.activeUsers} activos</p>
                            </div>
                            <Users className="w-8 h-8 text-white/60" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#105D88] to-[#17949B] text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-xs">Proyectos</p>
                                <p className="text-2xl font-bold">{mockData.totalProjects}</p>
                                <p className="text-white/60 text-xs">{mockData.activeProjects} activos</p>
                            </div>
                            <Building2 className="w-8 h-8 text-white/60" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#17949B] to-[#73BFB7] text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-xs">Lotes Totales</p>
                                <p className="text-2xl font-bold">{mockData.totalLots}</p>
                                <p className="text-white/60 text-xs">{mockData.availableLots} disponibles</p>
                            </div>
                            <MapPin className="w-8 h-8 text-white/60" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#73BFB7] to-[#C3E7DF] text-[#072b3d]">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#072b3d]/80 text-xs">Ingresos</p>
                                <p className="text-2xl font-bold">S/ {(mockData.totalRevenue / 1000000).toFixed(1)}M</p>
                                <p className="text-[#072b3d]/60 text-xs">S/ {(mockData.monthlyRevenue / 1000).toFixed(0)}K mes</p>
                            </div>
                            <DollarSign className="w-8 h-8 text-[#072b3d]/60" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#C3E7DF] to-white text-[#072b3d] border-2 border-[#73BFB7]">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#072b3d]/80 text-xs">Leads Totales</p>
                                <p className="text-2xl font-bold">{mockData.totalLeads}</p>
                                <p className="text-[#072b3d]/60 text-xs">{mockData.activeLeads} activos</p>
                            </div>
                            <Activity className="w-8 h-8 text-[#072b3d]/60" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-white to-[#C3E7DF] text-[#072b3d] border-2 border-[#105D88]">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#072b3d]/80 text-xs">Conversión</p>
                                <p className="text-2xl font-bold">{mockData.conversionRate}%</p>
                                <p className="text-[#072b3d]/60 text-xs">{mockData.convertedLeads} convertidos</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-[#072b3d]/60" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs para organizar mejor la información */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Resumen</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="projects">Proyectos</TabsTrigger>
                    <TabsTrigger value="users">Usuarios</TabsTrigger>
                    <TabsTrigger value="system">Sistema</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    {/* Gráficas principales */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                    <BarChart3 className="w-5 h-5" />
                                    Tendencia Mensual
                                </CardTitle>
                                <CardDescription>Evolución de leads, cotizaciones y reservaciones</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={mockData.monthlyData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="leads" fill="#73BFB7" name="Leads" />
                                        <Bar dataKey="quotations" fill="#17949B" name="Cotizaciones" />
                                        <Bar dataKey="reservations" fill="#105D88" name="Reservaciones" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                    <LucidePieChart className="w-5 h-5" />
                                    Estado de Lotes
                                </CardTitle>
                                <CardDescription>Distribución actual del inventario</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RechartsPieChart>
                                        <Pie
                                            data={mockData.lotStatusData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percentage }) => `${name}: ${percentage}%`}
                                        >
                                            {mockData.lotStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* KPIs detallados */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-[#072b3d]">Reservaciones</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">Activas</span>
                                    <Badge className="bg-[#73BFB7] text-white">{mockData.activeReservations}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">Vencidas</span>
                                    <Badge variant="destructive">{mockData.expiredReservations}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">Canceladas</span>
                                    <Badge variant="secondary">{mockData.canceledReservations}</Badge>
                                </div>
                                <Progress value={(mockData.activeReservations / mockData.totalReservations) * 100} className="h-2" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-[#072b3d]">Cotizaciones</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">Emitidas</span>
                                    <Badge className="bg-[#17949B] text-white">{mockData.issuedQuotations}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">Aceptadas</span>
                                    <Badge className="bg-[#105D88] text-white">{mockData.acceptedQuotations}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">Canceladas</span>
                                    <Badge variant="secondary">{mockData.canceledQuotations}</Badge>
                                </div>
                                <Progress value={(mockData.acceptedQuotations / mockData.totalQuotations) * 100} className="h-2" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-[#072b3d]">Tareas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">Completadas</span>
                                    <Badge className="bg-[#73BFB7] text-white">{mockData.completedTasks}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">Pendientes</span>
                                    <Badge className="bg-[#17949B] text-white">{mockData.pendingTasks}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">Vencidas</span>
                                    <Badge variant="destructive">{mockData.overdueTasks}</Badge>
                                </div>
                                <Progress value={(mockData.completedTasks / mockData.totalTasks) * 100} className="h-2" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-[#072b3d]">Leads</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">Activos</span>
                                    <Badge className="bg-[#73BFB7] text-white">{mockData.activeLeads}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">Convertidos</span>
                                    <Badge className="bg-[#105D88] text-white">{mockData.convertedLeads}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">Expirados</span>
                                    <Badge variant="destructive">{mockData.expiredLeads}</Badge>
                                </div>
                                <Progress value={(mockData.convertedLeads / mockData.totalLeads) * 100} className="h-2" />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                    <LineChart className="w-5 h-5" />
                                    Ingresos Mensuales
                                </CardTitle>
                                <CardDescription>Evolución de ingresos por mes</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={mockData.monthlyData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => [`S/ ${value.toLocaleString()}`, "Ingresos"]} />
                                        <Area type="monotone" dataKey="revenue" stroke="#105D88" fill="#73BFB7" fillOpacity={0.6} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-[#072b3d]">Fuentes de Leads</CardTitle>
                                <CardDescription>Origen de los leads por canal</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {mockData.leadSourceData.map((source, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium">{source.source}</span>
                                                <span className="text-gray-600">
                                                    {source.count} ({source.percentage}%)
                                                </span>
                                            </div>
                                            <Progress value={source.percentage} className="h-2" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="projects" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-[#072b3d]">Rendimiento por Proyecto</CardTitle>
                            <CardDescription>Análisis detallado de cada proyecto inmobiliario</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockData.projectPerformance.map((project, index) => (
                                    <div key={index} className="p-4 bg-[#C3E7DF]/10 rounded-lg">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-semibold text-[#072b3d]">{project.name}</h4>
                                                <p className="text-sm text-gray-600">{project.lots} lotes totales</p>
                                            </div>
                                            <Badge
                                                className={`${project.efficiency > 35 ? "bg-[#73BFB7]" : project.efficiency > 25 ? "bg-[#17949B]" : "bg-[#105D88]"} text-white`}
                                            >
                                                {project.efficiency}% eficiencia
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 mb-3">
                                            <div className="text-center">
                                                <p className="text-lg font-bold text-[#072b3d]">{project.sold}</p>
                                                <p className="text-xs text-gray-600">Vendidos</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-bold text-[#072b3d]">S/ {(project.revenue / 1000).toFixed(0)}K</p>
                                                <p className="text-xs text-gray-600">Ingresos</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-bold text-[#072b3d]">{project.lots - project.sold}</p>
                                                <p className="text-xs text-gray-600">Disponibles</p>
                                            </div>
                                        </div>
                                        <Progress value={project.efficiency} className="h-2" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-[#072b3d]">Usuarios por Rol</CardTitle>
                                <CardDescription>Distribución del equipo por tipo de usuario</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={mockData.userActivity} layout="horizontal">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis dataKey="role" type="category" width={100} />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#73BFB7" name="Total" />
                                        <Bar dataKey="active" fill="#105D88" name="Activos" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-[#072b3d]">Estado de Usuarios</CardTitle>
                                <CardDescription>Actividad y estado general del equipo</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-[#C3E7DF]/20 rounded-lg">
                                        <CheckCircle className="w-8 h-8 mx-auto mb-2 text-[#73BFB7]" />
                                        <p className="text-2xl font-bold text-[#072b3d]">{mockData.activeUsers}</p>
                                        <p className="text-sm text-gray-600">Usuarios Activos</p>
                                    </div>
                                    <div className="text-center p-4 bg-red-50 rounded-lg">
                                        <XCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
                                        <p className="text-2xl font-bold text-red-600">{mockData.inactiveUsers}</p>
                                        <p className="text-sm text-gray-600">Usuarios Inactivos</p>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span>Tasa de Actividad</span>
                                        <span>{Math.round((mockData.activeUsers / mockData.totalUsers) * 100)}%</span>
                                    </div>
                                    <Progress value={(mockData.activeUsers / mockData.totalUsers) * 100} className="h-3" />
                                </div>
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        <UserPlus className="w-4 h-4 inline mr-1" />
                                        {mockData.newUsersThisMonth} nuevos usuarios este mes
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="system" className="space-y-6">
                    {/* Panel de Control del Sistema */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                    <Shield className="w-5 h-5" />
                                    Control del Sistema
                                </CardTitle>
                                <CardDescription>Administración completa del CRM</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <Button className="bg-[#105D88] hover:bg-[#072b3d] text-white">
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Usuarios
                                    </Button>
                                    <Button className="bg-[#17949B] hover:bg-[#105D88] text-white">
                                        <Building2 className="w-4 h-4 mr-2" />
                                        Proyectos
                                    </Button>
                                    <Button className="bg-[#73BFB7] hover:bg-[#17949B] text-white">
                                        <Database className="w-4 h-4 mr-2" />
                                        Base de Datos
                                    </Button>
                                    <Button className="bg-[#C3E7DF] hover:bg-[#73BFB7] text-[#072b3d]">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Configuración
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                    <Users className="w-5 h-5" />
                                    Gestión de Clientes
                                </CardTitle>
                                <CardDescription>Administración completa de la base de clientes</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-3 bg-[#C3E7DF]/20 rounded-lg">
                                        <p className="text-2xl font-bold text-[#072b3d]">1,245</p>
                                        <p className="text-xs text-gray-600">Clientes Totales</p>
                                    </div>
                                    <div className="text-center p-3 bg-[#73BFB7]/20 rounded-lg">
                                        <p className="text-2xl font-bold text-[#072b3d]">892</p>
                                        <p className="text-xs text-gray-600">Personas Naturales</p>
                                    </div>
                                    <div className="text-center p-3 bg-[#17949B]/20 rounded-lg">
                                        <p className="text-2xl font-bold text-[#072b3d]">353</p>
                                        <p className="text-xs text-gray-600">Personas Jurídicas</p>
                                    </div>
                                    <div className="text-center p-3 bg-[#105D88]/20 rounded-lg">
                                        <p className="text-2xl font-bold text-[#072b3d]">156</p>
                                        <p className="text-xs text-gray-600">Nuevos este mes</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button className="bg-[#105D88] hover:bg-[#072b3d] text-white">
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Nuevo Cliente
                                    </Button>
                                    <Button className="bg-[#17949B] hover:bg-[#105D88] text-white">
                                        <Database className="w-4 h-4 mr-2" />
                                        Importar Clientes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                    <AlertTriangle className="w-5 h-5" />
                                    Alertas del Sistema
                                </CardTitle>
                                <CardDescription>Notificaciones importantes</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 text-red-500" />
                                            <span className="text-sm text-red-800 font-medium">Crítico</span>
                                        </div>
                                        <p className="text-sm text-red-700 mt-1">
                                            {mockData.expiredReservations} reservaciones vencidas requieren atención
                                        </p>
                                    </div>
                                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-yellow-500" />
                                            <span className="text-sm text-yellow-800 font-medium">Advertencia</span>
                                        </div>
                                        <p className="text-sm text-yellow-700 mt-1">
                                            {mockData.overdueTasks} tareas vencidas en el sistema
                                        </p>
                                    </div>
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Eye className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm text-blue-800 font-medium">Información</span>
                                        </div>
                                        <p className="text-sm text-blue-700 mt-1">Sistema funcionando correctamente - Uptime 99.9%</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Acciones Rápidas Expandidas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-[#072b3d]">Herramientas de Administración</CardTitle>
                            <CardDescription>Acceso rápido a funciones administrativas críticas</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                    <FileText className="w-6 h-6" />
                                    <span className="text-xs">Reportes</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                    <Calendar className="w-6 h-6" />
                                    <span className="text-xs">Cronogramas</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                    <BarChart3 className="w-6 h-6" />
                                    <span className="text-xs">Analytics</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                    <Settings className="w-6 h-6" />
                                    <span className="text-xs">Configurar</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                    <Database className="w-6 h-6" />
                                    <span className="text-xs">Backup</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                    <Activity className="w-6 h-6" />
                                    <span className="text-xs">Monitoreo</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
