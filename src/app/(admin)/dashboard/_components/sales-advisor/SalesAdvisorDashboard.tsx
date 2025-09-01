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
    UserCheck,
    ClipboardList,
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
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useDashboardSalesAdvisor } from "../../_hooks/useDashboard";
import { createPortal } from "react-dom";
import { FilterYear } from "@/components/ui/filter-year";

export default function SalesAdvisorDashboard() {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [activeTab, setActiveTab] = useState("leads");
    const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
    const { data } = useDashboardSalesAdvisor(selectedYear);

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
        <div className="space-y-6">
            {portalElement &&
            createPortal(
                <FilterYear selectedYear={selectedYear} onSelectYear={setSelectedYear} />,
                portalElement
            )}

            {/* KPIs Personales basados en Lead Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                <Card className="bg-gradient-to-br from-[#73BFB7] to-[#C3E7DF] text-[#072b3d]">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#072b3d]/80 text-xs">Mis Leads</p>
                                <p className="text-2xl font-bold">{data?.myLeads?.total}</p>
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
                                <p className="text-2xl font-bold">{data?.myLeads?.inFollowUp}</p>
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
                                <p className="text-2xl font-bold">{data?.performance?.quotationsIssued}</p>
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
                                <p className="text-2xl font-bold">{data?.performance?.reservationsGenerated}</p>
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
                                <p className="text-2xl font-bold">{data?.performance?.conversionRate}%</p>
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
                                <p className="text-2xl font-bold">{data?.performance?.tasksPending}</p>
                                <p className="text-[#072b3d]/60 text-xs">Pendientes</p>
                            </div>
                            <Calendar className="w-8 h-8 text-[#072b3d]/60" />
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
                                {data?.assignedLeads?.map((lead) => (
                                    <div
                                        key={lead.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-[#105D88] rounded-full flex items-center justify-center text-white font-bold">
                                                {(lead.clientName ?? "")
                                                    .split(" ")
                                                    .filter((n) => n.length > 0)
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
                                                        typeof lead.daysUntilExpiration === "number"
                                                            ? lead.daysUntilExpiration <= 2
                                                                ? "text-red-600"
                                                                : lead.daysUntilExpiration <= 4
                                                                    ? "text-yellow-600"
                                                                    : "text-green-600"
                                                            : "text-gray-400"
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
                                            data={data?.myLeadSources}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="count"
                                            label={({ source, count }) => `${source}: ${count}`}
                                        >
                                            {data?.myLeadSources?.map((entry, index) => (
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
                                    <ComposedChart data={data?.monthlyPerformance}>
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
                                {data?.myTasks?.map((task) => (
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
                                                        {new Date(task.scheduledDate ?? "").toLocaleTimeString("es-ES", {
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
                                <BarChart data={data?.tasksByType}>
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
                                <div className="text-3xl font-bold text-[#072b3d] mb-2">{data?.performance?.tasksCompleted}</div>
                                <p className="text-sm text-gray-600">Este mes</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-[#17949B]">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Clock className="w-6 h-6 text-[#17949B]" />
                                    <span className="font-medium text-[#072b3d]">Tiempo Respuesta</span>
                                </div>
                                <div className="text-3xl font-bold text-[#072b3d] mb-2">{data?.performance?.avgResponseTime}h</div>
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
                                        ((data?.performance?.tasksCompleted ?? 0) /
                                            ((data?.performance?.tasksCompleted ?? 0) + (data?.performance?.tasksPending ?? 0))) *
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
                                {data?.myQuotations?.map((quotation) => (
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
                                                    ${quotation.finalPrice?.toLocaleString()} {quotation.currency}
                                                </p>
                                                <p className="text-sm text-gray-500">Original: ${quotation.totalPrice?.toLocaleString()}</p>
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
                                    {data?.myQuotations?.filter((q) => q.status === "ISSUED").length}
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
                                    {data?.myQuotations?.filter((q) => q.status === "ACCEPTED").length}
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
                                    ${data?.myQuotations?.reduce((sum, q) => sum + (q.finalPrice ?? 0), 0).toLocaleString()}
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
                                {data?.myReservations?.map((reservation) => (
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
                                                    {reservation.amountPaid?.toLocaleString()}
                                                </p>
                                                <p className="text-sm text-gray-500">Monto pagado</p>
                                                <p
                                                    className={`text-xs ${
                                                        new Date(reservation.expiresAt ?? "") < new Date()
                                                            ? "text-red-600"
                                                            : new Date(reservation.expiresAt ?? "").getTime() - new Date().getTime() < 86400000
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
                                    {data?.myReservations?.filter((r) => r.status === "ISSUED").length}
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
                                        data?.myReservations?.filter(
                                            (r) => new Date(r.expiresAt ?? "").getTime() - new Date().getTime() < 86400000 &&
                          new Date(r.expiresAt ?? "") > new Date(),
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
                                    S/{data?.myReservations?.reduce((sum, r) => sum + (r.amountPaid ?? 0), 0).toLocaleString()}
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
                                <ComposedChart data={data?.myProjects}>
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
                        {data?.myProjects?.map((project, index) => (
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
                                            className={`${project.conversionRate && project.conversionRate > 18 ? "bg-[#73BFB7]" : project.conversionRate && project.conversionRate > 12 ? "bg-[#17949B]" : "bg-[#105D88]"} text-white`}
                                        >
                                            {project.conversionRate && project.conversionRate > 18 ? "Excelente" : project.conversionRate && project.conversionRate > 12 ? "Bueno" : "Mejorar"}
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
                                <div className="text-3xl font-bold text-[#072b3d] mb-2">{data?.performance?.conversionRate}%</div>
                                <p className="text-sm text-gray-600">Tasa personal</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-[#17949B]">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Clock className="w-6 h-6 text-[#17949B]" />
                                    <span className="font-medium text-[#072b3d]">Tiempo Respuesta</span>
                                </div>
                                <div className="text-3xl font-bold text-[#072b3d] mb-2">{data?.performance?.avgResponseTime}h</div>
                                <p className="text-sm text-gray-600">Promedio personal</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-[#105D88]">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <FileText className="w-6 h-6 text-[#105D88]" />
                                    <span className="font-medium text-[#072b3d]">Cotizaciones</span>
                                </div>
                                <div className="text-3xl font-bold text-[#072b3d] mb-2">{data?.performance?.quotationsIssued}</div>
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
                                    {data?.performance?.reservationsGenerated}
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
