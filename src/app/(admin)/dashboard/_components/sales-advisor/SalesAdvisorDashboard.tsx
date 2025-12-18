"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Phone,
    Calendar,
    FileText,
    DollarSign,
    Clock,
    AlertTriangle,
    CheckCircle,
    Search,
    User,
    Mail,
    MapPin,
    Target,
    Activity,
    BarChart3,
    TrendingUp,
    Plus,
    Edit,
    Eye,
    MessageSquare,
    UserPlus,
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
    ComposedChart,
    PieChart as RechartsPieChart,
    Cell,
    Pie,
} from "recharts";

// Datos basados en los modelos reales para un asesor específico
const mockData = {
    // KPIs personales basados en Lead model
    myLeads: {
        total: 45,
        registered: 12, // LeadStatus.Registered - nuevos asignados
        attended: 18, // LeadStatus.Attended - ya contactados
        inFollowUp: 10, // LeadStatus.InFollowUp - en proceso
        completed: 4, // LeadStatus.Completed - cerrados exitosamente
        canceled: 1, // LeadStatus.Canceled - cancelados
        expired: 0, // LeadStatus.Expired - vencidos
    },

    // Métricas de rendimiento personal
    performance: {
        conversionRate: 8.9, // (completed / total) * 100
        avgResponseTime: 2.3, // horas
        quotationsIssued: 15,
        reservationsGenerated: 3,
        tasksCompleted: 28,
        tasksPending: 7,
    },

    // Mis leads asignados con datos del modelo
    assignedLeads: [
        {
            id: 1,
            clientName: "Juan Pérez",
            clientPhone: "987654321",
            clientEmail: "juan.perez@email.com",
            captureSource: "Company", // LeadCaptureSource
            status: "Registered", // LeadStatus
            daysUntilExpiration: 6,
            projectName: "Villa Los Jardines",
            entryDate: "2024-01-10",
            lastContact: null,
            nextTask: "Llamada inicial",
            priority: "high",
        },
        {
            id: 2,
            clientName: "María González",
            clientPhone: "987654322",
            clientEmail: "maria.gonzalez@email.com",
            captureSource: "RealEstateFair",
            status: "InFollowUp",
            daysUntilExpiration: 3,
            projectName: "Residencial San Carlos",
            entryDate: "2024-01-08",
            lastContact: "2024-01-12",
            nextTask: "Reunión presencial",
            priority: "high",
        },
        {
            id: 3,
            clientName: "Carlos Ruiz",
            clientPhone: "987654323",
            clientEmail: "carlos.ruiz@email.com",
            captureSource: "PersonalFacebook",
            status: "Attended",
            daysUntilExpiration: 5,
            projectName: "Urbanización El Bosque",
            entryDate: "2024-01-09",
            lastContact: "2024-01-11",
            nextTask: "Enviar cotización",
            priority: "medium",
        },
        {
            id: 4,
            clientName: "Ana Torres",
            clientPhone: "987654324",
            clientEmail: "ana.torres@email.com",
            captureSource: "Institutional",
            status: "Attended",
            daysUntilExpiration: 4,
            projectName: "Condominio Las Flores",
            entryDate: "2024-01-07",
            lastContact: "2024-01-10",
            nextTask: "Seguimiento telefónico",
            priority: "medium",
        },
        {
            id: 5,
            clientName: "Luis Mendoza",
            clientPhone: "987654325",
            clientEmail: "luis.mendoza@email.com",
            captureSource: "Loyalty",
            status: "InFollowUp",
            daysUntilExpiration: 2,
            projectName: "Proyecto Alameda",
            entryDate: "2024-01-05",
            lastContact: "2024-01-13",
            nextTask: "Visita al proyecto",
            priority: "high",
        },
    ],

    // Mis tareas basadas en LeadTask model
    myTasks: [
        {
            id: 1,
            leadId: 1,
            clientName: "Juan Pérez",
            type: "Call", // TaskType.Call
            description: "Llamada inicial para presentar proyecto",
            scheduledDate: "2024-01-16T09:00:00",
            isCompleted: false,
            priority: "high",
        },
        {
            id: 2,
            leadId: 2,
            clientName: "María González",
            type: "Meeting", // TaskType.Meeting
            description: "Reunión presencial en oficina",
            scheduledDate: "2024-01-16T14:00:00",
            isCompleted: false,
            priority: "high",
        },
        {
            id: 3,
            leadId: 3,
            clientName: "Carlos Ruiz",
            type: "Email", // TaskType.Email
            description: "Enviar cotización personalizada",
            scheduledDate: "2024-01-16T11:00:00",
            isCompleted: false,
            priority: "medium",
        },
        {
            id: 4,
            leadId: 4,
            clientName: "Ana Torres",
            type: "Call", // TaskType.Call
            description: "Seguimiento post-reunión",
            scheduledDate: "2024-01-16T16:00:00",
            isCompleted: false,
            priority: "medium",
        },
        {
            id: 5,
            leadId: 5,
            clientName: "Luis Mendoza",
            type: "Visit", // TaskType.Visit
            description: "Visita guiada al proyecto",
            scheduledDate: "2024-01-17T10:00:00",
            isCompleted: false,
            priority: "high",
        },
    ],

    // Mis cotizaciones basadas en Quotation model
    myQuotations: [
        {
            id: 1,
            code: "COT-2024-001",
            clientName: "María González",
            projectName: "Residencial San Carlos",
            lotNumber: "A-15",
            totalPrice: 85000,
            finalPrice: 80750, // con descuento
            status: "ISSUED", // QuotationStatus.ISSUED
            quotationDate: "2024-01-12",
            validUntil: "2024-01-26",
            currency: "USD",
        },
        {
            id: 2,
            code: "COT-2024-002",
            clientName: "Carlos Ruiz",
            projectName: "Urbanización El Bosque",
            lotNumber: "B-08",
            totalPrice: 72000,
            finalPrice: 70200,
            status: "ACCEPTED", // QuotationStatus.ACCEPTED
            quotationDate: "2024-01-10",
            validUntil: "2024-01-24",
            currency: "USD",
        },
        {
            id: 3,
            code: "COT-2024-003",
            clientName: "Ana Torres",
            projectName: "Condominio Las Flores",
            lotNumber: "C-12",
            totalPrice: 95000,
            finalPrice: 92150,
            status: "ISSUED",
            quotationDate: "2024-01-13",
            validUntil: "2024-01-27",
            currency: "USD",
        },
    ],

    // Mis reservaciones basadas en Reservation model
    myReservations: [
        {
            id: 1,
            clientName: "Carlos Ruiz",
            projectName: "Urbanización El Bosque",
            lotNumber: "B-08",
            amountPaid: 5000,
            currency: "SOLES", // Currency.SOLES
            status: "ISSUED", // ReservationStatus.ISSUED
            paymentMethod: "BANK_TRANSFER", // PaymentMethod.BANK_TRANSFER
            reservationDate: "2024-01-14",
            expiresAt: "2024-01-18",
            notified: true,
        },
        {
            id: 2,
            clientName: "Luis Mendoza",
            projectName: "Proyecto Alameda",
            lotNumber: "D-05",
            amountPaid: 3500,
            currency: "SOLES",
            status: "ISSUED",
            paymentMethod: "CASH", // PaymentMethod.CASH
            reservationDate: "2024-01-13",
            expiresAt: "2024-01-17",
            notified: false,
        },
    ],

    // Análisis temporal de mi rendimiento
    monthlyPerformance: [
        { month: "Oct", leadsAssigned: 12, leadsCompleted: 2, quotations: 5, reservations: 1 },
        { month: "Nov", leadsAssigned: 15, leadsCompleted: 3, quotations: 7, reservations: 2 },
        { month: "Dic", leadsAssigned: 18, leadsCompleted: 4, quotations: 8, reservations: 3 },
        { month: "Ene", leadsAssigned: 22, leadsCompleted: 6, quotations: 12, reservations: 4 },
    ],

    // Distribución de mis leads por fuente
    myLeadSources: [
        { source: "Company", count: 15, converted: 2, color: "#73BFB7" },
        { source: "PersonalFacebook", count: 12, converted: 1, color: "#17949B" },
        { source: "RealEstateFair", count: 8, converted: 1, color: "#105D88" },
        { source: "Institutional", count: 7, converted: 0, color: "#072b3d" },
        { source: "Loyalty", count: 3, converted: 0, color: "#C3E7DF" },
    ],

    // Análisis de tareas por tipo
    tasksByType: [
        { type: "Call", scheduled: 15, completed: 12, pending: 3 },
        { type: "Meeting", scheduled: 8, completed: 6, pending: 2 },
        { type: "Email", scheduled: 12, completed: 10, pending: 2 },
        { type: "Visit", scheduled: 5, completed: 3, pending: 2 },
        { type: "Other", scheduled: 3, completed: 2, pending: 1 },
    ],

    // Proyectos donde tengo leads asignados
    myProjects: [
        {
            project: "Villa Los Jardines",
            leadsAssigned: 12,
            leadsCompleted: 2,
            quotationsIssued: 4,
            reservationsMade: 1,
            conversionRate: 16.7,
        },
        {
            project: "Residencial San Carlos",
            leadsAssigned: 15,
            leadsCompleted: 3,
            quotationsIssued: 6,
            reservationsMade: 2,
            conversionRate: 20.0,
        },
        {
            project: "Urbanización El Bosque",
            leadsAssigned: 8,
            leadsCompleted: 1,
            quotationsIssued: 3,
            reservationsMade: 1,
            conversionRate: 12.5,
        },
        {
            project: "Condominio Las Flores",
            leadsAssigned: 7,
            leadsCompleted: 1,
            quotationsIssued: 2,
            reservationsMade: 0,
            conversionRate: 14.3,
        },
        {
            project: "Proyecto Alameda",
            leadsAssigned: 3,
            leadsCompleted: 0,
            quotationsIssued: 1,
            reservationsMade: 0,
            conversionRate: 0.0,
        },
    ],
};

