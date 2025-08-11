import {
    Building2,
    Mail,
    UserCheck,
    Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TabsContent } from "@/components/ui/tabs";
import { AdminDashboard } from "../../../_types/dashboard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ClientsTabsContentProps {
  data: AdminDashboard,
  isLoading: boolean,
}

export default function ClientsTabsContent({ data, isLoading }: ClientsTabsContentProps) {
    return (
        <TabsContent value="clients" className="space-y-6">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <LoadingSpinner size="lg" text="Cargando datos del equipo..." />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Análisis de clientes */}
                    <Card>
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
                                        {(data?.clientAnalysis?.naturalPersons ?? 0).toLocaleString()}
                                    </p>
                                    <p className="text-sm text-slate-600">Personas Naturales</p>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <p className="text-3xl font-bold text-purple-600">
                                        {(data?.clientAnalysis?.legalEntities ?? 0).toLocaleString()}
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
                                                ((data?.clientAnalysis?.withEmail ?? 0) / (data?.clientAnalysis?.totalClients ?? 1)) * 100
                                            )}
                                            %
                                        </span>
                                    </div>
                                    <Progress
                                        value={
                                            ((data?.clientAnalysis?.withEmail ?? 0) / (data?.clientAnalysis?.totalClients ?? 1)) * 100
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
                                                ((data?.clientAnalysis?.withCompleteData ?? 0) /
                              (data?.clientAnalysis?.totalClients ?? 1)) *
                              100
                                            )}
                                            %
                                        </span>
                                    </div>
                                    <Progress
                                        value={
                                            ((data?.clientAnalysis?.withCompleteData ?? 0) / (data?.clientAnalysis?.totalClients ?? 1)) *
                          100
                                        }
                                        className="h-3"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Características especiales */}
                    <Card>
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
                                    <Badge className="bg-amber-600 text-white">{data?.clientAnalysis?.coOwners ?? 0}</Badge>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="w-5 h-5 text-green-600" />
                                        <span className="font-medium">Bienes Separados</span>
                                    </div>
                                    <Badge className="bg-green-600 text-white">{data?.clientAnalysis?.separateProperty ?? 0}</Badge>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>
            )}

        </TabsContent>
    );
}
