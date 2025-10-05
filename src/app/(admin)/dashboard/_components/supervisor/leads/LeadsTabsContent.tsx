import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle, Clock, Phone, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SupervisorDashboard } from "@/app/(admin)/dashboard/_types/dashboard";

interface LeadsTabsContentProps {
    data: SupervisorDashboard;
    isLoading: boolean;
}

export function LeadsTabsContent({ data, isLoading }: LeadsTabsContentProps) {
    if (isLoading) {
        return (
            <TabsContent value="leads" className="space-y-6">
                <div className="text-center py-12">
                    <p className="text-slate-600 dark:text-slate-400">Cargando leads...</p>
                </div>
            </TabsContent>
        );
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
        case "high":
            return "bg-red-600 hover:bg-red-700";
        case "medium":
            return "bg-orange-500 hover:bg-orange-600";
        case "low":
            return "bg-green-600 hover:bg-green-700";
        default:
            return "bg-slate-600 hover:bg-slate-700";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
        case "Registered":
            return "bg-primary hover:bg-primary/90";
        case "Attended":
            return "bg-green-600 hover:bg-green-700";
        case "InFollowUp":
            return "bg-orange-500 hover:bg-orange-600";
        case "Completed":
            return "bg-slate-800 hover:bg-slate-900";
        default:
            return "bg-slate-600 hover:bg-slate-700";
        }
    };

    return (
        <TabsContent value="leads" className="space-y-6">
            {/* Alertas de leads */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-red-600">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                                <span className="font-medium text-slate-800 dark:text-slate-100">Expirados</span>
                            </div>
                            <Badge className="bg-red-600 hover:bg-red-700 text-white">
                                {data.leadsKpi?.expiredLeads ?? 0}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-orange-500" />
                                <span className="font-medium text-slate-800 dark:text-slate-100">Sin Asignar</span>
                            </div>
                            <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                                {data.leadsKpi?.unassignedLeads ?? 0}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-600">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-slate-800 dark:text-slate-100">Completados</span>
                            </div>
                            <Badge className="bg-green-600 hover:bg-green-700 text-white">
                                {data.leadsKpi?.completedLeads ?? 0}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Lista de leads recientes */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                        <Activity className="w-5 h-5 text-primary" />
                        Leads Recientes
                    </CardTitle>
                    <CardDescription>Últimos leads ingresados al sistema</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {(data.recentLeads ?? []).map((lead) => (
                            <Card
                                key={lead.id}
                                className="border-l-4 border-l-slate-600 hover:shadow-md transition-shadow"
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                {(lead.clientName ?? "")
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-slate-800 dark:text-slate-100">
                                                    {lead.clientName}
                                                </h4>
                                                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
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
                                                <Badge className={`${getStatusColor(lead.status ?? "")} text-white mb-1`}>
                                                    {lead.status}
                                                </Badge>
                                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                                    {lead.captureSource}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                                    {lead.assignedTo ?? "Sin asignar"}
                                                </p>
                                                <p
                                                    className={`text-xs ${
                                                        (lead.daysUntilExpiration ?? 0) <= 2
                                                            ? "text-red-600"
                                                            : (lead.daysUntilExpiration ?? 0) <= 4
                                                                ? "text-orange-500"
                                                                : "text-green-600"
                                                    }`}
                                                >
                                                    {lead.daysUntilExpiration ?? 0} días restantes
                                                </p>
                                            </div>
                                            <Badge className={`${getPriorityColor(lead.priority ?? "")} text-white`}>
                                                {lead.priority}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
}
