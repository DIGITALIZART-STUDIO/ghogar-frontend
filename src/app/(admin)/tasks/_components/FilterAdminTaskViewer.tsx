import { CheckCircle2, Clock, Filter, ListFilter, Search, User, Users, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserSearch } from "../../leads/_components/search/UserSearch";
import { ClientSearch } from "../../clients/_components/search/ClientSearch";
import { TaskFilters, TaskTypes } from "../../assignments/[id]/tasks/_types/leadTask";
import { getTaskLabel, TaskTypesConfig } from "../../assignments/[id]/tasks/_utils/tasks.utils";

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
    getLeadName,
    getAdvisorName,
}: FilterAdminTaskViewerProps) {

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
                                <UserSearch
                                    value={filters.assignedToId ?? ""}
                                    onSelect={(userId) => {
                                        setFilters({ ...filters, assignedToId: userId });
                                    }}
                                    placeholder="Seleccione un asesor"
                                    searchPlaceholder="Buscar por nombre, email, rol..."
                                    emptyMessage="No se encontraron asesores"
                                />
                            </div>

                            {/* Filtro de Lead */}
                            <div className="space-y-2">
                                <div className="text-xs font-medium text-muted-foreground flex items-center">
                                    <User className="h-3.5 w-3.5 mr-1" />
                                    Lead
                                </div>
                                <ClientSearch
                                    value={filters.leadId ?? ""}
                                    onSelect={(clientId) => {
                                        setFilters({ ...filters, leadId: clientId });
                                    }}
                                    placeholder="Seleccione un lead"
                                    searchPlaceholder="Buscar por nombre, DNI, RUC, teléfono..."
                                    emptyMessage="No se encontraron leads"
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
                                    onValueChange={(value) => setFilters({ ...filters, type: value === "all" ? "" : value })}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Todos los tipos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            <span className="flex items-center gap-2 text-gray-700">
                                                <ListFilter className="h-4 w-4 text-gray-700" />
                                                Todos los tipos
                                            </span>
                                        </SelectItem>
                                        {Object.entries(TaskTypesConfig).map(([key, config]) => (
                                            <SelectItem key={key} value={key}>
                                                <span className={"flex items-center gap-2"}>
                                                    <config.icon className={`h-4 w-4 ${config.textColor}`} />
                                                    {config.label}
                                                </span>
                                            </SelectItem>
                                        ))}
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
                                            <span className="flex items-center gap-2">
                                                <ListFilter className="h-4 w-4 text-gray-400" />
                                                Todos los estados
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="completed">
                                            <span className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                Completadas
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="pending">
                                            <span className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-yellow-500" />
                                                Pendientes
                                            </span>
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

                                {filters.type && filters.type !== "all" && (
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
