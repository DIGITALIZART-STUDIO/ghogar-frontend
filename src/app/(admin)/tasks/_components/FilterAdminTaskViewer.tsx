import { CheckCircle2, Filter, ListFilter, Search, User, Users, X } from "lucide-react";

import { AutoComplete } from "@/components/ui/autocomplete";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskFilters, TaskTypes } from "../../assignments/[id]/tasks/_types/leadTask";
import { getTaskLabel } from "../../assignments/[id]/tasks/_utils/tasks.utils";
import { ClientSummaryDto } from "../../clients/_types/client";
import { UserSummaryDto } from "../../leads/_types/lead";

interface FilterAdminTaskViewerProps {
  dateRange: {
    from: Date;
    to: Date;
  };
  setDateRange: (range: { from: Date; to: Date }) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  clearFilters: () => void;
  filters: TaskFilters;
  setFilters: (filters: TaskFilters) => void;
  usersSummary: Array<UserSummaryDto>;
  clientsSummary: Array<ClientSummaryDto>;
  getLeadName: (leadId: string) => string;
  getAdvisorName: (advisorId: string) => string;
}

export default function FilterAdminTaskViewer({
    dateRange,
    setDateRange,
    searchQuery,
    setSearchQuery,
    showFilters,
    setShowFilters,
    clearFilters,
    filters,
    setFilters,
    usersSummary,
    clientsSummary,
    getLeadName,
    getAdvisorName,
}: FilterAdminTaskViewerProps) {
    const clientOptions = [
        { value: "all", label: "Todos los leads" },
        ...clientsSummary.map((client) => ({
            value: client.id ?? "",
            label: client.dni
                ? `${client.dni} - ${client.name}`
                : client.ruc
                    ? `${client.ruc} - ${client.name}`
                    : client.name!,
        })),
    ];

    const advisorOptions = [
        { value: "all", label: "Todos los asesores" },
        ...usersSummary.map((user) => ({
            value: user.id ?? "",
            label: user.userName ?? user.userName ?? "Sin nombre",
        })),
    ];
    return (
        <Card>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="flex-1">
                        <DateRangePicker
                            dateRange={{
                                from: dateRange.from,
                                to: dateRange.to,
                            }}
                            setDateRange={(range) => {
                                if (range?.from && range?.to) {
                                    setDateRange({
                                        from: range.from,
                                        to: range.to,
                                    });
                                }
                            }}
                            placeholder="Seleccionar rango de fechas"
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-none">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar tareas..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setShowFilters(!showFilters)}
                            className={showFilters ? "bg-muted" : ""}
                        >
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Filtros adicionales */}
                {showFilters && (
                    <div className="mt-4 border rounded-lg p-4 bg-muted/30">
                        <div className="flex items-center mb-3">
                            <div className="text-sm font-medium">
                                Filtros avanzados
                            </div>
                            <div className="ml-auto">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="h-7 px-2 text-xs"
                                    disabled={
                                        !filters.assignedToId && !filters.leadId && !filters.type && filters.isCompleted !== undefined
                                    }
                                >
                                    Limpiar todos
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {/* Filtro de Asesor */}
                            <div className="space-y-2">
                                <div className="text-xs font-medium text-muted-foreground flex items-center">
                                    <Users className="h-3.5 w-3.5 mr-1" />
                                    Asesor
                                </div>
                                <AutoComplete
                                    options={advisorOptions}
                                    emptyMessage="No se encontró el asesor"
                                    placeholder="Seleccione un asesor"
                                    onValueChange={(selectedOption) => {
                                        setFilters({ ...filters, assignedToId: selectedOption?.value ?? "" });
                                    }}
                                    value={advisorOptions.find((option) => option.value === filters.assignedToId) ?? undefined}
                                />
                            </div>

                            {/* Filtro de Lead */}
                            <div className="space-y-2">
                                <div className="text-xs font-medium text-muted-foreground flex items-center">
                                    <User className="h-3.5 w-3.5 mr-1" />
                                    Lead
                                </div>
                                <AutoComplete
                                    options={clientOptions}
                                    emptyMessage="No se encontró el lead"
                                    placeholder="Seleccione un lead"
                                    onValueChange={(selectedOption) => {
                                        setFilters({ ...filters, leadId: selectedOption?.value ?? "" });
                                    }}
                                    value={clientOptions.find((option) => option.value === filters.leadId) ?? undefined}
                                />
                            </div>

                            {/* Filtro de Tipo */}
                            <div className="space-y-2">
                                <div className="text-xs font-medium text-muted-foreground flex items-center">
                                    <ListFilter className="h-3.5 w-3.5 mr-1" />
                                    Tipo de tarea
                                </div>
                                <Select
                                    value={filters.type ?? "all"}
                                    onValueChange={(value) => setFilters({ ...filters, type: value })}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Todos los tipos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Todos los tipos
                                        </SelectItem>
                                        <SelectItem value="Call">
                                            Llamadas
                                        </SelectItem>
                                        <SelectItem value="Meeting">
                                            Reuniones
                                        </SelectItem>
                                        <SelectItem value="Email">
                                            Emails
                                        </SelectItem>
                                        <SelectItem value="Visit">
                                            Visitas
                                        </SelectItem>
                                        <SelectItem value="Other">
                                            Otros
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Filtro de Estado */}
                            <div className="space-y-2">
                                <div className="text-xs font-medium text-muted-foreground flex items-center">
                                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                    Estado
                                </div>
                                <Select
                                    value={filters.isCompleted === true ? "completed" : filters.isCompleted === false ? "pending" : "all"}
                                    onValueChange={(value) => {
                                        let isCompleted;
                                        if (value === "completed") {
                                            isCompleted = true;
                                        } else if (value === "pending") {
                                            isCompleted = false;
                                        } else {
                                            isCompleted = undefined;
                                        }

                                        // Actualizar los filtros con el valor booleano correcto
                                        setFilters({
                                            ...filters,
                                            isCompleted,
                                        });
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Todos los estados" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Todos los estados
                                        </SelectItem>
                                        <SelectItem value="completed">
                                            Completadas
                                        </SelectItem>
                                        <SelectItem value="pending">
                                            Pendientes
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Filtros activos */}
                        {(filters.assignedToId || filters.leadId || filters.type || filters.isCompleted !== undefined) && (
                            <div className="mt-3 pt-3 border-t flex flex-wrap gap-2 items-center">
                                <span className="text-xs text-muted-foreground">
                                    Filtros activos:
                                </span>

                                {filters.assignedToId && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <Users className="h-3 w-3 mr-1" />
                                        {getAdvisorName(filters.assignedToId)}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-4 w-4 p-0 ml-1"
                                            onClick={() => setFilters({ ...filters, assignedToId: "" })}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                )}

                                {filters.leadId && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <User className="h-3 w-3 mr-1" />
                                        {getLeadName(filters.leadId)}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-4 w-4 p-0 ml-1"
                                            onClick={() => setFilters({ ...filters, leadId: "" })}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                )}

                                {filters.type && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <ListFilter className="h-3 w-3 mr-1" />
                                        {getTaskLabel(filters.type as TaskTypes)}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-4 w-4 p-0 ml-1"
                                            onClick={() => setFilters({ ...filters, type: "" })}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                )}

                                {filters.isCompleted !== undefined && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        {filters.isCompleted ? "Completadas" : "Pendientes"}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-4 w-4 p-0 ml-1"
                                            onClick={() => setFilters({ ...filters, isCompleted: undefined })}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
