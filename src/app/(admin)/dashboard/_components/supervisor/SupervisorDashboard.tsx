"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Users,
    UserPlus,
    Phone,
    Calendar,
    FileText,
    DollarSign,
    Clock,
    AlertTriangle,
    CheckCircle,
    Search,
    Filter,
    Upload,
    Target,
    Activity,
    BarChart3,
    TrendingUp,
    MapPin,
    Eye,
    Mail,
    User,
} from "lucide-react";
import {
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
    FunnelChart,
    Funnel,
    LabelList,
} from "recharts";

// Datos basados en los modelos reales
const mockData = {
    // KPIs basados en Lead model
    totalLeads: 156,
    registeredLeads: 45, // LeadStatus.Registered
    attendedLeads: 38, // LeadStatus.Attended
    inFollowUpLeads: 42, // LeadStatus.InFollowUp
    completedLeads: 23, // LeadStatus.Completed
    canceledLeads: 5, // LeadStatus.Canceled
    expiredLeads: 3, // LeadStatus.Expired
    unassignedLeads: 18, // Leads sin AssignedToId

    // Cotizaciones y reservaciones
    quotationsGenerated: 67,
    reservationsActive: 34,
    tasksToday: 28,

    // Asesores con datos reales basados en el modelo
    advisors: [
        {
            id: 1,
            name: "Carlos Mendoza",
            leadsAssigned: 32,
            leadsInFollowUp: 12,
            leadsCompleted: 6,
            quotationsIssued: 15,
            reservationsGenerated: 4,
            tasksCompleted: 18,
            tasksPending: 5,
            avgResponseTime: 2.1,
            lastActivity: "2024-01-15",
            efficiency: 18.8, // (leadsCompleted / leadsAssigned) * 100
        },
        {
            id: 2,
            name: "Ana García",
            leadsAssigned: 28,
            leadsInFollowUp: 10,
            leadsCompleted: 5,
            quotationsIssued: 12,
            reservationsGenerated: 3,
            tasksCompleted: 15,
            tasksPending: 7,
            avgResponseTime: 3.4,
            lastActivity: "2024-01-15",
            efficiency: 17.9,
        },
        {
            id: 3,
            name: "Luis Torres",
            leadsAssigned: 35,
            leadsInFollowUp: 15,
            leadsCompleted: 8,
            quotationsIssued: 18,
            reservationsGenerated: 6,
            tasksCompleted: 22,
            tasksPending: 3,
            avgResponseTime: 1.8,
            lastActivity: "2024-01-14",
            efficiency: 22.9,
        },
        {
            id: 4,
            name: "María López",
            leadsAssigned: 24,
            leadsInFollowUp: 8,
            leadsCompleted: 3,
            quotationsIssued: 9,
            reservationsGenerated: 2,
            tasksCompleted: 12,
            tasksPending: 8,
            avgResponseTime: 4.2,
            lastActivity: "2024-01-13",
            efficiency: 12.5,
        },
        {
            id: 5,
            name: "Pedro Ruiz",
            leadsAssigned: 29,
            leadsInFollowUp: 11,
            leadsCompleted: 5,
            quotationsIssued: 13,
            reservationsGenerated: 4,
            tasksCompleted: 16,
            tasksPending: 4,
            avgResponseTime: 2.7,
            lastActivity: "2024-01-15",
            efficiency: 17.2,
        },
    ],

    // Leads recientes con datos del modelo
    recentLeads: [
        {
            id: 1,
            clientName: "Juan Pérez",
            clientPhone: "987654321",
            captureSource: "Company", // LeadCaptureSource
            status: "Registered", // LeadStatus
            daysUntilExpiration: 6,
            assignedTo: "Carlos Mendoza",
            projectName: "Villa Los Jardines",
            entryDate: "2024-01-10",
            priority: "medium",
        },
        {
            id: 2,
            clientName: "María González",
            clientPhone: "987654322",
            captureSource: "RealEstateFair",
            status: "InFollowUp",
            daysUntilExpiration: 3,
            assignedTo: "Ana García",
            projectName: "Residencial San Carlos",
            entryDate: "2024-01-12",
            priority: "high",
        },
        {
            id: 3,
            clientName: "Carlos Ruiz",
            clientPhone: "987654323",
            captureSource: "PersonalFacebook",
            status: "Attended",
            daysUntilExpiration: 5,
            assignedTo: "Luis Torres",
            projectName: "Urbanización El Bosque",
            entryDate: "2024-01-11",
            priority: "low",
        },
        {
            id: 4,
            clientName: "Ana Torres",
            clientPhone: "987654324",
            captureSource: "Institutional",
            status: "Registered",
            daysUntilExpiration: 1,
            assignedTo: null, // Sin asignar
            projectName: "Condominio Las Flores",
            entryDate: "2024-01-14",
            priority: "high",
        },
    ],

    // Embudo de conversión basado en LeadStatus
    conversionFunnel: [
        { stage: "Registered", count: 45, percentage: 100 },
        { stage: "Attended", count: 38, percentage: 84.4 },
        { stage: "InFollowUp", count: 42, percentage: 93.3 },
        { stage: "Completed", count: 23, percentage: 51.1 },
    ],

    // Distribución por fuente de captación
    leadSources: [
        { source: "Company", count: 45, percentage: 28.8, color: "#73BFB7" },
        { source: "PersonalFacebook", count: 38, percentage: 24.4, color: "#17949B" },
        { source: "RealEstateFair", count: 32, percentage: 20.5, color: "#105D88" },
        { source: "Institutional", count: 28, percentage: 17.9, color: "#072b3d" },
        { source: "Loyalty", count: 13, percentage: 8.3, color: "#C3E7DF" },
    ],

    // Datos semanales de actividad
    weeklyActivity: [
        { day: "Lun", newLeads: 8, assigned: 6, attended: 4, completed: 2, expired: 0 },
        { day: "Mar", newLeads: 12, assigned: 10, attended: 7, completed: 3, expired: 1 },
        { day: "Mié", newLeads: 6, assigned: 5, attended: 3, completed: 1, expired: 0 },
        { day: "Jue", newLeads: 15, assigned: 12, attended: 9, completed: 4, expired: 1 },
        { day: "Vie", newLeads: 9, assigned: 7, attended: 5, completed: 2, expired: 0 },
        { day: "Sáb", newLeads: 4, assigned: 3, attended: 2, completed: 1, expired: 0 },
        { day: "Dom", newLeads: 2, assigned: 1, attended: 1, completed: 0, expired: 0 },
    ],

    // Análisis de tareas basado en LeadTask model
    taskAnalysis: [
        { type: "Call", scheduled: 45, completed: 38, pending: 7, overdue: 2 }, // TaskType.Call
        { type: "Meeting", scheduled: 28, completed: 22, pending: 4, overdue: 2 }, // TaskType.Meeting
        { type: "Email", scheduled: 67, completed: 58, pending: 8, overdue: 1 }, // TaskType.Email
        { type: "Visit", scheduled: 15, completed: 12, pending: 2, overdue: 1 }, // TaskType.Visit
        { type: "Other", scheduled: 12, completed: 8, pending: 3, overdue: 1 }, // TaskType.Other
    ],

    // Análisis por proyecto
    projectLeads: [
        {
            project: "Villa Los Jardines",
            leadsReceived: 35,
            leadsAssigned: 32,
            leadsCompleted: 8,
            conversionRate: 22.9,
            avgDaysToComplete: 12.5,
        },
        {
            project: "Residencial San Carlos",
            leadsReceived: 42,
            leadsAssigned: 38,
            leadsCompleted: 12,
            conversionRate: 28.6,
            avgDaysToComplete: 10.2,
        },
        {
            project: "Urbanización El Bosque",
            leadsReceived: 28,
            leadsAssigned: 25,
            leadsCompleted: 5,
            conversionRate: 17.9,
            avgDaysToComplete: 15.8,
        },
        {
            project: "Condominio Las Flores",
            leadsReceived: 31,
            leadsAssigned: 28,
            leadsCompleted: 9,
            conversionRate: 29.0,
            avgDaysToComplete: 11.3,
        },
        {
            project: "Proyecto Alameda",
            leadsReceived: 20,
            leadsAssigned: 18,
            leadsCompleted: 3,
            conversionRate: 15.0,
            avgDaysToComplete: 18.7,
        },
    ],
};

