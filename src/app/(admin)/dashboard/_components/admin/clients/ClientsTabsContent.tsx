"use client";

import {
  Activity,
  AlertCircle,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Globe,
  Mail,
  MapPin,
  Phone,
  Shield,
  TrendingUp,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { AdminDashboard } from "../../../_types/dashboard";

interface ClientsTabsContentProps {
  data: AdminDashboard;
  isLoading: boolean;
}

export default function ClientsTabsContent({ data, isLoading }: ClientsTabsContentProps) {
  const clientAnalysis = data?.clientAnalysis;
  return (
    <TabsContent value="clients" className="space-y-6">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <LoadingSpinner size="lg" text="Cargando datos de clientes..." />
        </div>
      ) : (
        <>
          {/* Análisis principal */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Análisis de engagement y actividad */}
            <Card className="xl:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                      <Activity className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">Análisis de Engagement</CardTitle>
                      <CardDescription>Interacción y potencial de conversión de clientes</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Métricas de contactabilidad */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">Contactabilidad</h4>

                    <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <span className="font-medium text-slate-800 dark:text-slate-200">Contactables</span>
                        </div>
                        <span className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                          {clientAnalysis?.withEmail}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Con email para marketing</span>
                        <Badge
                          variant="outline"
                          className="text-green-700 border-green-200 dark:text-green-400 dark:border-green-800 text-xs"
                        >
                          {(((clientAnalysis?.withEmail ?? 0) / (clientAnalysis?.totalClients ?? 1)) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                          <span className="font-medium text-slate-800 dark:text-slate-200">Solo teléfono</span>
                        </div>
                        <span className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                          {(clientAnalysis?.totalClients ?? 0) - (clientAnalysis?.withEmail ?? 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Requieren seguimiento directo
                        </span>
                        <Badge
                          variant="outline"
                          className="text-amber-700 border-amber-200 dark:text-amber-400 dark:border-amber-800 text-xs"
                        >
                          {(
                            (((clientAnalysis?.totalClients ?? 0) - (clientAnalysis?.withEmail ?? 0)) /
                              (clientAnalysis?.totalClients ?? 1)) *
                            100
                          ).toFixed(1)}
                          %
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <span className="font-medium text-slate-800 dark:text-slate-200">Perfiles completos</span>
                        </div>
                        <span className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                          {clientAnalysis?.withCompleteData ?? 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Listos para oportunidades</span>
                        <Badge
                          variant="outline"
                          className="text-blue-700 border-blue-200 dark:text-blue-400 dark:border-blue-800 text-xs"
                        >
                          {(
                            ((clientAnalysis?.withCompleteData ?? 0) / (clientAnalysis?.totalClients ?? 1)) *
                            100
                          ).toFixed(1)}
                          %
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Segmentación por potencial */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">Potencial de Negocio</h4>

                    <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          <span className="font-medium text-slate-800 dark:text-slate-200">Empresas</span>
                        </div>
                        <span className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                          {clientAnalysis?.legalEntities}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Alto potencial de compra</span>
                        <Badge
                          variant="outline"
                          className="text-purple-700 border-purple-200 dark:text-purple-400 dark:border-purple-800 text-xs"
                        >
                          Mayor volumen
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                          <span className="font-medium text-slate-800 dark:text-slate-200">Co-propietarios</span>
                        </div>
                        <span className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                          {clientAnalysis?.coOwners}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Decisión compartida</span>
                        <Badge
                          variant="outline"
                          className="text-slate-700 border-slate-300 dark:text-slate-400 dark:border-slate-600 text-xs"
                        >
                          Proceso complejo
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                          <span className="font-medium text-slate-800 dark:text-slate-200">Bienes separados</span>
                        </div>
                        <span className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                          {clientAnalysis?.separateProperty}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Decisión independiente</span>
                        <Badge
                          variant="outline"
                          className="text-teal-700 border-teal-200 dark:text-teal-400 dark:border-teal-800 text-xs"
                        >
                          Proceso ágil
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estrategias recomendadas */}
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span className="font-medium">Estrategias Recomendadas</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Email Marketing</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {clientAnalysis?.withEmail} clientes listos para campañas digitales
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          Enfoque Corporativo
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {clientAnalysis?.legalEntities} empresas para propuestas de volumen
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
                      <div className="flex items-center gap-2 mb-1">
                        <Phone className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          Llamadas Directas
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {(clientAnalysis?.totalClients ?? 0) - (clientAnalysis?.withEmail ?? 0)} clientes para contacto
                        telefónico
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Distribución geográfica */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                    <Globe className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Alcance Geográfico</CardTitle>
                    <CardDescription>Distribución por países</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mini donut chart */}
                  <div className="relative">
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={data.geographicData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="count"
                          stroke="none"
                        >
                          {data.geographicData?.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={["#64748b", "#475569", "#374151"][index % 3]}
                              className="hover:opacity-80 transition-opacity"
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload[0]) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white border border-slate-200 rounded-xl p-3 dark:bg-slate-800 dark:border-slate-700">
                                  <p className="font-semibold">{data.country}</p>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {data.count} clientes ({data.percentage}%)
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Centro del donut */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <div className="text-xl font-bold text-slate-800 dark:text-slate-200">
                          {(data.geographicData ?? []).reduce((sum, item) => sum + (item.count ?? 0), 0)}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Total</div>
                      </div>
                    </div>
                  </div>

                  {/* Lista detallada */}
                  <div className="space-y-3">
                    {(data.geographicData ?? []).map((country, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-500" />
                            <span className="font-medium text-sm">{country.country}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold">{country.count}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {country.percentage}%
                            </Badge>
                          </div>
                        </div>
                        <Progress value={country.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600 dark:text-slate-400">Mercado principal</p>
                        <p className="font-semibold">Perú (80%)</p>
                      </div>
                      <div>
                        <p className="text-slate-600 dark:text-slate-400">Expansión</p>
                        <p className="font-semibold">2 países</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Análisis temporal y actividad reciente */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Evolución temporal */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                    <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Evolución de Registros</CardTitle>
                    <CardDescription>Crecimiento mensual por tipo de cliente</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="max-h-[800px] h-full">
                <ResponsiveContainer height={"100%"}>
                  <BarChart data={data.clientRegistrations} margin={{ top: 20, right: 30, left: 0 }}>
                    <CartesianGrid strokeDasharray="2 4" stroke="#e2e8f0" opacity={0.4} vertical={false} />
                    <XAxis
                      dataKey="month"
                      fontSize={12}
                      fontWeight={600}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#64748b" }}
                    />
                    <YAxis
                      fontSize={12}
                      fontWeight={600}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#64748b" }}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white border border-slate-200 rounded-xl p-4 dark:bg-slate-800 dark:border-slate-700">
                              <p className="font-semibold mb-2">{label}</p>
                              {payload.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2 mb-1">
                                  <div className="flex items-center gap-2">
                                    {entry.dataKey === "natural" ? (
                                      <User className="w-4 h-4 text-blue-600" />
                                    ) : (
                                      <Building2 className="w-4 h-4 text-green-600" />
                                    )}
                                    <span className="text-sm font-medium" style={{ color: entry.color }}>
                                      {entry.name}: {entry.value} clientes
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="natural"
                      name="Clientes Naturales"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={40}
                    />
                    <Bar
                      dataKey="juridico"
                      name="Clientes Jurídicos"
                      fill="#16a34a"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Propiedades especiales */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                    <Activity className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Características Especiales</CardTitle>
                    <CardDescription>Propiedades y configuraciones únicas</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">Co-propietarios</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Propiedades compartidas</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                          {clientAnalysis?.coOwners}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">clientes</p>
                      </div>
                    </div>
                    <Progress
                      value={((clientAnalysis?.coOwners ?? 0) / (clientAnalysis?.totalClients ?? 1)) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 dark:bg-slate-800/50 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">Bienes Separados</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Régimen patrimonial</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                          {clientAnalysis?.separateProperty}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">clientes</p>
                      </div>
                    </div>
                    <Progress
                      value={((clientAnalysis?.separateProperty ?? 0) / (clientAnalysis?.totalClients ?? 1)) * 100}
                      className="h-2"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                      <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
                        {(((clientAnalysis?.naturalPersons ?? 0) / (clientAnalysis?.totalClients ?? 1)) * 100).toFixed(
                          1
                        )}
                        %
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Personas Naturales</p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                      <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
                        {(((clientAnalysis?.legalEntities ?? 0) / (clientAnalysis?.totalClients ?? 1)) * 100).toFixed(
                          1
                        )}
                        %
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Personas Jurídicas</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actividad reciente */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                    <UserPlus className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Actividad Reciente</CardTitle>
                    <CardDescription>Últimos registros y actualizaciones</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.recentClients?.map((client, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold",
                            client.type === "Natural" ? "bg-blue-500" : "bg-purple-500"
                          )}
                        >
                          {client.type === "Natural" ? <User className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">{client.name}</p>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs",
                                client.type === "Natural"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-purple-50 text-purple-700 border-purple-200"
                              )}
                            >
                              {client.type}
                            </Badge>
                            {client.hasCoOwners && (
                              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                                Co-propietario
                              </Badge>
                            )}
                            {client.separateProperty && (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                Bienes separados
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-500" />
                              <span className="text-xs text-slate-600 dark:text-slate-400">{client.phone}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-500" />
                              <span className="text-xs text-slate-600 dark:text-slate-400">{client.country}</span>
                            </div>
                            {client.email ? (
                              <div className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-green-500" />
                                <span className="text-xs text-slate-600 dark:text-slate-400">{client.email}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 text-amber-500" />
                                <span className="text-xs text-amber-600">Sin email</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span className="text-xs text-slate-600 dark:text-slate-400">hace {client.daysAgo} días</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={client.completeness} className="h-1.5 w-16" />
                          <span className="text-xs font-semibold">{client.completeness}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </TabsContent>
  );
}
