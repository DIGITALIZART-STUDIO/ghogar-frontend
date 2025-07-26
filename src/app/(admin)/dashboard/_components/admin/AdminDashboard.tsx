
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
    Calendar,
    AlertCircle,
    CheckCircle,
    Clock,
    Target,
    BarChart3,
    PieChart,
    UserPlus,
    Database,
} from "lucide-react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart as RechartsPieChart,
    Cell,
    Pie,
    AreaChart,
    Area,
} from "recharts";

// Datos simulados más completos para Admin
const mockData = {
    // Métricas principales
    projectsManaged: 5,
    totalBlocks: 18,
    totalLots: 950,
    activeQuotations: 45,
    pendingReservations: 12,
    monthlyTarget: 25,
    achieved: 18,
    teamMembers: 15,
    activeTasks: 28,
    completedTasks: 156,
    upcomingDeadlines: 8,

    // Métricas financieras
    monthlyRevenue: 185000,
    averageTicket: 28500,
    totalSales: 1250000,
    projectedRevenue: 220000,

    // Datos por proyecto
    projectData: [
        {
            name: "Villa Los Jardines",
            lots: 120,
            available: 85,
            quoted: 20,
            reserved: 10,
            sold: 5,
            revenue: 850000,
            efficiency: 29.2,
        },
        {
            name: "Residencial San Carlos",
            lots: 200,
            available: 156,
            quoted: 25,
            reserved: 12,
            sold: 7,
            revenue: 1200000,
            efficiency: 22.0,
        },
        {
            name: "Urbanización El Bosque",
            lots: 180,
            available: 98,
            quoted: 45,
            reserved: 25,
            sold: 12,
            revenue: 980000,
            efficiency: 45.6,
        },
        {
            name: "Condominio Las Flores",
            lots: 150,
            available: 89,
            quoted: 35,
            reserved: 18,
            sold: 8,
            revenue: 750000,
            efficiency: 40.7,
        },
        {
            name: "Proyecto Alameda",
            lots: 100,
            available: 67,
            quoted: 20,
            reserved: 8,
            sold: 5,
            revenue: 450000,
            efficiency: 33.0,
        },
    ],

    // Datos mensuales
    monthlyData: [
        { month: "Ene", quotations: 28, reservations: 15, sales: 8, revenue: 125000 },
        { month: "Feb", quotations: 35, reservations: 22, sales: 12, revenue: 165000 },
        { month: "Mar", quotations: 31, reservations: 18, sales: 10, revenue: 145000 },
        { month: "Apr", quotations: 42, reservations: 28, sales: 15, revenue: 195000 },
        { month: "May", quotations: 38, reservations: 25, sales: 14, revenue: 175000 },
        { month: "Jun", quotations: 45, reservations: 32, sales: 18, revenue: 225000 },
    ],

    // Equipo de trabajo
    teamData: [
        { name: "Carlos Mendoza", role: "Senior", quotations: 15, reservations: 8, efficiency: 53.3 },
        { name: "Ana García", role: "Senior", quotations: 12, reservations: 7, efficiency: 58.3 },
        { name: "Luis Torres", role: "Junior", quotations: 18, reservations: 6, efficiency: 33.3 },
        { name: "María López", role: "Junior", quotations: 9, reservations: 4, efficiency: 44.4 },
        { name: "Pedro Ruiz", role: "Senior", quotations: 14, reservations: 9, efficiency: 64.3 },
    ],

    // Estado de cotizaciones
    quotationStatus: [
        { status: "Emitidas", count: 45, color: "#73BFB7" },
        { status: "Aceptadas", count: 28, color: "#17949B" },
        { status: "Pendientes", count: 12, color: "#105D88" },
        { status: "Canceladas", count: 5, color: "#072b3d" },
    ],

    // Alertas y notificaciones
    alerts: [
        { type: "critical", message: "4 reservaciones vencen hoy", count: 4 },
        { type: "warning", message: "8 tareas por vencer esta semana", count: 8 },
        { type: "info", message: "Meta mensual al 72%", count: 72 },
    ],
};

