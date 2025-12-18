import { AlertTriangle, CheckCircle, Info, Target } from "lucide-react";

import type { ManagerDashboard } from "@/app/(admin)/dashboard/_types/dashboard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "../../EmptyState";

interface AlertsTabsContentProps {
  data: ManagerDashboard;
  isLoading: boolean;
}

export function AlertsTabsContent({ data, isLoading }: AlertsTabsContentProps) {
  if (isLoading) {
    return (
      <TabsContent value="alerts" className="space-y-6">
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">Cargando alertas...</p>
        </div>
      </TabsContent>
    );
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "danger":
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-orange-500" />;
      case "info":
        return <Info className="w-6 h-6 text-primary" />;
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      default:
        return <Info className="w-6 h-6 text-slate-600" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "danger":
        return "border-l-red-600 bg-red-50 dark:bg-red-900/10";
      case "warning":
        return "border-l-orange-500 bg-orange-50 dark:bg-orange-900/10";
      case "info":
        return "border-l-primary bg-primary/5 dark:bg-primary/10";
      case "success":
        return "border-l-green-600 bg-green-50 dark:bg-green-900/10";
      default:
        return "border-l-slate-600 bg-slate-50 dark:bg-slate-900/10";
    }
  };

  const getPriorityBadge = (priority: string) => {
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

  return (
    <TabsContent value="alerts" className="space-y-6">
      {/* Resumen de alertas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-slate-800 dark:text-slate-100">Críticas</span>
              </div>
              <Badge className="bg-red-600 hover:bg-red-700 text-white">
                {(data.alerts ?? []).filter((a) => a.type === "danger").length}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <span className="font-medium text-slate-800 dark:text-slate-100">Advertencias</span>
              </div>
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                {(data.alerts ?? []).filter((a) => a.type === "warning").length}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                <span className="font-medium text-slate-800 dark:text-slate-100">Información</span>
              </div>
              <Badge className="bg-primary hover:bg-primary/90 text-white">
                {(data.alerts ?? []).filter((a) => a.type === "info").length}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-slate-800 dark:text-slate-100">Total</span>
              </div>
              <Badge className="bg-slate-600 hover:bg-slate-700 text-white">{(data.alerts ?? []).length}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de alertas */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
              <Target className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">
                Alertas y Notificaciones
              </CardTitle>
              <CardDescription>Acciones que requieren tu atención</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(data.alerts ?? []).length === 0 ? (
              <EmptyState
                icon={CheckCircle}
                title="Sin alertas"
                description="¡Todo en orden! No hay alertas pendientes"
              />
            ) : (
              (data.alerts ?? []).map((alert, index) => (
                <Card
                  key={index}
                  className={`border-l-4 ${getAlertColor(alert.type ?? "")} hover:shadow-md transition-shadow`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getAlertIcon(alert.type ?? "")}
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">{alert.title}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{alert.message}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`${getPriorityBadge(alert.priority ?? "")} text-white`}>
                          {alert.priority}
                        </Badge>
                        <Badge className="bg-slate-600 hover:bg-slate-700 text-white">{alert.count}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