export default function SupervisorDashboard() {
    return (
        <div className="space-y-6">
            {/* KPIs Principales basados en Lead model */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                <Card className="bg-gradient-to-br from-[#73BFB7] to-[#C3E7DF] text-[#072b3d]">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#072b3d]/80 text-xs">Leads Totales</p>
                                <p className="text-2xl font-bold">{mockData.totalLeads}</p>
                                <p className="text-[#072b3d]/60 text-xs">{mockData.unassignedLeads} sin asignar</p>
                            </div>
                            <Users className="w-8 h-8 text-[#072b3d]/60" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#17949B] to-[#73BFB7] text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-xs">En Seguimiento</p>
                                <p className="text-2xl font-bold">{mockData.inFollowUpLeads}</p>
                                <p className="text-white/60 text-xs">Leads activos</p>
                            </div>
                            <Activity className="w-8 h-8 text-white/60" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#105D88] to-[#17949B] text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-xs">Cotizaciones</p>
                                <p className="text-2xl font-bold">{mockData.quotationsGenerated}</p>
                                <p className="text-white/60 text-xs">Generadas</p>
                            </div>
                            <FileText className="w-8 h-8 text-white/60" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#072b3d] to-[#105D88] text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-xs">Reservaciones</p>
                                <p className="text-2xl font-bold">{mockData.reservationsActive}</p>
                                <p className="text-white/60 text-xs">Activas</p>
                            </div>
                            <DollarSign className="w-8 h-8 text-white/60" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#C3E7DF] to-white text-[#072b3d] border-2 border-[#73BFB7]">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#072b3d]/80 text-xs">Completados</p>
                                <p className="text-2xl font-bold">{mockData.completedLeads}</p>
                                <p className="text-[#072b3d]/60 text-xs">
                                    {Math.round((mockData.completedLeads / mockData.totalLeads) * 100)}% tasa
                                </p>
                            </div>
                            <Target className="w-8 h-8 text-[#072b3d]/60" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-white to-[#C3E7DF] text-[#072b3d] border-2 border-[#105D88]">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#072b3d]/80 text-xs">Tareas Hoy</p>
                                <p className="text-2xl font-bold">{mockData.tasksToday}</p>
                                <p className="text-[#072b3d]/60 text-xs">Programadas</p>
                            </div>
                            <Calendar className="w-8 h-8 text-[#072b3d]/60" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs organizadas */}
            <Tabs defaultValue="leads" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="leads">Gestión Leads</TabsTrigger>
                    <TabsTrigger value="team">Mi Equipo</TabsTrigger>
                    <TabsTrigger value="tasks">Tareas</TabsTrigger>
                    <TabsTrigger value="projects">Proyectos</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="leads" className="space-y-6">
                    {/* Embudo de conversión y fuentes */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                    <TrendingUp className="w-5 h-5" />
                                    Embudo de Conversión
                                </CardTitle>
                                <CardDescription>Flujo de leads por LeadStatus</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <FunnelChart>
                                        <Tooltip />
                                        <Funnel dataKey="count" data={mockData.conversionFunnel} isAnimationActive fill="#73BFB7">
                                            <LabelList position="center" fill="#fff" stroke="none" />
                                        </Funnel>
                                    </FunnelChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                    <BarChart3 className="w-5 h-5" />
                                    Fuentes de Captación
                                </CardTitle>
                                <CardDescription>Distribución por LeadCaptureSource</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RechartsPieChart>
                                        <Pie
                                            data={mockData.leadSources}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="count"
                                            label={({ source, percentage }) => `${source}: ${percentage}%`}
                                        >
                                            {mockData.leadSources.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Gestión de leads */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                <UserPlus className="w-5 h-5" />
                                Gestión de Leads
                            </CardTitle>
                            <CardDescription>Importar, asignar y gestionar leads del sistema</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Button className="flex-1 bg-[#105D88] hover:bg-[#072b3d] text-white">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Importar Leads
                                </Button>
                                <Button className="flex-1 bg-[#17949B] hover:bg-[#105D88] text-white">
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Nuevo Lead
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-red-500" />
                                        <span className="text-sm font-medium">Expirados</span>
                                    </div>
                                    <Badge variant="destructive">{mockData.expiredLeads}</Badge>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-yellow-500" />
                                        <span className="text-sm font-medium">Sin Asignar</span>
                                    </div>
                                    <Badge className="bg-yellow-500 text-white">{mockData.unassignedLeads}</Badge>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-sm font-medium">Completados</span>
                                    </div>
                                    <Badge className="bg-green-500 text-white">{mockData.completedLeads}</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Lista de leads recientes */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-[#072b3d]">Leads Recientes</CardTitle>
                                    <CardDescription>Últimos leads ingresados al sistema</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <Input placeholder="Buscar leads..." className="pl-10 w-64" />
                                    </div>
                                    <Button variant="outline" size="icon">
                                        <Filter className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {mockData.recentLeads.map((lead) => (
                                    <div
                                        key={lead.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-[#105D88] rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                {lead.clientName
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-[#072b3d]">{lead.clientName}</h4>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="w-3 h-3" />
                                                        {lead.clientPhone}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {lead.projectName}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <Badge
                                                    className={`${
                                                        lead.status === "Registered"
                                                            ? "bg-blue-500"
                                                            : lead.status === "Attended"
                                                                ? "bg-green-500"
                                                                : lead.status === "InFollowUp"
                                                                    ? "bg-yellow-500"
                                                                    : "bg-gray-500"
                                                    } text-white`}
                                                >
                                                    {lead.status}
                                                </Badge>
                                                <p className="text-xs text-gray-600 mt-1">{lead.captureSource}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-[#072b3d]">{lead.assignedTo ?? "Sin asignar"}</p>
                                                <p
                                                    className={`text-xs ${
                                                        lead.daysUntilExpiration <= 2
                                                            ? "text-red-600"
                                                            : lead.daysUntilExpiration <= 4
                                                                ? "text-yellow-600"
                                                                : "text-green-600"
                                                    }`}
                                                >
                                                    {lead.daysUntilExpiration} días restantes
                                                </p>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="team" className="space-y-6">
                    {/* Rendimiento del equipo */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                <Users className="w-5 h-5" />
                                Rendimiento del Equipo
                            </CardTitle>
                            <CardDescription>Métricas de eficiencia por asesor</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <ComposedChart data={mockData.advisors}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip />
                                    <Bar yAxisId="left" dataKey="leadsAssigned" fill="#C3E7DF" name="Asignados" />
                                    <Bar yAxisId="left" dataKey="leadsCompleted" fill="#73BFB7" name="Completados" />
                                    <Bar yAxisId="left" dataKey="quotationsIssued" fill="#17949B" name="Cotizaciones" />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="efficiency"
                                        stroke="#072b3d"
                                        strokeWidth={3}
                                        name="Eficiencia %"
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Detalles individuales del equipo */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {mockData.advisors.map((advisor) => (
                            <Card key={advisor.id}>
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-[#105D88] rounded-full flex items-center justify-center text-white font-bold">
                                                {advisor.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-[#072b3d]">{advisor.name}</h3>
                                                <p className="text-xs text-gray-600">Asesor de Ventas</p>
                                            </div>
                                        </div>
                                        <Badge
                                            className={`${advisor.efficiency > 20 ? "bg-[#73BFB7]" : advisor.efficiency > 15 ? "bg-[#17949B]" : "bg-[#105D88]"} text-white`}
                                        >
                                            {advisor.efficiency}%
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="text-center p-2 bg-[#C3E7DF]/20 rounded">
                                            <p className="text-lg font-bold text-[#072b3d]">{advisor.leadsAssigned}</p>
                                            <p className="text-xs text-gray-600">Asignados</p>
                                        </div>
                                        <div className="text-center p-2 bg-[#73BFB7]/20 rounded">
                                            <p className="text-lg font-bold text-[#072b3d]">{advisor.leadsCompleted}</p>
                                            <p className="text-xs text-gray-600">Completados</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="text-center p-2 bg-[#17949B]/20 rounded">
                                            <p className="text-lg font-bold text-[#072b3d]">{advisor.quotationsIssued}</p>
                                            <p className="text-xs text-gray-600">Cotizaciones</p>
                                        </div>
                                        <div className="text-center p-2 bg-[#105D88]/20 rounded">
                                            <p className="text-lg font-bold text-[#072b3d]">{advisor.reservationsGenerated}</p>
                                            <p className="text-xs text-gray-600">Reservaciones</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span>Tareas completadas</span>
                                            <span>
                                                {advisor.tasksCompleted}/{advisor.tasksCompleted + advisor.tasksPending}
                                            </span>
                                        </div>
                                        <Progress
                                            value={(advisor.tasksCompleted / (advisor.tasksCompleted + advisor.tasksPending)) * 100}
                                            className="h-2"
                                        />
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            Respuesta: {advisor.avgResponseTime}h
                                        </span>
                                        <span className="text-gray-600">Última actividad: {advisor.lastActivity}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                            <User className="w-3 h-3 mr-1" />
                                            Ver
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                            <Mail className="w-3 h-3 mr-1" />
                                            Contactar
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="tasks" className="space-y-6">
                    {/* Análisis de tareas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                <Calendar className="w-5 h-5" />
                                Análisis de Tareas por Tipo
                            </CardTitle>
                            <CardDescription>Distribución basada en TaskType del modelo</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <ComposedChart data={mockData.taskAnalysis}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="type" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="completed" fill="#73BFB7" name="Completadas" />
                                    <Bar dataKey="pending" fill="#17949B" name="Pendientes" />
                                    <Bar dataKey="overdue" fill="#072b3d" name="Vencidas" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Detalles de tareas por tipo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockData.taskAnalysis.map((task, index) => (
                            <Card key={index}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-[#072b3d] flex items-center gap-2">
                                        {task.type === "Call" && <Phone className="w-4 h-4" />}
                                        {task.type === "Meeting" && <Users className="w-4 h-4" />}
                                        {task.type === "Email" && <Mail className="w-4 h-4" />}
                                        {task.type === "Visit" && <MapPin className="w-4 h-4" />}
                                        {task.type === "Other" && <Activity className="w-4 h-4" />}
                                        {task.type}
                                    </CardTitle>
                                    <CardDescription>Tareas de tipo {task.type}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="text-center p-2 bg-[#C3E7DF]/20 rounded">
                                            <p className="font-bold text-[#072b3d]">{task.scheduled}</p>
                                            <p className="text-gray-600">Programadas</p>
                                        </div>
                                        <div className="text-center p-2 bg-[#73BFB7]/20 rounded">
                                            <p className="font-bold text-[#072b3d]">{task.completed}</p>
                                            <p className="text-gray-600">Completadas</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="text-center p-2 bg-[#17949B]/20 rounded">
                                            <p className="font-bold text-[#072b3d]">{task.pending}</p>
                                            <p className="text-gray-600">Pendientes</p>
                                        </div>
                                        <div className="text-center p-2 bg-red-100 rounded">
                                            <p className="font-bold text-red-600">{task.overdue}</p>
                                            <p className="text-red-600">Vencidas</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span>Completadas</span>
                                            <span>{Math.round((task.completed / task.scheduled) * 100)}%</span>
                                        </div>
                                        <Progress value={(task.completed / task.scheduled) * 100} className="h-2" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Acciones rápidas para tareas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-[#072b3d]">Gestión de Tareas</CardTitle>
                            <CardDescription>Herramientas para administrar tareas del equipo</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                    <Calendar className="w-6 h-6" />
                                    <span className="text-xs">Programar</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                    <Users className="w-6 h-6" />
                                    <span className="text-xs">Asignar</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                    <AlertTriangle className="w-6 h-6" />
                                    <span className="text-xs">Vencidas</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                    <CheckCircle className="w-6 h-6" />
                                    <span className="text-xs">Completar</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="projects" className="space-y-6">
                    {/* Análisis por proyecto */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                <MapPin className="w-5 h-5" />
                                Rendimiento por Proyecto
                            </CardTitle>
                            <CardDescription>Análisis de leads por proyecto inmobiliario</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <ComposedChart data={mockData.projectLeads}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="project" angle={-45} textAnchor="end" height={100} />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip />
                                    <Bar yAxisId="left" dataKey="leadsReceived" fill="#C3E7DF" name="Recibidos" />
                                    <Bar yAxisId="left" dataKey="leadsAssigned" fill="#73BFB7" name="Asignados" />
                                    <Bar yAxisId="left" dataKey="leadsCompleted" fill="#105D88" name="Completados" />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="conversionRate"
                                        stroke="#072b3d"
                                        strokeWidth={2}
                                        name="Conversión %"
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Detalles por proyecto */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {mockData.projectLeads.map((project, index) => (
                            <Card key={index}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-[#072b3d]">{project.project}</CardTitle>
                                    <CardDescription>Proyecto inmobiliario</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="text-center p-2 bg-[#C3E7DF]/20 rounded">
                                            <p className="font-bold text-[#072b3d]">{project.leadsReceived}</p>
                                            <p className="text-gray-600">Recibidos</p>
                                        </div>
                                        <div className="text-center p-2 bg-[#73BFB7]/20 rounded">
                                            <p className="font-bold text-[#072b3d]">{project.leadsAssigned}</p>
                                            <p className="text-gray-600">Asignados</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="text-center p-2 bg-[#17949B]/20 rounded">
                                            <p className="font-bold text-[#072b3d]">{project.leadsCompleted}</p>
                                            <p className="text-gray-600">Completados</p>
                                        </div>
                                        <div className="text-center p-2 bg-[#105D88]/20 rounded">
                                            <p className="font-bold text-[#072b3d]">{project.avgDaysToComplete}</p>
                                            <p className="text-gray-600">Días prom.</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span>Tasa de Conversión</span>
                                            <span>{project.conversionRate}%</span>
                                        </div>
                                        <Progress value={project.conversionRate} className="h-2" />
                                    </div>
                                    <div className="text-center">
                                        <Badge
                                            className={`${project.conversionRate > 25 ? "bg-[#73BFB7]" : project.conversionRate > 20 ? "bg-[#17949B]" : "bg-[#105D88]"} text-white`}
                                        >
                                            {project.conversionRate > 25 ? "Excelente" : project.conversionRate > 20 ? "Bueno" : "Regular"}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                    {/* Actividad semanal */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                <Activity className="w-5 h-5" />
                                Actividad Semanal
                            </CardTitle>
                            <CardDescription>Flujo de leads durante la semana</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <AreaChart data={mockData.weeklyActivity}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="newLeads"
                                        stackId="1"
                                        stroke="#C3E7DF"
                                        fill="#C3E7DF"
                                        name="Nuevos"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="assigned"
                                        stackId="1"
                                        stroke="#73BFB7"
                                        fill="#73BFB7"
                                        name="Asignados"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="attended"
                                        stackId="1"
                                        stroke="#17949B"
                                        fill="#17949B"
                                        name="Atendidos"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="completed"
                                        stackId="1"
                                        stroke="#105D88"
                                        fill="#105D88"
                                        name="Completados"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Métricas de rendimiento */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="border-l-4 border-l-[#73BFB7]">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Target className="w-6 h-6 text-[#73BFB7]" />
                                    <span className="font-medium text-[#072b3d]">Tasa de Asignación</span>
                                </div>
                                <div className="text-3xl font-bold text-[#072b3d] mb-2">
                                    {Math.round(((mockData.totalLeads - mockData.unassignedLeads) / mockData.totalLeads) * 100)}%
                                </div>
                                <p className="text-sm text-gray-600">
                                    {mockData.totalLeads - mockData.unassignedLeads} de {mockData.totalLeads} leads
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-[#17949B]">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Activity className="w-6 h-6 text-[#17949B]" />
                                    <span className="font-medium text-[#072b3d]">Tiempo Promedio</span>
                                </div>
                                <div className="text-3xl font-bold text-[#072b3d] mb-2">2.8h</div>
                                <p className="text-sm text-gray-600">Respuesta inicial</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-[#105D88]">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingUp className="w-6 h-6 text-[#105D88]" />
                                    <span className="font-medium text-[#072b3d]">Eficiencia Global</span>
                                </div>
                                <div className="text-3xl font-bold text-[#072b3d] mb-2">18.2%</div>
                                <p className="text-sm text-gray-600">Conversión promedio</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-[#072b3d]">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <CheckCircle className="w-6 h-6 text-[#072b3d]" />
                                    <span className="font-medium text-[#072b3d]">Tareas Completadas</span>
                                </div>
                                <div className="text-3xl font-bold text-[#072b3d] mb-2">76%</div>
                                <p className="text-sm text-gray-600">Del total programadas</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>

    );
}