export default function SalesAdvisorDashboard() {
    return (
        <div className="space-y-6">
            {/* KPIs Personales basados en Lead Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                <Card className="bg-gradient-to-br from-[#73BFB7] to-[#C3E7DF] text-[#072b3d]">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#072b3d]/80 text-xs">Mis Leads</p>
                                <p className="text-2xl font-bold">{mockData.myLeads.total}</p>
                                <p className="text-[#072b3d]/60 text-xs">Asignados</p>
                            </div>
                            <User className="w-8 h-8 text-[#072b3d]/60" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#17949B] to-[#73BFB7] text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-xs">En Seguimiento</p>
                                <p className="text-2xl font-bold">{mockData.myLeads.inFollowUp}</p>
                                <p className="text-white/60 text-xs">Activos</p>
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
                                <p className="text-2xl font-bold">{mockData.performance.quotationsIssued}</p>
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
                                <p className="text-2xl font-bold">{mockData.performance.reservationsGenerated}</p>
                                <p className="text-white/60 text-xs">Logradas</p>
                            </div>
                            <DollarSign className="w-8 h-8 text-white/60" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#C3E7DF] to-white text-[#072b3d] border-2 border-[#73BFB7]">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#072b3d]/80 text-xs">Conversión</p>
                                <p className="text-2xl font-bold">{mockData.performance.conversionRate}%</p>
                                <p className="text-[#072b3d]/60 text-xs">Mi tasa</p>
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
                                <p className="text-2xl font-bold">{mockData.performance.tasksPending}</p>
                                <p className="text-[#072b3d]/60 text-xs">Pendientes</p>
                            </div>
                            <Calendar className="w-8 h-8 text-[#072b3d]/60" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs organizadas */}
            <Tabs defaultValue="leads" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="leads">Mis Leads</TabsTrigger>
                    <TabsTrigger value="tasks">Mis Tareas</TabsTrigger>
                    <TabsTrigger value="quotations">Cotizaciones</TabsTrigger>
                    <TabsTrigger value="reservations">Reservaciones</TabsTrigger>
                    <TabsTrigger value="performance">Mi Rendimiento</TabsTrigger>
                </TabsList>

                <TabsContent value="leads" className="space-y-6">
                    {/* Gestión rápida de leads */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                <UserPlus className="w-5 h-5" />
                                Gestión Rápida
                            </CardTitle>
                            <CardDescription>Acciones inmediatas para mis leads</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Button className="h-16 flex-col gap-2 bg-[#105D88] hover:bg-[#072b3d] text-white">
                                    <Plus className="w-5 h-5" />
                                    <span className="text-xs">Nuevo Lead</span>
                                </Button>
                                <Button className="h-16 flex-col gap-2 bg-[#17949B] hover:bg-[#105D88] text-white">
                                    <Phone className="w-5 h-5" />
                                    <span className="text-xs">Llamar</span>
                                </Button>
                                <Button className="h-16 flex-col gap-2 bg-[#73BFB7] hover:bg-[#17949B] text-white">
                                    <FileText className="w-5 h-5" />
                                    <span className="text-xs">Cotizar</span>
                                </Button>
                                <Button className="h-16 flex-col gap-2 bg-[#C3E7DF] hover:bg-[#73BFB7] text-[#072b3d]">
                                    <Calendar className="w-5 h-5" />
                                    <span className="text-xs">Programar</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Lista de mis leads asignados */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-[#072b3d]">Mis Leads Asignados</CardTitle>
                                    <CardDescription>Leads bajo mi responsabilidad</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <Input placeholder="Buscar cliente..." className="pl-10 w-64" />
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockData.assignedLeads.map((lead) => (
                                    <div
                                        key={lead.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-[#105D88] rounded-full flex items-center justify-center text-white font-bold">
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
                                                        <Mail className="w-3 h-3" />
                                                        {lead.clientEmail}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {lead.projectName}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge
                                                        className={`text-xs ${
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
                                                    <span className="text-xs text-gray-500">{lead.captureSource}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-[#072b3d]">{lead.nextTask}</p>
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
                                                {lead.lastContact && (
                                                    <p className="text-xs text-gray-500">Último contacto: {lead.lastContact}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm">
                                                    <Phone className="w-3 h-3" />
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    <Mail className="w-3 h-3" />
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Análisis de mis fuentes */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                    <BarChart3 className="w-5 h-5" />
                                    Mis Fuentes de Leads
                                </CardTitle>
                                <CardDescription>Distribución por LeadCaptureSource</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RechartsPieChart>
                                        <Pie
                                            data={mockData.myLeadSources}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="count"
                                            label={({ source, count }) => `${source}: ${count}`}
                                        >
                                            {mockData.myLeadSources.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                    <TrendingUp className="w-5 h-5" />
                                    Mi Rendimiento Mensual
                                </CardTitle>
                                <CardDescription>Evolución de mi gestión</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <ComposedChart data={mockData.monthlyPerformance}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="leadsAssigned" fill="#C3E7DF" name="Asignados" />
                                        <Bar dataKey="leadsCompleted" fill="#73BFB7" name="Completados" />
                                        <Bar dataKey="quotations" fill="#17949B" name="Cotizaciones" />
                                        <Line
                                            type="monotone"
                                            dataKey="reservations"
                                            stroke="#072b3d"
                                            strokeWidth={2}
                                            name="Reservaciones"
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="tasks" className="space-y-6">
                    {/* Mis tareas de hoy */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                <Calendar className="w-5 h-5" />
                                Mis Tareas de Hoy
                            </CardTitle>
                            <CardDescription>Tareas programadas basadas en LeadTask</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {mockData.myTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                                                    task.type === "Call"
                                                        ? "bg-[#73BFB7]"
                                                        : task.type === "Meeting"
                                                            ? "bg-[#17949B]"
                                                            : task.type === "Email"
                                                                ? "bg-[#105D88]"
                                                                : task.type === "Visit"
                                                                    ? "bg-[#072b3d]"
                                                                    : "bg-gray-500"
                                                }`}
                                            >
                                                {task.type === "Call" && <Phone className="w-5 h-5" />}
                                                {task.type === "Meeting" && <User className="w-5 h-5" />}
                                                {task.type === "Email" && <Mail className="w-5 h-5" />}
                                                {task.type === "Visit" && <MapPin className="w-5 h-5" />}
                                                {task.type === "Other" && <Activity className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-[#072b3d]">{task.clientName}</h4>
                                                <p className="text-sm text-gray-600">{task.description}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className="text-xs">
                                                        {task.type}
                                                    </Badge>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(task.scheduledDate).toLocaleTimeString("es-ES", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                className={`${
                                                    task.priority === "high"
                                                        ? "bg-red-500"
                                                        : task.priority === "medium"
                                                            ? "bg-yellow-500"
                                                            : "bg-green-500"
                                                } text-white`}
                                            >
                                                {task.priority}
                                            </Badge>
                                            <Button variant="outline" size="sm">
                                                <CheckCircle className="w-4 h-4" />
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Análisis de mis tareas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                <Activity className="w-5 h-5" />
                                Análisis de Mis Tareas
                            </CardTitle>
                            <CardDescription>Distribución por TaskType</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={mockData.tasksByType}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="type" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="completed" fill="#73BFB7" name="Completadas" />
                                    <Bar dataKey="pending" fill="#17949B" name="Pendientes" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Resumen de productividad */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border-l-4 border-l-[#73BFB7]">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <CheckCircle className="w-6 h-6 text-[#73BFB7]" />
                                    <span className="font-medium text-[#072b3d]">Tareas Completadas</span>
                                </div>
                                <div className="text-3xl font-bold text-[#072b3d] mb-2">{mockData.performance.tasksCompleted}</div>
                                <p className="text-sm text-gray-600">Este mes</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-[#17949B]">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Clock className="w-6 h-6 text-[#17949B]" />
                                    <span className="font-medium text-[#072b3d]">Tiempo Respuesta</span>
                                </div>
                                <div className="text-3xl font-bold text-[#072b3d] mb-2">{mockData.performance.avgResponseTime}h</div>
                                <p className="text-sm text-gray-600">Promedio</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-[#105D88]">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Target className="w-6 h-6 text-[#105D88]" />
                                    <span className="font-medium text-[#072b3d]">Eficiencia</span>
                                </div>
                                <div className="text-3xl font-bold text-[#072b3d] mb-2">
                                    {Math.round(
                                        (mockData.performance.tasksCompleted /
                        (mockData.performance.tasksCompleted + mockData.performance.tasksPending)) *
                        100,
                                    )}
                                    %
                                </div>
                                <p className="text-sm text-gray-600">Tareas completadas</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="quotations" className="space-y-6">
                    {/* Mis cotizaciones */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-[#072b3d]">Mis Cotizaciones</CardTitle>
                                    <CardDescription>Cotizaciones generadas basadas en Quotation model</CardDescription>
                                </div>
                                <Button className="bg-[#105D88] hover:bg-[#072b3d] text-white">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nueva Cotización
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockData.myQuotations.map((quotation) => (
                                    <div
                                        key={quotation.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-[#17949B] rounded-lg flex items-center justify-center text-white font-bold">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-[#072b3d]">{quotation.code}</h4>
                                                <p className="text-sm text-gray-600">{quotation.clientName}</p>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {quotation.projectName} - Lote {quotation.lotNumber}
                                                    </span>
                                                    <span>Fecha: {quotation.quotationDate}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-[#072b3d]">
                                                    ${quotation.finalPrice.toLocaleString()} {quotation.currency}
                                                </p>
                                                <p className="text-sm text-gray-500">Original: ${quotation.totalPrice.toLocaleString()}</p>
                                                <p className="text-xs text-gray-500">Válida hasta: {quotation.validUntil}</p>
                                            </div>
                                            <div className="flex flex-col items-center gap-2">
                                                <Badge
                                                    className={`${
                                                        quotation.status === "ISSUED"
                                                            ? "bg-blue-500"
                                                            : quotation.status === "ACCEPTED"
                                                                ? "bg-green-500"
                                                                : "bg-red-500"
                                                    } text-white`}
                                                >
                                                    {quotation.status}
                                                </Badge>
                                                <div className="flex gap-1">
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="w-3 h-3" />
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Estados de cotizaciones */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border-l-4 border-l-blue-500">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <FileText className="w-6 h-6 text-blue-500" />
                                    <span className="font-medium text-[#072b3d]">Emitidas</span>
                                </div>
                                <div className="text-3xl font-bold text-[#072b3d] mb-2">
                                    {mockData.myQuotations.filter((q) => q.status === "ISSUED").length}
                                </div>
                                <p className="text-sm text-gray-600">Pendientes de respuesta</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-500">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                    <span className="font-medium text-[#072b3d]">Aceptadas</span>
                                </div>
                                <div className="text-3xl font-bold text-[#072b3d] mb-2">
                                    {mockData.myQuotations.filter((q) => q.status === "ACCEPTED").length}
                                </div>
                                <p className="text-sm text-gray-600">Listas para reservar</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-[#105D88]">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <DollarSign className="w-6 h-6 text-[#105D88]" />
                                    <span className="font-medium text-[#072b3d]">Valor Total</span>
                                </div>
                                <div className="text-3xl font-bold text-[#072b3d] mb-2">
                                    ${mockData.myQuotations.reduce((sum, q) => sum + q.finalPrice, 0).toLocaleString()}
                                </div>
                                <p className="text-sm text-gray-600">En cotizaciones activas</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="reservations" className="space-y-6">
                    {/* Mis reservaciones */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-[#072b3d]">Mis Reservaciones</CardTitle>
                                    <CardDescription>Reservaciones gestionadas basadas en Reservation model</CardDescription>
                                </div>
                                <Button className="bg-[#105D88] hover:bg-[#072b3d] text-white">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nueva Reservación
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockData.myReservations.map((reservation) => (
                                    <div
                                        key={reservation.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-[#73BFB7] rounded-lg flex items-center justify-center text-white font-bold">
                                                <DollarSign className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-[#072b3d]">{reservation.clientName}</h4>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {reservation.projectName} - Lote {reservation.lotNumber}
                                                    </span>
                                                    <span>Fecha: {reservation.reservationDate}</span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge
                                                        className={`text-xs ${
                                                            reservation.status === "ISSUED"
                                                                ? "bg-green-500"
                                                                : reservation.status === "CANCELED"
                                                                    ? "bg-red-500"
                                                                    : "bg-gray-500"
                                                        } text-white`}
                                                    >
                                                        {reservation.status}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs">
                                                        {reservation.paymentMethod}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-[#072b3d]">
                                                    {reservation.currency === "SOLES" ? "S/" : "$"}
                                                    {reservation.amountPaid.toLocaleString()}
                                                </p>
                                                <p className="text-sm text-gray-500">Monto pagado</p>
                                                <p
                                                    className={`text-xs ${
                                                        new Date(reservation.expiresAt) < new Date()
                                                            ? "text-red-600"
                                                            : new Date(reservation.expiresAt).getTime() - new Date().getTime() < 86400000
                                                                ? "text-yellow-600"
                                                                : "text-green-600"
                                                    }`}
                                                >
                                                    Vence: {reservation.expiresAt}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-center gap-2">
                                                {!reservation.notified && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        Sin notificar
                                                    </Badge>
                                                )}
                                                <div className="flex gap-1">
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="w-3 h-3" />
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        <MessageSquare className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Estados de reservaciones */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border-l-4 border-l-green-500">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                    <span className="font-medium text-[#072b3d]">Activas</span>
                                </div>
                                <div className="text-3xl font-bold text-[#072b3d] mb-2">
                                    {mockData.myReservations.filter((r) => r.status === "ISSUED").length}
                                </div>
                                <p className="text-sm text-gray-600">Reservaciones vigentes</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-yellow-500">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <AlertTriangle className="w-6 h-6 text-yellow-500" />
                                    <span className="font-medium text-[#072b3d]">Por Vencer</span>
                                </div>
                                <div className="text-3xl font-bold text-[#072b3d] mb-2">
                                    {
                                        mockData.myReservations.filter(
                                            (r) => new Date(r.expiresAt).getTime() - new Date().getTime() < 86400000 &&
                          new Date(r.expiresAt) > new Date(),
                                        ).length
                                    }
                                </div>
                                <p className="text-sm text-gray-600">En las próximas 24h</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-[#105D88]">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <DollarSign className="w-6 h-6 text-[#105D88]" />
                                    <span className="font-medium text-[#072b3d]">Monto Total</span>
                                </div>
                                <div className="text-3xl font-bold text-[#072b3d] mb-2">
                                    S/{mockData.myReservations.reduce((sum, r) => sum + r.amountPaid, 0).toLocaleString()}
                                </div>
                                <p className="text-sm text-gray-600">En reservaciones</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-6">
                    {/* Mi rendimiento por proyecto */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-[#072b3d]">
                                <MapPin className="w-5 h-5" />
                                Mi Rendimiento por Proyecto
                            </CardTitle>
                            <CardDescription>Análisis de mi gestión por proyecto inmobiliario</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <ComposedChart data={mockData.myProjects}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="project" angle={-45} textAnchor="end" height={100} />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip />
                                    <Bar yAxisId="left" dataKey="leadsAssigned" fill="#C3E7DF" name="Asignados" />
                                    <Bar yAxisId="left" dataKey="leadsCompleted" fill="#73BFB7" name="Completados" />
                                    <Bar yAxisId="left" dataKey="quotationsIssued" fill="#17949B" name="Cotizaciones" />
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
                        {mockData.myProjects.map((project, index) => (
                            <Card key={index}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-[#072b3d]">{project.project}</CardTitle>
                                    <CardDescription>Mi gestión en este proyecto</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="text-center p-2 bg-[#C3E7DF]/20 rounded">
                                            <p className="font-bold text-[#072b3d]">{project.leadsAssigned}</p>
                                            <p className="text-gray-600">Asignados</p>
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
                                            <span>Mi Conversión</span>
                                            <span>{project.conversionRate}%</span>
                                        </div>
                                        <Progress value={project.conversionRate} className="h-2" />
                                    </div>
                                    <div className="text-center">
                                        <Badge
                                            className={`${project.conversionRate > 18 ? "bg-[#73BFB7]" : project.conversionRate > 12 ? "bg-[#17949B]" : "bg-[#105D88]"} text-white`}
                                        >
                                            {project.conversionRate > 18 ? "Excelente" : project.conversionRate > 12 ? "Bueno" : "Mejorar"}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Métricas personales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="border-l-4 border-l-[#73BFB7]">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Target className="w-6 h-6 text-[#73BFB7]" />
                                    <span className="font-medium text-[#072b3d]">Mi Conversión</span>
                                </div>
                                <div className="text-3xl font-bold text-[#072b3d] mb-2">{mockData.performance.conversionRate}%</div>
                                <p className="text-sm text-gray-600">Tasa personal</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-[#17949B]">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Clock className="w-6 h-6 text-[#17949B]" />
                                    <span className="font-medium text-[#072b3d]">Tiempo Respuesta</span>
                                </div>
                                <div className="text-3xl font-bold text-[#072b3d] mb-2">{mockData.performance.avgResponseTime}h</div>
                                <p className="text-sm text-gray-600">Promedio personal</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-[#105D88]">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <FileText className="w-6 h-6 text-[#105D88]" />
                                    <span className="font-medium text-[#072b3d]">Cotizaciones</span>
                                </div>
                                <div className="text-3xl font-bold text-[#072b3d] mb-2">{mockData.performance.quotationsIssued}</div>
                                <p className="text-sm text-gray-600">Generadas este mes</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-[#072b3d]">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <DollarSign className="w-6 h-6 text-[#072b3d]" />
                                    <span className="font-medium text-[#072b3d]">Reservaciones</span>
                                </div>
                                <div className="text-3xl font-bold text-[#072b3d] mb-2">
                                    {mockData.performance.reservationsGenerated}
                                </div>
                                <p className="text-sm text-gray-600">Logradas este mes</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>

    );
}
