"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Filter, Home, Search, X } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LotData, LotStatus } from "../_types/lot";
import { getAllLotStatuses, getLotStatusConfig } from "../_utils/lots.filter.utils";
import { LotCard } from "./LotCard";

interface LotsClientProps {
  lots: Array<LotData> | undefined;
  blockId?: string;
  projectId?: string;
  onSearchChange?: (search: string) => void;
  onStatusChange?: (status: string) => void;
  onResetSearch?: () => void;
  search?: string;
  status?: string;
}

export function LotsClient({
  lots,
  projectId,
  onSearchChange,
  onStatusChange,
  onResetSearch,
  search,
  status,
}: LotsClientProps) {
  const [projectFilter, setProjectFilter] = useState<string>("all");

  // Estado local para el input de búsqueda (como en AutoComplete)
  const [searchInput, setSearchInput] = useState("");

  // Ref para mantener el foco en el input
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Callback con debounce para búsqueda (como en AutoComplete)
  const debouncedSearch = useDebouncedCallback((term: string) => {
    if (term !== "None" && term !== null && term !== undefined) {
      onSearchChange?.(term.trim());
    } else {
      onSearchChange?.("");
    }
  }, 500);

  // Función para manejar cambios en el input de búsqueda (como en AutoComplete)
  const handleInputChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      debouncedSearch(value);

      // Mantener el foco después del cambio (como en AutoComplete)
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    },
    [debouncedSearch]
  );

  // Función para limpiar la búsqueda
  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    onResetSearch?.();

    // Mantener el foco después de limpiar (como en AutoComplete)
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [onResetSearch]);

  // Sincronizar el input local con el estado del hook (como en AutoComplete)
  useEffect(() => {
    setSearchInput(search ?? "");
  }, [search]);

  // Mantener el foco en el input durante la búsqueda (como en AutoComplete)
  useEffect(() => {
    if (searchInputRef.current && searchInput && !lots) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [searchInput, lots]);

  // Los lotes ya vienen filtrados del backend, solo aplicamos filtros locales adicionales si es necesario
  const filteredLots = useMemo(
    () =>
      lots?.filter((lot) => {
        // Solo aplicar filtro de proyecto si es necesario (para casos especiales)
        const matchesProject = projectFilter === "all" || lot.projectName === projectFilter;
        return matchesProject;
      }) ?? [],
    [lots, projectFilter]
  );

  // Calcular estadísticas - CORREGIDO para usar strings
  const stats = useMemo(
    () => ({
      total: filteredLots?.length,
      available: filteredLots?.filter((lot) => lot.status === LotStatus.Available).length,
      reserved: filteredLots?.filter((lot) => lot.status === LotStatus.Reserved).length,
      sold: filteredLots?.filter((lot) => lot.status === LotStatus.Sold).length,
      quoted: filteredLots?.filter((lot) => lot.status === LotStatus.Quoted).length,
    }),
    [filteredLots]
  );

  const clearFilters = () => {
    setProjectFilter("all");
    onResetSearch?.();
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <Card className="border pt-0">
        <CardHeader className="my-4">
          <CardTitle className="text-xl flex items-center mt-2">
            <Filter className="mr-2 h-5 w-5 text-primary" />
            Filtros de Búsqueda
          </CardTitle>
          <CardDescription>Encuentra lotes específicos usando los filtros disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar lotes por número, bloque o proyecto..."
                value={searchInput}
                onChange={(e) => handleInputChange(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              />
              {searchInput && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Select value={status ?? "all"} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {getAllLotStatuses().map((status) => {
                  const config = getLotStatusConfig(status);
                  const Icon = config.icon;
                  return (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${config.textClassName}`} />
                        <span>{config.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Indicador de resultados de búsqueda */}
      {search && (
        <div className="text-sm text-muted-foreground">
          {lots && lots.length > 0 ? (
            <span>
              {lots.length} lote{lots.length !== 1 ? "s" : ""} encontrado{lots.length !== 1 ? "s" : ""} para &quot;
              {search}&quot;
            </span>
          ) : (
            <span>No se encontraron lotes para &quot;{search}&quot;</span>
          )}
        </div>
      )}

      {/* Quick Stats - Diseño mejorado */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Total */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">Total Lotes</div>
              </div>
              <div className="p-3 rounded-full bg-slate-200 dark:bg-slate-700">
                <Home className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              </div>
            </div>
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-slate-200/20 dark:bg-slate-600/20 rounded-full" />
          </CardContent>
        </Card>

        {/* Available */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 border-emerald-200 dark:border-emerald-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{stats.available}</div>
                <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-1">
                  {getLotStatusConfig(LotStatus.Available).label}
                </div>
              </div>
              <div className="p-3 rounded-full bg-emerald-200 dark:bg-emerald-800">
                {(() => {
                  const Icon = getLotStatusConfig(LotStatus.Available).icon;
                  return <Icon className="w-6 h-6 text-emerald-700 dark:text-emerald-300" />;
                })()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quoted */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 border-amber-200 dark:border-amber-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">{stats.quoted}</div>
                <div className="text-sm font-medium text-amber-600 dark:text-amber-400 mt-1">
                  {getLotStatusConfig(LotStatus.Quoted).label}
                </div>
              </div>
              <div className="p-3 rounded-full bg-amber-200 dark:bg-amber-800">
                {(() => {
                  const Icon = getLotStatusConfig(LotStatus.Quoted).icon;
                  return <Icon className="w-6 h-6 text-amber-700 dark:text-amber-300" />;
                })()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reserved */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.reserved}</div>
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
                  {getLotStatusConfig(LotStatus.Reserved).label}
                </div>
              </div>
              <div className="p-3 rounded-full bg-blue-200 dark:bg-blue-800">
                {(() => {
                  const Icon = getLotStatusConfig(LotStatus.Reserved).icon;
                  return <Icon className="w-6 h-6 text-blue-700 dark:text-blue-300" />;
                })()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sold */}
        <Card className="relative overflow-hidden border-0  bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-700/30 border-gray-200 dark:border-gray-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-700 dark:text-gray-300">{stats.sold}</div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
                  {getLotStatusConfig(LotStatus.Sold).label}
                </div>
              </div>
              <div className="p-3 rounded-full bg-gray-200 dark:bg-gray-700">
                {(() => {
                  const Icon = getLotStatusConfig(LotStatus.Sold).icon;
                  return <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />;
                })()}
              </div>
            </div>
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-gray-200/20 dark:bg-gray-600/20 rounded-full" />
          </CardContent>
        </Card>
      </div>

      {/* Lots Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Lotes Encontrados ({filteredLots.length})
          </h2>
          {(search || status !== "all" || projectFilter !== "all") && (
            <Button variant="outline" onClick={clearFilters}>
              Limpiar Filtros
            </Button>
          )}
        </div>

        {filteredLots.length === 0 && (search || status !== "all" || projectFilter !== "all") ? (
          <Card className="border-0">
            <CardContent className="p-12 text-center">
              <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron lotes</h3>
              <p className="text-gray-600 mb-4">No hay lotes que coincidan con los filtros seleccionados.</p>
              <Button onClick={clearFilters}>Limpiar Filtros</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredLots.map((lot) => (
              <LotCard key={lot.id} lot={lot} projectId={projectId ?? ""} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
