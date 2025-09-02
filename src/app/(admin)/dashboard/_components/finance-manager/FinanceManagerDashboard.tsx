"use client";

import {
    TrendingUp,
    DollarSign,
    ArrowUpRight,
    Calendar,
    Clock,
    AlertTriangle,
    CheckCircle,
    XCircle,
    PieChart,
    BarChart3,
    FileText,
    Banknote,
    Wallet,
    TrendingDown,
} from "lucide-react";
import {
    Bar,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Line,
    ComposedChart,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Area,
    AreaChart,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Datos financieros enfocados en pagos y cronogramas (SIN EGRESOS)
const DATOS_FINANCIEROS = {
    // Resumen financiero general
    resumenFinanciero: {
        totalFacturado: 11030000,
        totalCobrado: 8850000,
        pendienteCobro: 2180000,
        vencido: 450000,
        liquidezActual: 8850000, // Solo lo cobrado
        proyeccionMensual: 1850000,
        margenBruto: 68.5,
        rotacionCartera: 45,
    },

    // Estado de cuentas por cobrar por proyecto
    cuentasPorCobrar: [
        {
            proyecto: "Villa Hermosa",
            facturado: 3240000,
            cobrado: 2590000,
            pendiente: 650000,
            vencido: 120000,
            proximoVencimiento: 180000,
            fechaProximoPago: "2024-01-15",
        },
        {
            proyecto: "Los Pinos Residencial",
            facturado: 3190000,
            cobrado: 2750000,
            pendiente: 440000,
            vencido: 85000,
            proximoVencimiento: 155000,
            fechaProximoPago: "2024-01-20",
        },
        {
            proyecto: "El Bosque",
            facturado: 3000000,
            cobrado: 2800000,
            pendiente: 200000,
            vencido: 0,
            proximoVencimiento: 200000,
            fechaProximoPago: "2024-01-25",
        },
        {
            proyecto: "Torres del Sol",
            facturado: 1600000,
            cobrado: 710000,
            pendiente: 890000,
            vencido: 245000,
            proximoVencimiento: 320000,
            fechaProximoPago: "2024-01-10",
        },
    ],

    // Ingresos cobrados por mes (últimos 6 meses) - SOLO INGRESOS
    ingresosMensuales: [
        { mes: "Jul", cobrado: 1420000, acumulado: 1420000, proyectos: 3 },
        { mes: "Ago", cobrado: 1650000, acumulado: 3070000, proyectos: 4 },
        { mes: "Sep", cobrado: 1380000, acumulado: 4450000, proyectos: 3 },
        { mes: "Oct", cobrado: 1890000, acumulado: 6340000, proyectos: 4 },
        { mes: "Nov", cobrado: 1560000, acumulado: 7900000, proyectos: 3 },
        { mes: "Dic", cobrado: 950000, acumulado: 8850000, proyectos: 2 }, // Mes parcial
    ],

    // Cronograma de pagos próximos (próximos 30 días)
    cronogramaPagos: [
        {
            cliente: "García Constructores SAC",
            proyecto: "Torres del Sol",
            monto: 320000,
            fechaVencimiento: "2024-01-10",
            diasVencimiento: 3,
            estado: "por_vencer",
            cuota: "3/12",
            lote: "Lote 15",
        },
        {
            cliente: "María Elena Rodríguez",
            proyecto: "Villa Hermosa",
            monto: 180000,
            fechaVencimiento: "2024-01-15",
            diasVencimiento: 8,
            estado: "vigente",
            cuota: "2/8",
            lote: "Lote 7",
        },
        {
            cliente: "Inversiones del Norte EIRL",
            proyecto: "Los Pinos Residencial",
            monto: 155000,
            fechaVencimiento: "2024-01-20",
            diasVencimiento: 13,
            estado: "vigente",
            cuota: "4/10",
            lote: "Lote 23",
        },
        {
            cliente: "Carlos Mendoza Silva",
            proyecto: "El Bosque",
            monto: 200000,
            fechaVencimiento: "2024-01-25",
            diasVencimiento: 18,
            estado: "vigente",
            cuota: "6/6",
            lote: "Lote 12",
        },
    ],

    // Análisis de morosidad
    analisisMorosidad: [
        { rango: "1-30 días", monto: 180000, cantidad: 3, porcentaje: 8.2 },
        { rango: "31-60 días", monto: 145000, cantidad: 2, porcentaje: 6.6 },
        { rango: "61-90 días", monto: 85000, cantidad: 1, porcentaje: 3.9 },
        { rango: "Más de 90 días", monto: 40000, cantidad: 1, porcentaje: 1.8 },
    ],

    // Proyección de ingresos (próximos 3 meses) - SOLO INGRESOS
    proyeccionIngresos: [
        { mes: "Enero", conservador: 1650000, realista: 1850000, optimista: 2100000 },
        { mes: "Febrero", conservador: 1580000, realista: 1780000, optimista: 2050000 },
        { mes: "Marzo", conservador: 1720000, realista: 1920000, optimista: 2200000 },
    ],

    // Indicadores financieros clave
    indicadoresKPI: {
        diasCartera: 45,
        indiceLiquidez: 2.8,
        rotacionActivos: 1.4,
        margenOperativo: 32.5,
        crecimientoMensual: 12.8,
        eficienciaCobranza: 91.2,
    },
};

export default function FinanceManagerDashboard() {
    return (
        <div className="space-y-6">

            {/* Pestañas principales */}
            <Tabs defaultValue="resumen" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 h-12">
                    <TabsTrigger value="resumen" className="text-sm font-medium">
                        Resumen Financiero
                    </TabsTrigger>
                    <TabsTrigger value="ingresos" className="text-sm font-medium">
                        Ingresos
                    </TabsTrigger>
                    <TabsTrigger value="cuentas-cobrar" className="text-sm font-medium">
                        Cuentas por Cobrar
                    </TabsTrigger>
                    <TabsTrigger value="cronograma" className="text-sm font-medium">
                        Cronograma Pagos
                    </TabsTrigger>
                    <TabsTrigger value="proyecciones" className="text-sm font-medium">
                        Proyecciones
                    </TabsTrigger>
                </TabsList>

                {/* Pestaña: Resumen Financiero */}
                <TabsContent value="resumen" className="space-y-6">
                    {/* KPIs Financieros Principales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 border-emerald-200 shadow-lg dark:from-emerald-900/20 dark:to-green-900/20 dark:border-emerald-800">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full -translate-y-10 translate-x-10" />
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-200 shadow-sm dark:bg-emerald-900/30 dark:border-emerald-800">
                                        <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-emerald-700 text-sm font-semibold dark:text-emerald-400">Total Cobrado</p>
                                        <p className="text-3xl font-bold text-emerald-800 dark:text-emerald-300">
                                            S/ {(DATOS_FINANCIEROS.resumenFinanciero.totalCobrado / 1000000).toFixed(1)}M
                                        </p>
                                        <div className="flex items-center gap-1 mt-2">
                                            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                                            <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                                {(
                                                    (DATOS_FINANCIEROS.resumenFinanciero.totalCobrado /
                            DATOS_FINANCIEROS.resumenFinanciero.totalFacturado) *
                          100
                                                ).toFixed(1)}
                                                % del facturado
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 border-amber-200 shadow-lg dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-800">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full -translate-y-10 translate-x-10" />
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-amber-100 border border-amber-200 shadow-sm dark:bg-amber-900/30 dark:border-amber-800">
                                        <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-amber-700 text-sm font-semibold dark:text-amber-400">Pendiente Cobro</p>
                                        <p className="text-3xl font-bold text-amber-800 dark:text-amber-300">
                                            S/ {(DATOS_FINANCIEROS.resumenFinanciero.pendienteCobro / 1000000).toFixed(1)}M
                                        </p>
                                        <div className="flex items-center gap-1 mt-2">
                                            <Calendar className="w-4 h-4 text-amber-600" />
                                            <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                                                {DATOS_FINANCIEROS.indicadoresKPI.diasCartera} días promedio
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="relative overflow-hidden bg-gradient-to-br from-red-50 via-rose-50 to-red-100 border-red-200 shadow-lg dark:from-red-900/20 dark:to-rose-900/20 dark:border-red-800">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full -translate-y-10 translate-x-10" />
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-red-100 border border-red-200 shadow-sm dark:bg-red-900/30 dark:border-red-800">
                                        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-red-700 text-sm font-semibold dark:text-red-400">Cuentas Vencidas</p>
                                        <p className="text-3xl font-bold text-red-800 dark:text-red-300">
                                            S/ {(DATOS_FINANCIEROS.resumenFinanciero.vencido / 1000).toFixed(0)}K
                                        </p>
                                        <div className="flex items-center gap-1 mt-2">
                                            <XCircle className="w-4 h-4 text-red-600" />
                                            <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                                                {(
                                                    (DATOS_FINANCIEROS.resumenFinanciero.vencido /
                            DATOS_FINANCIEROS.resumenFinanciero.totalFacturado) *
                          100
                                                ).toFixed(1)}
                                                % del total
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 border-blue-200 shadow-lg dark:from-blue-900/20 dark:to-cyan-900/20 dark:border-blue-800">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10" />
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-blue-100 border border-blue-200 shadow-sm dark:bg-blue-900/30 dark:border-blue-800">
                                        <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-blue-700 text-sm font-semibold dark:text-blue-400">Proyección Mensual</p>
                                        <p className="text-3xl font-bold text-blue-800 dark:text-blue-300">
                                            S/ {(DATOS_FINANCIEROS.resumenFinanciero.proyeccionMensual / 1000000).toFixed(1)}M
                                        </p>
                                        <div className="flex items-center gap-1 mt-2">
                                            <TrendingUp className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Próximo mes</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Indicadores Financieros Clave */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 shadow-sm dark:from-slate-800 dark:to-slate-700 dark:border-slate-600">
                                        <BarChart3 className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                            Indicadores de Gestión
                                        </CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-400">
                                            Métricas clave de rendimiento financiero
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 dark:from-emerald-900/20 dark:to-green-900/20 dark:border-emerald-800">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                                                Eficiencia Cobranza
                                            </span>
                                            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">
                                            {DATOS_FINANCIEROS.indicadoresKPI.eficienciaCobranza}%
                                        </p>
                                        <Progress value={DATOS_FINANCIEROS.indicadoresKPI.eficienciaCobranza} className="h-2" />
                                    </div>

                                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 dark:from-blue-900/20 dark:to-cyan-900/20 dark:border-blue-800">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">Margen Bruto</span>
                                            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">
                                            {DATOS_FINANCIEROS.resumenFinanciero.margenBruto}%
                                        </p>
                                        <Progress value={DATOS_FINANCIEROS.resumenFinanciero.margenBruto} className="h-2" />
                                    </div>

                                    <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 dark:from-purple-900/20 dark:to-violet-900/20 dark:border-purple-800">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-semibold text-purple-800 dark:text-purple-200">
                                                Rotación Cartera
                                            </span>
                                            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-2">
                                            {DATOS_FINANCIEROS.indicadoresKPI.diasCartera} días
                                        </p>
                                        <div className="text-xs text-purple-600 dark:text-purple-400">Promedio de cobranza</div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-800">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-semibold text-amber-800 dark:text-amber-200">Crecimiento</span>
                                            <ArrowUpRight className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <p className="text-2xl font-bold text-amber-700 dark:text-amber-300 mb-2">
                                            {DATOS_FINANCIEROS.indicadoresKPI.crecimientoMensual}%
                                        </p>
                                        <div className="text-xs text-amber-600 dark:text-amber-400">Mensual promedio</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 shadow-sm dark:from-slate-800 dark:to-slate-700 dark:border-slate-600">
                                        <PieChart className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                            Estado de Cartera
                                        </CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-400">
                                            Distribución de cuentas por cobrar
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={280}>
                                    <RechartsPieChart>
                                        <Pie
                                            data={[
                                                {
                                                    name: "Cobrado",
                                                    value: DATOS_FINANCIEROS.resumenFinanciero.totalCobrado,
                                                    fill: "#10b981",
                                                },
                                                {
                                                    name: "Pendiente Vigente",
                                                    value:
                            DATOS_FINANCIEROS.resumenFinanciero.pendienteCobro -
                            DATOS_FINANCIEROS.resumenFinanciero.vencido,
                                                    fill: "#f59e0b",
                                                },
                                                {
                                                    name: "Vencido",
                                                    value: DATOS_FINANCIEROS.resumenFinanciero.vencido,
                                                    fill: "#ef4444",
                                                },
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={120}
                                            paddingAngle={2}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {[{ fill: "#10b981" }, { fill: "#f59e0b" }, { fill: "#ef4444" }].map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload[0]) {
                                                    const data = payload[0].payload;
                                                    const total = DATOS_FINANCIEROS.resumenFinanciero.totalFacturado;
                                                    const percentage = ((data.value / total) * 100).toFixed(1);
                                                    return (
                                                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg dark:bg-slate-800 dark:border-slate-700">
                                                            <p className="font-semibold text-lg">{data.name}</p>
                                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                S/ {(data.value / 1000000).toFixed(1)}M ({percentage}%)
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Resumen por Proyecto */}
                    <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 shadow-sm dark:from-slate-800 dark:to-slate-700 dark:border-slate-600">
                                    <FileText className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                        Estado Financiero por Proyecto
                                    </CardTitle>
                                    <CardDescription className="text-slate-600 dark:text-slate-400">
                                        Análisis detallado de cuentas por cobrar
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {DATOS_FINANCIEROS.cuentasPorCobrar.map((proyecto, index) => {
                                    const porcentajeCobrado = (proyecto.cobrado / proyecto.facturado) * 100;
                                    const tieneVencido = proyecto.vencido > 0;

                                    return (
                                        <div
                                            key={index}
                                            className={cn(
                                                "p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md",
                                                tieneVencido
                                                    ? "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800/30"
                                                    : porcentajeCobrado > 85
                                                        ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800/30"
                                                        : "bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800/30",
                                            )}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={cn(
                                                            "p-2 rounded-lg",
                                                            tieneVencido
                                                                ? "bg-red-100 border border-red-200 dark:bg-red-900/30 dark:border-red-800"
                                                                : porcentajeCobrado > 85
                                                                    ? "bg-green-100 border border-green-200 dark:bg-green-900/30 dark:border-green-800"
                                                                    : "bg-amber-100 border border-amber-200 dark:bg-amber-900/30 dark:border-amber-800",
                                                        )}
                                                    >
                                                        {tieneVencido ? (
                                                            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                                        ) : porcentajeCobrado > 85 ? (
                                                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                        ) : (
                                                            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                                            {proyecto.proyecto}
                                                        </h3>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                                            Próximo pago: {proyecto.fechaProximoPago}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "text-sm font-semibold",
                                                        tieneVencido
                                                            ? "bg-red-100 text-red-700 border-red-300"
                                                            : porcentajeCobrado > 85
                                                                ? "bg-green-100 text-green-700 border-green-300"
                                                                : "bg-amber-100 text-amber-700 border-amber-300",
                                                    )}
                                                >
                                                    {porcentajeCobrado.toFixed(1)}% cobrado
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                <div className="text-center p-3 bg-white rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Facturado</p>
                                                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                                        S/ {(proyecto.facturado / 1000000).toFixed(1)}M
                                                    </p>
                                                </div>
                                                <div className="text-center p-3 bg-white rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Cobrado</p>
                                                    <p className="text-lg font-bold text-green-600">
                                                        S/ {(proyecto.cobrado / 1000000).toFixed(1)}M
                                                    </p>
                                                </div>
                                                <div className="text-center p-3 bg-white rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Pendiente</p>
                                                    <p className="text-lg font-bold text-amber-600">
                                                        S/ {(proyecto.pendiente / 1000).toFixed(0)}K
                                                    </p>
                                                </div>
                                                <div className="text-center p-3 bg-white rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Vencido</p>
                                                    <p
                                                        className={cn(
                                                            "text-lg font-bold",
                                                            proyecto.vencido > 0 ? "text-red-600" : "text-slate-400",
                                                        )}
                                                    >
                                                        S/ {(proyecto.vencido / 1000).toFixed(0)}K
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="font-medium text-slate-700 dark:text-slate-300">Progreso de Cobranza</span>
                                                    <span className="font-bold text-slate-900 dark:text-slate-100">
                                                        {porcentajeCobrado.toFixed(1)}%
                                                    </span>
                                                </div>
                                                <Progress value={porcentajeCobrado} className="h-3" />
                                            </div>

                                            {proyecto.proximoVencimiento > 0 && (
                                                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">Próximo vencimiento:</span>
                                                    <span className="font-bold text-blue-600">
                                                        S/ {(proyecto.proximoVencimiento / 1000).toFixed(0)}K
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Pestaña: Ingresos */}
                <TabsContent value="ingresos" className="space-y-6">
                    {/* Evolución de ingresos cobrados */}
                    <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 shadow-sm dark:from-slate-800 dark:to-slate-700 dark:border-slate-600">
                                    <TrendingUp className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                        Evolución de Ingresos Cobrados
                                    </CardTitle>
                                    <CardDescription className="text-slate-600 dark:text-slate-400">
                                        Ingresos efectivamente cobrados por mes
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <ComposedChart
                                    data={DATOS_FINANCIEROS.ingresosMensuales}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} />
                                    <XAxis
                                        dataKey="mes"
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
                                        tickFormatter={(value) => `S/ ${(value / 1000000).toFixed(1)}M`}
                                    />
                                    <Tooltip
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-white border border-slate-200 rounded-xl p-4 min-w-[300px] shadow-lg dark:bg-slate-800 dark:border-slate-700">
                                                        <h4 className="font-bold text-lg mb-3">{label}</h4>
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm text-green-600">Cobrado:</span>
                                                                <span className="font-bold text-green-600">
                                                                    S/ {(data.cobrado / 1000000).toFixed(1)}M
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm text-blue-600">Acumulado:</span>
                                                                <span className="font-bold text-blue-600">
                                                                    S/ {(data.acumulado / 1000000).toFixed(1)}M
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm text-purple-600">Proyectos activos:</span>
                                                                <span className="font-bold text-purple-600">{data.proyectos}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar dataKey="cobrado" name="Ingresos Cobrados" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    <Line
                                        type="monotone"
                                        dataKey="acumulado"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        name="Acumulado"
                                        dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Métricas de ingresos */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-green-100 border border-green-200 dark:bg-green-900/30 dark:border-green-800">
                                        <ArrowUpRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold">Mejor Mes</CardTitle>
                                        <CardDescription>Octubre 2024</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center mb-4">
                                    <p className="text-3xl font-bold text-green-600">S/ 1.89M</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Ingresos cobrados</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Proyectos activos</span>
                                        <span className="font-semibold text-green-600">4</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Vs. promedio</span>
                                        <span className="font-semibold text-green-600">+24.8%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-blue-100 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-800">
                                        <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold">Promedio Mensual</CardTitle>
                                        <CardDescription>Últimos 6 meses</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center mb-4">
                                    <p className="text-3xl font-bold text-blue-600">S/ 1.48M</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Ingresos promedio</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Tendencia</span>
                                        <span className="font-semibold text-green-600">↗ Creciente</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Variabilidad</span>
                                        <span className="font-semibold text-blue-600">±18.2%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-purple-100 border border-purple-200 dark:bg-purple-900/30 dark:border-purple-800">
                                        <Wallet className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold">Total Acumulado</CardTitle>
                                        <CardDescription>6 meses</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center mb-4">
                                    <p className="text-3xl font-bold text-purple-600">S/ 8.85M</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Ingresos cobrados</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>% del facturado</span>
                                        <span className="font-semibold text-purple-600">80.2%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Crecimiento</span>
                                        <span className="font-semibold text-green-600">+12.8%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Pestaña: Cuentas por Cobrar */}
                <TabsContent value="cuentas-cobrar" className="space-y-6">
                    {/* Análisis de morosidad */}
                    <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 shadow-sm dark:from-slate-800 dark:to-slate-700 dark:border-slate-600">
                                    <AlertTriangle className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                        Análisis de Morosidad
                                    </CardTitle>
                                    <CardDescription className="text-slate-600 dark:text-slate-400">
                                        Distribución de cuentas vencidas por antigüedad
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <ComposedChart
                                    data={DATOS_FINANCIEROS.analisisMorosidad}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} />
                                    <XAxis
                                        dataKey="rango"
                                        fontSize={12}
                                        fontWeight={600}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: "#64748b" }}
                                    />
                                    <YAxis
                                        yAxisId="monto"
                                        fontSize={12}
                                        fontWeight={600}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: "#64748b" }}
                                        tickFormatter={(value) => `S/ ${(value / 1000).toFixed(0)}K`}
                                    />
                                    <YAxis
                                        yAxisId="cantidad"
                                        orientation="right"
                                        fontSize={12}
                                        fontWeight={600}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: "#64748b" }}
                                    />
                                    <Tooltip
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-white border border-slate-200 rounded-xl p-4 min-w-[280px] shadow-lg dark:bg-slate-800 dark:border-slate-700">
                                                        <h4 className="font-bold text-lg mb-3">{label}</h4>
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm text-red-600">Monto vencido:</span>
                                                                <span className="font-bold text-red-600">S/ {(data.monto / 1000).toFixed(0)}K</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm text-blue-600">Cantidad cuentas:</span>
                                                                <span className="font-bold text-blue-600">{data.cantidad}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm text-purple-600">% del total:</span>
                                                                <span className="font-bold text-purple-600">{data.porcentaje}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar yAxisId="monto" dataKey="monto" name="Monto" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                    <Line
                                        yAxisId="cantidad"
                                        type="monotone"
                                        dataKey="cantidad"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        name="Cantidad"
                                        dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Detalle por proyecto */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {DATOS_FINANCIEROS.cuentasPorCobrar.map((proyecto, index) => (
                            <Card key={index} className="shadow-lg border-slate-200 dark:border-slate-700">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={cn(
                                                    "p-2 rounded-xl border",
                                                    proyecto.vencido > 0
                                                        ? "bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-800"
                                                        : "bg-green-100 border-green-200 dark:bg-green-900/30 dark:border-green-800",
                                                )}
                                            >
                                                {proyecto.vencido > 0 ? (
                                                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                                ) : (
                                                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                )}
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg font-bold">{proyecto.proyecto}</CardTitle>
                                                <CardDescription>Estado de cobranza</CardDescription>
                                            </div>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "text-xs",
                                                proyecto.vencido > 0
                                                    ? "bg-red-100 text-red-700 border-red-200"
                                                    : "bg-green-100 text-green-700 border-green-200",
                                            )}
                                        >
                                            {proyecto.vencido > 0 ? "Con Vencidos" : "Al Día"}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                                            <p className="text-sm text-green-600 dark:text-green-400 mb-1">Cobrado</p>
                                            <p className="text-lg font-bold text-green-700 dark:text-green-300">
                                                S/ {(proyecto.cobrado / 1000000).toFixed(1)}M
                                            </p>
                                        </div>
                                        <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                                            <p className="text-sm text-amber-600 dark:text-amber-400 mb-1">Pendiente</p>
                                            <p className="text-lg font-bold text-amber-700 dark:text-amber-300">
                                                S/ {(proyecto.pendiente / 1000).toFixed(0)}K
                                            </p>
                                        </div>
                                    </div>

                                    {proyecto.vencido > 0 && (
                                        <div className="p-3 bg-red-50 rounded-lg border border-red-200 dark:bg-red-900/20 dark:border-red-800">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-red-800 dark:text-red-200">Monto Vencido</span>
                                                <span className="text-lg font-bold text-red-700 dark:text-red-300">
                                                    S/ {(proyecto.vencido / 1000).toFixed(0)}K
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium">Próximo vencimiento</span>
                                            <span className="text-sm text-slate-600 dark:text-slate-400">{proyecto.fechaProximoPago}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">Monto</span>
                                            <span className="font-bold text-blue-600">
                                                S/ {(proyecto.proximoVencimiento / 1000).toFixed(0)}K
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Pestaña: Cronograma de Pagos */}
                <TabsContent value="cronograma" className="space-y-6">
                    {/* Lista de pagos próximos */}
                    <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 shadow-sm dark:from-slate-800 dark:to-slate-700 dark:border-slate-600">
                                    <Calendar className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                        Cronograma de Pagos - Próximos 30 Días
                                    </CardTitle>
                                    <CardDescription className="text-slate-600 dark:text-slate-400">
                                        Pagos programados y fechas de vencimiento
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {DATOS_FINANCIEROS.cronogramaPagos.map((pago, index) => {
                                    const esPorVencer = pago.diasVencimiento <= 7;
                                    const esUrgente = pago.diasVencimiento <= 3;

                                    return (
                                        <div
                                            key={index}
                                            className={cn(
                                                "p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md",
                                                esUrgente
                                                    ? "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800/30"
                                                    : esPorVencer
                                                        ? "bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800/30"
                                                        : "bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800/30",
                                            )}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className={cn(
                                                            "p-3 rounded-xl",
                                                            esUrgente
                                                                ? "bg-red-100 border border-red-200 dark:bg-red-900/30 dark:border-red-800"
                                                                : esPorVencer
                                                                    ? "bg-amber-100 border border-amber-200 dark:bg-amber-900/30 dark:border-amber-800"
                                                                    : "bg-blue-100 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-800",
                                                        )}
                                                    >
                                                        {esUrgente ? (
                                                            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                                        ) : esPorVencer ? (
                                                            <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                                        ) : (
                                                            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{pago.cliente}</h3>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                                            {pago.proyecto} - {pago.lote}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                                        S/ {(pago.monto / 1000).toFixed(0)}K
                                                    </p>
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            "text-xs mt-1",
                                                            esUrgente
                                                                ? "bg-red-100 text-red-700 border-red-300"
                                                                : esPorVencer
                                                                    ? "bg-amber-100 text-amber-700 border-amber-300"
                                                                    : "bg-blue-100 text-blue-700 border-blue-300",
                                                        )}
                                                    >
                                                        {esUrgente ? "URGENTE" : esPorVencer ? "Por Vencer" : "Vigente"}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="text-center p-3 bg-white rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Fecha Vencimiento</p>
                                                    <p className="font-bold text-slate-900 dark:text-slate-100">{pago.fechaVencimiento}</p>
                                                </div>
                                                <div className="text-center p-3 bg-white rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Días Restantes</p>
                                                    <p
                                                        className={cn(
                                                            "font-bold",
                                                            esUrgente ? "text-red-600" : esPorVencer ? "text-amber-600" : "text-blue-600",
                                                        )}
                                                    >
                                                        {pago.diasVencimiento} días
                                                    </p>
                                                </div>
                                                <div className="text-center p-3 bg-white rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Cuota</p>
                                                    <p className="font-bold text-slate-900 dark:text-slate-100">{pago.cuota}</p>
                                                </div>
                                                <div className="text-center p-3 bg-white rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Estado</p>
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            "text-xs",
                                                            pago.estado === "por_vencer"
                                                                ? "bg-amber-100 text-amber-700 border-amber-200"
                                                                : "bg-green-100 text-green-700 border-green-200",
                                                        )}
                                                    >
                                                        {pago.estado === "por_vencer" ? "Por Vencer" : "Vigente"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Resumen de cronograma */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-red-100 border border-red-200 dark:bg-red-900/30 dark:border-red-800">
                                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold">Pagos Urgentes</CardTitle>
                                        <CardDescription>Próximos 7 días</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center mb-4">
                                    <p className="text-3xl font-bold text-red-600">
                                        {DATOS_FINANCIEROS.cronogramaPagos.filter((p) => p.diasVencimiento <= 7).length}
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">pagos por vencer</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Monto total</span>
                                        <span className="font-semibold text-red-600">
                                            S/{" "}
                                            {(
                                                DATOS_FINANCIEROS.cronogramaPagos
                                                    .filter((p) => p.diasVencimiento <= 7)
                                                    .reduce((sum, p) => sum + p.monto, 0) / 1000
                                            ).toFixed(0)}
                                            K
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Más urgente</span>
                                        <span className="font-semibold text-red-600">
                                            {Math.min(...DATOS_FINANCIEROS.cronogramaPagos.map((p) => p.diasVencimiento))} días
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-blue-100 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-800">
                                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold">Total Programado</CardTitle>
                                        <CardDescription>Próximos 30 días</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center mb-4">
                                    <p className="text-3xl font-bold text-blue-600">
                                        S/ {(DATOS_FINANCIEROS.cronogramaPagos.reduce((sum, p) => sum + p.monto, 0) / 1000).toFixed(0)}K
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">ingresos esperados</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Cantidad pagos</span>
                                        <span className="font-semibold">{DATOS_FINANCIEROS.cronogramaPagos.length}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Promedio por pago</span>
                                        <span className="font-semibold text-blue-600">
                                            S/{" "}
                                            {(
                                                DATOS_FINANCIEROS.cronogramaPagos.reduce((sum, p) => sum + p.monto, 0) /
                        DATOS_FINANCIEROS.cronogramaPagos.length /
                        1000
                                            ).toFixed(0)}
                                            K
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-green-100 border border-green-200 dark:bg-green-900/30 dark:border-green-800">
                                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold">Proyección Mensual</CardTitle>
                                        <CardDescription>Basado en cronograma</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center mb-4">
                                    <p className="text-3xl font-bold text-green-600">
                                        S/ {(DATOS_FINANCIEROS.resumenFinanciero.proyeccionMensual / 1000000).toFixed(1)}M
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">ingresos proyectados</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Vs. mes anterior</span>
                                        <span className="font-semibold text-green-600">+12.8%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Confiabilidad</span>
                                        <span className="font-semibold text-green-600">91.2%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Pestaña: Proyecciones */}
                <TabsContent value="proyecciones" className="space-y-6">
                    {/* Proyección de ingresos */}
                    <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 shadow-sm dark:from-slate-800 dark:to-slate-700 dark:border-slate-600">
                                    <TrendingUp className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                        Proyección de Ingresos
                                    </CardTitle>
                                    <CardDescription className="text-slate-600 dark:text-slate-400">
                                        Escenarios para los próximos 3 meses
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <AreaChart
                                    data={DATOS_FINANCIEROS.proyeccionIngresos}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <defs>
                                        <linearGradient id="optimista" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="realista" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="conservador" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="2 4" stroke="#e2e8f0" opacity={0.4} />
                                    <XAxis dataKey="mes" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `S/ ${(value / 1000000).toFixed(1)}M`}
                                    />
                                    <Tooltip
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg dark:bg-slate-800 dark:border-slate-700">
                                                        <p className="font-semibold mb-3">{label}</p>
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm text-green-600">Optimista:</span>
                                                                <span className="font-bold text-green-600">
                                                                    S/ {(data.optimista / 1000000).toFixed(1)}M
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm text-blue-600">Realista:</span>
                                                                <span className="font-bold text-blue-600">
                                                                    S/ {(data.realista / 1000000).toFixed(1)}M
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm text-amber-600">Conservador:</span>
                                                                <span className="font-bold text-amber-600">
                                                                    S/ {(data.conservador / 1000000).toFixed(1)}M
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="optimista"
                                        stroke="#10b981"
                                        fillOpacity={1}
                                        fill="url(#optimista)"
                                        strokeWidth={2}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="realista"
                                        stroke="#3b82f6"
                                        fillOpacity={1}
                                        fill="url(#realista)"
                                        strokeWidth={2}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="conservador"
                                        stroke="#f59e0b"
                                        fillOpacity={1}
                                        fill="url(#conservador)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Análisis de escenarios */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-green-100 border border-green-200 dark:bg-green-900/30 dark:border-green-800">
                                        <ArrowUpRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold">Escenario Optimista</CardTitle>
                                        <CardDescription>Mejor caso posible</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center mb-4">
                                    <p className="text-3xl font-bold text-green-600">S/ 6.35M</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Total 3 meses</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Promedio mensual</span>
                                        <span className="font-semibold text-green-600">S/ 2.12M</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Vs. actual</span>
                                        <span className="font-semibold text-green-600">+14.6%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Probabilidad</span>
                                        <span className="font-semibold">25%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-blue-100 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-800">
                                        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold">Escenario Realista</CardTitle>
                                        <CardDescription>Más probable</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center mb-4">
                                    <p className="text-3xl font-bold text-blue-600">S/ 5.55M</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Total 3 meses</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Promedio mensual</span>
                                        <span className="font-semibold text-blue-600">S/ 1.85M</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Vs. actual</span>
                                        <span className="font-semibold text-blue-600">+0.0%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Probabilidad</span>
                                        <span className="font-semibold">50%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-amber-100 border border-amber-200 dark:bg-amber-900/30 dark:border-amber-800">
                                        <TrendingDown className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold">Escenario Conservador</CardTitle>
                                        <CardDescription>Caso cauteloso</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center mb-4">
                                    <p className="text-3xl font-bold text-amber-600">S/ 4.95M</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Total 3 meses</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Promedio mensual</span>
                                        <span className="font-semibold text-amber-600">S/ 1.65M</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Vs. actual</span>
                                        <span className="font-semibold text-amber-600">-10.8%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Probabilidad</span>
                                        <span className="font-semibold">25%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Factores de riesgo y oportunidades */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-red-100 border border-red-200 dark:bg-red-900/30 dark:border-red-800">
                                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold">Factores de Riesgo</CardTitle>
                                        <CardDescription>Elementos que podrían afectar las proyecciones</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 rounded-xl bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800/30">
                                    <div className="flex items-center gap-3 mb-2">
                                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                        <span className="font-semibold text-red-800 dark:text-red-200">Cuentas Vencidas</span>
                                    </div>
                                    <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                                        S/ 450K en cuentas vencidas podrían impactar el flujo de ingresos
                                    </p>
                                    <p className="text-xs text-red-600 dark:text-red-400">Impacto: -5% en proyecciones</p>
                                </div>

                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/30">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                        <span className="font-semibold text-amber-800 dark:text-amber-200">Estacionalidad</span>
                                    </div>
                                    <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">
                                        Enero-Febrero tradicionalmente tienen menor actividad de cobranza
                                    </p>
                                    <p className="text-xs text-amber-600 dark:text-amber-400">Impacto: -8% en Q1</p>
                                </div>

                                <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 dark:bg-orange-900/20 dark:border-orange-800/30">
                                    <div className="flex items-center gap-3 mb-2">
                                        <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                        <span className="font-semibold text-orange-800 dark:text-orange-200">Morosidad</span>
                                    </div>
                                    <p className="text-sm text-orange-700 dark:text-orange-300 mb-2">
                                        Incremento en días de cartera podría retrasar ingresos
                                    </p>
                                    <p className="text-xs text-orange-600 dark:text-orange-400">Impacto: -3% en liquidez</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-green-100 border border-green-200 dark:bg-green-900/30 dark:border-green-800">
                                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold">Oportunidades</CardTitle>
                                        <CardDescription>Factores que podrían mejorar las proyecciones</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800/30">
                                    <div className="flex items-center gap-3 mb-2">
                                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        <span className="font-semibold text-green-800 dark:text-green-200">El Bosque - Cierre Total</span>
                                    </div>
                                    <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                                        Solo quedan 3 lotes por cobrar, alta probabilidad de cierre completo
                                    </p>
                                    <p className="text-xs text-green-600 dark:text-green-400">Potencial: +S/ 200K</p>
                                </div>

                                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30">
                                    <div className="flex items-center gap-3 mb-2">
                                        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <span className="font-semibold text-blue-800 dark:text-blue-200">
                                            Torres del Sol - Recuperación
                                        </span>
                                    </div>
                                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                                        Cronograma de pagos activo con alta probabilidad de cumplimiento
                                    </p>
                                    <p className="text-xs text-blue-600 dark:text-blue-400">Potencial: +S/ 890K</p>
                                </div>

                                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 dark:bg-purple-900/20 dark:border-purple-800/30">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Banknote className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        <span className="font-semibold text-purple-800 dark:text-purple-200">Mejora en Cobranza</span>
                                    </div>
                                    <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">
                                        Implementación de estrategias de cobranza más efectivas
                                    </p>
                                    <p className="text-xs text-purple-600 dark:text-purple-400">Potencial: +2% eficiencia</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
