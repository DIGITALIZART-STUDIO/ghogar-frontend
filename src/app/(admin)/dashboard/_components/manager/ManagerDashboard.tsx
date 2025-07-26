"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    BarChart3,
    TrendingUp,
    Users,
    Target,
    DollarSign,
    Calendar,
    FileText,
    Activity,
    Clock,
    AlertTriangle,
    CheckCircle,
    MapPin,
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
    AreaChart,
    Area,
    ComposedChart,
    PieChart as RechartsPieChart,
    Pie,
    FunnelChart,
    Funnel,
    LabelList,
} from "recharts";

// Datos basados en los modelos reales
const mockData = {
    // KPIs principales basados en Lead model
    totalLeads: 245,
    registeredLeads: 89, // LeadStatus.Registered
    attendedLeads: 67, // LeadStatus.Attended
    inFollowUpLeads: 52, // LeadStatus.InFollowUp
    completedLeads: 28, // LeadStatus.Completed
    canceledLeads: 6, // LeadStatus.Canceled
    expiredLeads: 3, // LeadStatus.Expired

    // Conversión real basada en el flujo
    conversionRate: 11.4, // (completedLeads / totalLeads) * 100

    // Datos por fuente de captación (LeadCaptureSource)
    leadSources: [
        { source: "Company", count: 89, converted: 12, rate: 13.5 },
        { source: "PersonalFacebook", count: 67, converted: 8, rate: 11.9 },
        { source: "RealEstateFair", count: 45, converted: 5, rate: 11.1 },
        { source: "Institutional", count: 32, converted: 2, rate: 6.3 },
        { source: "Loyalty", count: 12, converted: 1, rate: 8.3 },
    ],

    // Embudo de conversión real basado en LeadStatus
    conversionFunnel: [
        { stage: "Registered", count: 89, percentage: 100 },
        { stage: "Attended", count: 67, percentage: 75.3 },
        { stage: "InFollowUp", count: 52, percentage: 58.4 },
        { stage: "Completed", count: 28, percentage: 31.5 },
    ],

    // Cotizaciones basadas en QuotationStatus
    quotations: {
        total: 156,
        issued: 89, // QuotationStatus.ISSUED
        accepted: 45, // QuotationStatus.ACCEPTED
        canceled: 22, // QuotationStatus.CANCELED
    },

    // Reservaciones basadas en ReservationStatus
    reservations: {
        total: 67,
        issued: 45, // ReservationStatus.ISSUED
        canceled: 15, // ReservationStatus.CANCELED
        anulated: 7, // ReservationStatus.ANULATED
    },

    // Rendimiento por asesor basado en datos reales
    advisors: [
        {
            name: "Carlos Mendoza",
            leadsAssigned: 45,
            leadsCompleted: 8,
            quotationsIssued: 15,
            reservationsGenerated: 6,
            conversionRate: 17.8,
            avgResponseTime: 2.5, // horas
        },
        {
            name: "Ana García",
            leadsAssigned: 38,
            leadsCompleted: 6,
            quotationsIssued: 12,
            reservationsGenerated: 4,
            conversionRate: 15.8,
            avgResponseTime: 3.2,
        },
        {
            name: "Luis Torres",
            leadsAssigned: 52,
            leadsCompleted: 9,
            quotationsIssued: 18,
            reservationsGenerated: 7,
            conversionRate: 17.3,
            avgResponseTime: 1.8,
        },
        {
            name: "María López",
            leadsAssigned: 28,
            leadsCompleted: 3,
            quotationsIssued: 9,
            reservationsGenerated: 2,
            conversionRate: 10.7,
            avgResponseTime: 4.1,
        },
        {
            name: "Pedro Ruiz",
            leadsAssigned: 41,
            leadsCompleted: 7,
            quotationsIssued: 14,
            reservationsGenerated: 5,
            conversionRate: 17.1,
            avgResponseTime: 2.9,
        },
    ],

    // Tareas basadas en LeadTask model
    tasks: {
        total: 234,
        calls: 89, // TaskType.Call
        meetings: 45, // TaskType.Meeting
        emails: 67, // TaskType.Email
        visits: 23, // TaskType.Visit
        others: 10, // TaskType.Other
        completed: 178,
        pending: 56,
    },

    // Análisis temporal de leads
    monthlyLeadData: [
        { month: "Ene", registered: 45, attended: 32, completed: 8, expired: 2 },
        { month: "Feb", registered: 52, attended: 38, completed: 12, expired: 1 },
        { month: "Mar", registered: 48, attended: 35, completed: 10, expired: 3 },
        { month: "Apr", registered: 61, attended: 45, completed: 15, expired: 2 },
        { month: "May", registered: 55, attended: 41, completed: 14, expired: 1 },
        { month: "Jun", registered: 67, attended: 52, completed: 18, expired: 0 },
    ],

    // Análisis por proyecto
    projectAnalysis: [
        {
            project: "Villa Los Jardines",
            leadsReceived: 45,
            leadsCompleted: 8,
            quotationsIssued: 15,
            reservationsMade: 6,
            conversionRate: 17.8,
        },
        {
            project: "Residencial San Carlos",
            leadsReceived: 62,
            leadsCompleted: 12,
            quotationsIssued: 24,
            reservationsMade: 9,
            conversionRate: 19.4,
        },
        {
            project: "Urbanización El Bosque",
            leadsReceived: 38,
            leadsCompleted: 5,
            quotationsIssued: 12,
            reservationsMade: 3,
            conversionRate: 13.2,
        },
        {
            project: "Condominio Las Flores",
            leadsReceived: 52,
            leadsCompleted: 11,
            quotationsIssued: 18,
            reservationsMade: 8,
            conversionRate: 21.2,
        },
        {
            project: "Proyecto Alameda",
            leadsReceived: 28,
            leadsCompleted: 3,
            quotationsIssued: 8,
            reservationsMade: 2,
            conversionRate: 10.7,
        },
    ],

    // Análisis de tiempo de respuesta y gestión
    responseAnalysis: [
        { metric: "Tiempo Promedio de Respuesta", value: 2.8, unit: "horas", status: "good" },
        { metric: "Leads Expirados por Falta de Seguimiento", value: 3, unit: "leads", status: "warning" },
        { metric: "Tasa de Reciclaje de Leads", value: 15.2, unit: "%", status: "good" },
        { metric: "Tiempo Promedio Lead → Cotización", value: 4.5, unit: "días", status: "good" },
    ],
};