export default function AdminDashboard() {
    return (

        <div className="space-y-6">
            {/* Métricas Principales Expandidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                <Card className="bg-gradient-to-br from-[#105D88] to-[#17949B] text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-xs">Proyectos</p>
                                <p className="text-2xl font-bold">{mockData.projectsManaged}</p>
                                <p className="text-white/60 text-xs">{mockData.totalBlocks} bloques</p>
                            </div>
                            <Building2 className="w-8 h-8 text-white/60" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#17949B] to-[#73BFB7] text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-xs">Lotes</p>
                                <p className="text-2xl font-bold">{mockData.totalLots}</p>
                                <p className="text-white/60 text-xs">Administrados</p>
                            </div>
                            <MapPin className="w-8 h-8 text-white/60" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#73BFB7] to-[#C3E7DF] text-[#072b3d]">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#072b3d]/80 text-xs">Cotizaciones</p>
                                <p className="text-2xl font-bold">{mockData.activeQuotations}</p>
                                <p className="text-[#072b3d]/60 text-xs">Activas</p>
                            </div>
                            <FileText className="w-8 h-8 text-[#072b3d]/60" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#072b3d] to-[#105D88] text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-xs">Meta</p>
                                <p className="text-2xl font-bold">
                                    {mockData.achieved}/{mockData.monthlyTarget}
                                </p>
                                <p className="text-white/60 text-xs">
                                    {Math.round((mockData.achieved / mockData.monthlyTarget) * 100)}%
                                </p>
                            </div>
                            <Target className="w-8 h-8 text-white/60" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#C3E7DF] to-white text-[#072b3d] border-2 border-[#73BFB7]">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#072b3d]/80 text-xs">Equipo</p>
                                <p className="text-2xl font-bold">{mockData.teamMembers}</p>
                                <p className="text-[#072b3d]/60 text-xs">Miembros</p>
                            </div>
                            <Users className="w-8 h-8 text-[#072b3d]/60" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-white to-[#C3E7DF] text-[#072b3d] border-2 border-[#105D88]">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#072b3d]/80 text-xs">Ingresos</p>
                                <p className="text-2xl font-bold">S/ {(mockData.monthlyRevenue / 1000).toFixed(0)}K</p>
                                <p className="text-[#072b3d]/60 text-xs">Este mes</p>
                            </div>
                            <DollarSign className="w-8 h-8 text-[#072b3d]/60" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs organizadas */}
            <Tabs defaultValue="projects" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="projects">Proyectos</TabsTrigger>
                    <TabsTrigger value="team">Equipo</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="operations">Operaciones</TabsTrigger>
                </TabsList>

                <TabsContent value="projects" className="space-y-6">
                    {/* Gráfica de rendimiento por proyecto */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                <BarChart3 className="w-5 h-5" />
                                Rendimiento por Proyecto
                            </CardTitle>
                            <CardDescription>Comparativo de eficiencia y ventas por proyecto</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={mockData.projectData}>
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
                        {mockData.projectData.map((project, index) => (
                            <Card key={index}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-[#072b3d]">{project.name}</CardTitle>
                                    <CardDescription>{project.lots} lotes totales</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="text-center p-2 bg-[#C3E7DF]/20 rounded">
                                            <p className="font-bold text-[#072b3d]">{project.available}</p>
                                            <p className="text-gray-600">Disponibles</p>
                                        </div>
                                        <div className="text-center p-2 bg-[#73BFB7]/20 rounded">
                                            <p className="font-bold text-[#072b3d]">{project.sold}</p>
                                            <p className="text-gray-600">Vendidos</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span>Eficiencia</span>
                                            <span>{project.efficiency}%</span>
                                        </div>
                                        <Progress value={project.efficiency} className="h-2" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-[#072b3d]">S/ {(project.revenue / 1000).toFixed(0)}K</p>
                                        <p className="text-xs text-gray-600">Ingresos generados</p>
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
                                    <BarChart data={mockData.teamData} layout="horizontal">
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
                                    {mockData.teamData.map((member, index) => (
                                        <div key={index} className="p-3 bg-[#C3E7DF]/10 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-[#105D88] rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                        {member.name
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
                                                    className={`text-xs ${member.efficiency > 50 ? "bg-[#73BFB7]" : "bg-[#17949B]"} text-white`}
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

                <TabsContent value="analytics" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                    <TrendingUp className="w-5 h-5" />
                                    Tendencia de Ventas
                                </CardTitle>
                                <CardDescription>Evolución mensual de cotizaciones y reservaciones</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={mockData.monthlyData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="quotations" stroke="#73BFB7" strokeWidth={2} name="Cotizaciones" />
                                        <Line
                                            type="monotone"
                                            dataKey="reservations"
                                            stroke="#105D88"
                                            strokeWidth={2}
                                            name="Reservaciones"
                                        />
                                        <Line type="monotone" dataKey="sales" stroke="#072b3d" strokeWidth={2} name="Ventas" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                    <PieChart className="w-5 h-5" />
                                    Estado de Cotizaciones
                                </CardTitle>
                                <CardDescription>Distribución actual de cotizaciones</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RechartsPieChart>
                                        <Pie
                                            data={mockData.quotationStatus}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="count"
                                            label={({ status, count }) => `${status}: ${count}`}
                                        >
                                            {mockData.quotationStatus.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Métricas financieras */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-[#072b3d]">Análisis Financiero</CardTitle>
                            <CardDescription>Ingresos y proyecciones mensuales</CardDescription>
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
                </TabsContent>

                <TabsContent value="operations" className="space-y-6">
                    {/* Alertas operativas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {mockData.alerts.map((alert, index) => (
                            <Card
                                key={index}
                                className={`border-l-4 ${
                                    alert.type === "critical"
                                        ? "border-l-red-500"
                                        : alert.type === "warning"
                                            ? "border-l-yellow-500"
                                            : "border-l-blue-500"
                                }`}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        {alert.type === "critical" && <AlertCircle className="w-5 h-5 text-red-500" />}
                                        {alert.type === "warning" && <Clock className="w-5 h-5 text-yellow-500" />}
                                        {alert.type === "info" && <CheckCircle className="w-5 h-5 text-blue-500" />}
                                        <span
                                            className={`font-medium text-sm ${
                                                alert.type === "critical"
                                                    ? "text-red-800"
                                                    : alert.type === "warning"
                                                        ? "text-yellow-800"
                                                        : "text-blue-800"
                                            }`}
                                        >
                                            {alert.type === "critical"
                                                ? "Crítico"
                                                : alert.type === "warning"
                                                    ? "Advertencia"
                                                    : "Información"}
                                        </span>
                                    </div>
                                    <p
                                        className={`text-sm ${
                                            alert.type === "critical"
                                                ? "text-red-700"
                                                : alert.type === "warning"
                                                    ? "text-yellow-700"
                                                    : "text-blue-700"
                                        }`}
                                    >
                                        {alert.message}
                                    </p>
                                    <div className="mt-2">
                                        <Badge
                                            className={`${
                                                alert.type === "critical"
                                                    ? "bg-red-500"
                                                    : alert.type === "warning"
                                                        ? "bg-yellow-500"
                                                        : "bg-blue-500"
                                            } text-white`}
                                        >
                                            {alert.count}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                <Users className="w-5 h-5" />
                                Base de Clientes
                            </CardTitle>
                            <CardDescription>Gestión y análisis de clientes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-3 bg-[#C3E7DF]/20 rounded-lg">
                                            <p className="text-xl font-bold text-[#072b3d]">892</p>
                                            <p className="text-xs text-gray-600">Personas Naturales</p>
                                        </div>
                                        <div className="text-center p-3 bg-[#73BFB7]/20 rounded-lg">
                                            <p className="text-xl font-bold text-[#072b3d]">353</p>
                                            <p className="text-xs text-gray-600">Personas Jurídicas</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Clientes con Email</span>
                                            <span>78%</span>
                                        </div>
                                        <Progress value={78} className="h-2" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Clientes Completos</span>
                                            <span>65%</span>
                                        </div>
                                        <Progress value={65} className="h-2" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Button variant="outline" className="w-full bg-transparent">
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Gestionar Clientes
                                    </Button>
                                    <Button variant="outline" className="w-full bg-transparent">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Exportar Base
                                    </Button>
                                    <Button variant="outline" className="w-full bg-transparent">
                                        <Database className="w-4 h-4 mr-2" />
                                        Importar Datos
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tablero operativo */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-[#072b3d]">Estado Operativo</CardTitle>
                                <CardDescription>Resumen de actividades actuales</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-[#C3E7DF]/20 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-[#105D88]" />
                                            <span className="text-sm font-medium">Cotizaciones Activas</span>
                                        </div>
                                        <Badge className="bg-[#73BFB7] text-white">{mockData.activeQuotations}</Badge>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-[#C3E7DF]/20 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-5 h-5 text-[#17949B]" />
                                            <span className="text-sm font-medium">Reservaciones Pendientes</span>
                                        </div>
                                        <Badge className="bg-[#17949B] text-white">{mockData.pendingReservations}</Badge>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-[#C3E7DF]/20 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-[#072b3d]" />
                                            <span className="text-sm font-medium">Tareas Activas</span>
                                        </div>
                                        <Badge className="bg-[#105D88] text-white">{mockData.activeTasks}</Badge>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-[#C3E7DF]/20 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-red-500" />
                                            <span className="text-sm font-medium">Próximos Vencimientos</span>
                                        </div>
                                        <Badge variant="destructive">{mockData.upcomingDeadlines}</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-[#072b3d]">Progreso de Meta</CardTitle>
                                <CardDescription>Seguimiento del objetivo mensual</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-[#072b3d] mb-2">
                                        {Math.round((mockData.achieved / mockData.monthlyTarget) * 100)}%
                                    </div>
                                    <p className="text-sm text-gray-600">Meta Mensual Completada</p>
                                </div>
                                <Progress value={(mockData.achieved / mockData.monthlyTarget) * 100} className="h-4" />
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <p className="text-2xl font-bold text-[#072b3d]">{mockData.achieved}</p>
                                        <p className="text-xs text-gray-600">Logrado</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-[#072b3d]">{mockData.monthlyTarget - mockData.achieved}</p>
                                        <p className="text-xs text-gray-600">Restante</p>
                                    </div>
                                </div>
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        <TrendingUp className="w-4 h-4 inline mr-1" />
                                        Proyección: S/ {mockData.projectedRevenue.toLocaleString()} para fin de mes
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Herramientas administrativas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-[#072b3d]">Herramientas Administrativas</CardTitle>
                            <CardDescription>Acceso rápido a funciones de administración</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                    <Building2 className="w-6 h-6" />
                                    <span className="text-xs">Proyectos</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                    <MapPin className="w-6 h-6" />
                                    <span className="text-xs">Lotes</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                    <FileText className="w-6 h-6" />
                                    <span className="text-xs">Cotizaciones</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                    <DollarSign className="w-6 h-6" />
                                    <span className="text-xs">Reservaciones</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                    <Calendar className="w-6 h-6" />
                                    <span className="text-xs">Cronogramas</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                    <BarChart3 className="w-6 h-6" />
                                    <span className="text-xs">Reportes</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