export default function ManagerDashboard() {
    return (

        <div className="space-y-6">
            {/* KPIs Principales basados en Lead Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                <Card className="bg-gradient-to-br from-[#17949B] to-[#73BFB7] text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-xs">Leads Totales</p>
                                <p className="text-2xl font-bold">{mockData.totalLeads}</p>
                                <p className="text-white/60 text-xs">En el sistema</p>
                            </div>
                            <Activity className="w-8 h-8 text-white/60" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#73BFB7] to-[#C3E7DF] text-[#072b3d]">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#072b3d]/80 text-xs">Tasa Conversión</p>
                                <p className="text-2xl font-bold">{mockData.conversionRate}%</p>
                                <p className="text-[#072b3d]/60 text-xs">{mockData.completedLeads} completados</p>
                            </div>
                            <Target className="w-8 h-8 text-[#072b3d]/60" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#105D88] to-[#17949B] text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-xs">Cotizaciones</p>
                                <p className="text-2xl font-bold">{mockData.quotations.total}</p>
                                <p className="text-white/60 text-xs">{mockData.quotations.accepted} aceptadas</p>
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
                                <p className="text-2xl font-bold">{mockData.reservations.total}</p>
                                <p className="text-white/60 text-xs">{mockData.reservations.issued} activas</p>
                            </div>
                            <DollarSign className="w-8 h-8 text-white/60" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#C3E7DF] to-white text-[#072b3d] border-2 border-[#73BFB7]">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#072b3d]/80 text-xs">En Seguimiento</p>
                                <p className="text-2xl font-bold">{mockData.inFollowUpLeads}</p>
                                <p className="text-[#072b3d]/60 text-xs">Leads activos</p>
                            </div>
                            <Users className="w-8 h-8 text-[#072b3d]/60" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-white to-[#C3E7DF] text-[#072b3d] border-2 border-[#105D88]">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#072b3d]/80 text-xs">Expirados</p>
                                <p className="text-2xl font-bold">{mockData.expiredLeads}</p>
                                <p className="text-[#072b3d]/60 text-xs">Requieren atención</p>
                            </div>
                            <AlertTriangle className="w-8 h-8 text-[#072b3d]/60" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs organizadas */}
            <Tabs defaultValue="conversion" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="conversion">Conversión</TabsTrigger>
                    <TabsTrigger value="team">Equipo</TabsTrigger>
                    <TabsTrigger value="sources">Fuentes</TabsTrigger>
                    <TabsTrigger value="projects">Proyectos</TabsTrigger>
                    <TabsTrigger value="operations">Operaciones</TabsTrigger>
                </TabsList>

                <TabsContent value="conversion" className="space-y-6">
                    {/* Embudo de conversión basado en LeadStatus */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                    <TrendingUp className="w-5 h-5" />
                                    Embudo de Conversión de Leads
                                </CardTitle>
                                <CardDescription>Flujo real basado en estados de leads</CardDescription>
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
                                    Estados de Cotizaciones
                                </CardTitle>
                                <CardDescription>Distribución por QuotationStatus</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RechartsPieChart>
                                        <Pie
                                            data={[
                                                { name: "Emitidas", value: mockData.quotations.issued, fill: "#73BFB7" },
                                                { name: "Aceptadas", value: mockData.quotations.accepted, fill: "#17949B" },
                                                { name: "Canceladas", value: mockData.quotations.canceled, fill: "#105D88" },
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            dataKey="value"
                                            label={({ name, value }) => `${name}: ${value}`}
                                        />
                                        <Tooltip />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Evolución mensual de leads */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                <Activity className="w-5 h-5" />
                                Evolución Mensual de Leads
                            </CardTitle>
                            <CardDescription>Seguimiento de estados por mes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <AreaChart data={mockData.monthlyLeadData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="registered"
                                        stackId="1"
                                        stroke="#C3E7DF"
                                        fill="#C3E7DF"
                                        name="Registrados"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="attended"
                                        stackId="1"
                                        stroke="#73BFB7"
                                        fill="#73BFB7"
                                        name="Atendidos"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="completed"
                                        stackId="1"
                                        stroke="#17949B"
                                        fill="#17949B"
                                        name="Completados"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="expired"
                                        stackId="1"
                                        stroke="#072b3d"
                                        fill="#072b3d"
                                        name="Expirados"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Métricas de gestión */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {mockData.responseAnalysis.map((metric, index) => (
                            <Card key={index}>
                                <CardContent className="p-6 text-center">
                                    <div className="mb-4">
                                        <div
                                            className={`text-3xl font-bold mb-2 ${
                                                metric.status === "good"
                                                    ? "text-green-600"
                                                    : metric.status === "warning"
                                                        ? "text-yellow-600"
                                                        : "text-red-600"
                                            }`}
                                        >
                                            {metric.value}
                                            {metric.unit}
                                        </div>
                                        <p className="text-sm text-gray-600">{metric.metric}</p>
                                    </div>
                                    <Badge
                                        className={`${
                                            metric.status === "good"
                                                ? "bg-green-500"
                                                : metric.status === "warning"
                                                    ? "bg-yellow-500"
                                                    : "bg-red-500"
                                        } text-white`}
                                    >
                                        {metric.status === "good" ? "Excelente" : metric.status === "warning" ? "Atención" : "Crítico"}
                                    </Badge>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="team" className="space-y-6">
                    {/* Rendimiento del equipo basado en datos reales */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                <Users className="w-5 h-5" />
                                Rendimiento del Equipo de Ventas
                            </CardTitle>
                            <CardDescription>Métricas reales de conversión y gestión</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <ComposedChart data={mockData.advisors}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip />
                                    <Bar yAxisId="left" dataKey="leadsAssigned" fill="#C3E7DF" name="Leads Asignados" />
                                    <Bar yAxisId="left" dataKey="leadsCompleted" fill="#73BFB7" name="Leads Completados" />
                                    <Bar yAxisId="left" dataKey="quotationsIssued" fill="#17949B" name="Cotizaciones" />
                                    <Bar yAxisId="left" dataKey="reservationsGenerated" fill="#105D88" name="Reservaciones" />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="conversionRate"
                                        stroke="#072b3d"
                                        strokeWidth={3}
                                        name="Conversión %"
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Detalles individuales */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {mockData.advisors.map((advisor, index) => (
                            <Card key={index}>
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#105D88] rounded-full flex items-center justify-center text-white text-sm font-bold">
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
                                        <Badge className={`${advisor.conversionRate > 15 ? "bg-[#73BFB7]" : "bg-[#17949B]"} text-white`}>
                                            {advisor.conversionRate}%
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="text-center p-2 bg-[#C3E7DF]/20 rounded">
                                            <p className="text-lg font-bold text-[#072b3d]">{advisor.leadsAssigned}</p>
                                            <p className="text-xs text-gray-600">Leads Asignados</p>
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
                                    <div className="text-center p-2 bg-yellow-50 border border-yellow-200 rounded">
                                        <p className="text-sm font-medium text-yellow-800">
                                            <Clock className="w-4 h-4 inline mr-1" />
                                            Tiempo respuesta: {advisor.avgResponseTime}h
                                        </p>
                                    </div>
                                    <Progress value={advisor.conversionRate} className="h-2" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="sources" className="space-y-6">
                    {/* Análisis por fuente de captación */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                <Activity className="w-5 h-5" />
                                Análisis por Fuente de Captación
                            </CardTitle>
                            <CardDescription>Rendimiento por LeadCaptureSource</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <ComposedChart data={mockData.leadSources}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="source" />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip />
                                    <Bar yAxisId="left" dataKey="count" fill="#73BFB7" name="Leads Totales" />
                                    <Bar yAxisId="left" dataKey="converted" fill="#105D88" name="Convertidos" />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="rate"
                                        stroke="#072b3d"
                                        strokeWidth={2}
                                        name="Tasa Conversión %"
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Detalles por fuente */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockData.leadSources.map((source, index) => (
                            <Card key={index}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-[#072b3d]">{source.source}</CardTitle>
                                    <CardDescription>Fuente de captación</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="text-center p-2 bg-[#C3E7DF]/20 rounded">
                                            <p className="font-bold text-[#072b3d]">{source.count}</p>
                                            <p className="text-gray-600">Leads</p>
                                        </div>
                                        <div className="text-center p-2 bg-[#73BFB7]/20 rounded">
                                            <p className="font-bold text-[#072b3d]">{source.converted}</p>
                                            <p className="text-gray-600">Convertidos</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span>Tasa de Conversión</span>
                                            <span>{source.rate}%</span>
                                        </div>
                                        <Progress value={source.rate} className="h-2" />
                                    </div>
                                    <div className="text-center">
                                        <Badge
                                            className={`${source.rate > 12 ? "bg-[#73BFB7]" : source.rate > 8 ? "bg-[#17949B]" : "bg-[#105D88]"} text-white`}
                                        >
                                            {source.rate > 12 ? "Excelente" : source.rate > 8 ? "Bueno" : "Regular"}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="projects" className="space-y-6">
                    {/* Análisis por proyecto */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                <MapPin className="w-5 h-5" />
                                Rendimiento por Proyecto Inmobiliario
                            </CardTitle>
                            <CardDescription>Análisis de leads y conversiones por proyecto</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <ComposedChart data={mockData.projectAnalysis}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="project" angle={-45} textAnchor="end" height={100} />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip />
                                    <Bar yAxisId="left" dataKey="leadsReceived" fill="#C3E7DF" name="Leads Recibidos" />
                                    <Bar yAxisId="left" dataKey="quotationsIssued" fill="#73BFB7" name="Cotizaciones" />
                                    <Bar yAxisId="left" dataKey="reservationsMade" fill="#105D88" name="Reservaciones" />
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
                        {mockData.projectAnalysis.map((project, index) => (
                            <Card key={index}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-[#072b3d]">{project.project}</CardTitle>
                                    <CardDescription>Proyecto inmobiliario</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="text-center p-2 bg-[#C3E7DF]/20 rounded">
                                            <p className="font-bold text-[#072b3d]">{project.leadsReceived}</p>
                                            <p className="text-gray-600">Leads</p>
                                        </div>
                                        <div className="text-center p-2 bg-[#73BFB7]/20 rounded">
                                            <p className="font-bold text-[#072b3d]">{project.leadsCompleted}</p>
                                            <p className="text-gray-600">Completados</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="text-center p-2 bg-[#17949B]/20 rounded">
                                            <p className="font-bold text-[#072b3d]">{project.quotationsIssued}</p>
                                            <p className="text-gray-600">Cotizaciones</p>
                                        </div>
                                        <div className="text-center p-2 bg-[#105D88]/20 rounded">
                                            <p className="font-bold text-[#072b3d]">{project.reservationsMade}</p>
                                            <p className="text-gray-600">Reservaciones</p>
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
                                            className={`${project.conversionRate > 18 ? "bg-[#73BFB7]" : project.conversionRate > 15 ? "bg-[#17949B]" : "bg-[#105D88]"} text-white`}
                                        >
                                            {project.conversionRate > 18 ? "Excelente" : project.conversionRate > 15 ? "Bueno" : "Regular"}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="operations" className="space-y-6">
                    {/* Análisis de tareas basado en LeadTask */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                <Calendar className="w-5 h-5" />
                                Análisis de Tareas del Equipo
                            </CardTitle>
                            <CardDescription>Distribución por TaskType</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={[
                                        {
                                            type: "Calls",
                                            count: mockData.tasks.calls,
                                            completed: Math.round(mockData.tasks.calls * 0.76),
                                        },
                                        {
                                            type: "Meetings",
                                            count: mockData.tasks.meetings,
                                            completed: Math.round(mockData.tasks.meetings * 0.82),
                                        },
                                        {
                                            type: "Emails",
                                            count: mockData.tasks.emails,
                                            completed: Math.round(mockData.tasks.emails * 0.71),
                                        },
                                        {
                                            type: "Visits",
                                            count: mockData.tasks.visits,
                                            completed: Math.round(mockData.tasks.visits * 0.89),
                                        },
                                        {
                                            type: "Others",
                                            count: mockData.tasks.others,
                                            completed: Math.round(mockData.tasks.others * 0.65),
                                        },
                                    ]}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="type" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#73BFB7" name="Total Tareas" />
                                    <Bar dataKey="completed" fill="#105D88" name="Completadas" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Estados críticos */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border-l-4 border-l-red-500">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <AlertTriangle className="w-6 h-6 text-red-500" />
                                    <span className="font-medium text-red-800">Leads Expirados</span>
                                </div>
                                <div className="text-3xl font-bold text-red-600 mb-2">{mockData.expiredLeads}</div>
                                <p className="text-sm text-red-700">Requieren reciclaje inmediato</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-yellow-500">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Clock className="w-6 h-6 text-yellow-500" />
                                    <span className="font-medium text-yellow-800">Tareas Pendientes</span>
                                </div>
                                <div className="text-3xl font-bold text-yellow-600 mb-2">{mockData.tasks.pending}</div>
                                <p className="text-sm text-yellow-700">Requieren seguimiento</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-500">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                    <span className="font-medium text-green-800">Reservaciones Activas</span>
                                </div>
                                <div className="text-3xl font-bold text-green-600 mb-2">{mockData.reservations.issued}</div>
                                <p className="text-sm text-green-700">En proceso de pago</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Acciones rápidas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-[#072b3d]">Acciones de Gestión</CardTitle>
                            <CardDescription>Herramientas para optimizar el proceso de ventas</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                    <Activity className="w-6 h-6" />
                                    <span className="text-xs">Reciclar Leads</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                    <Users className="w-6 h-6" />
                                    <span className="text-xs">Reasignar</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                    <Calendar className="w-6 h-6" />
                                    <span className="text-xs">Programar</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                                    <Target className="w-6 h-6" />
                                    <span className="text-xs">Metas</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
