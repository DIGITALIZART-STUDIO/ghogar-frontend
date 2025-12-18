import * as React from "react";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  Table as TableInstance,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ServerPaginationTanstackTableConfig,
  ServerPaginationWithSearchConfig,
} from "@/types/tanstack-table/CustomPagination";
import { Empty } from "../common/Empty";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { FacetedFilter } from "./facetedFilters";

// Filtro global genérico y estricto
function globalFilterFn<TData>(row: Row<TData>, _columnId: string, value: string): boolean {
  // Convierte todo el objeto original de la fila a string (incluye anidados)
  const rowString = JSON.stringify(row.original).toLowerCase();
  return rowString.includes(value.toLowerCase());
}

interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>;
  data: Array<TData>;
  toolbarActions?: React.ReactNode | ((table: TableInstance<TData>) => React.ReactNode);
  filterPlaceholder?: string;
  facetedFilters?: Array<FacetedFilter<TValue>>;
  // Funcionalidad expandible (opcional)
  renderExpandedRow?: (row: TData) => React.ReactNode;
  onClickRow?: (row: TData) => void;
  columnVisibilityConfig?: Partial<Record<keyof TData, boolean>>;
  enableColumnPinning?: boolean;
  // Expansión lateral (nueva variante)
  expansionMode?: "vertical" | "lateral";
  renderLateralContent?: (row: TData) => React.ReactNode;
  lateralPanelSize?: number; // Porcentaje del panel lateral (0-100)
  onLateralToggle?: (isOpen: boolean, row?: TData) => void;
  // Configuración del drawer para móviles
  drawerTitle?: string;
  drawerDescription?: string;
  drawerScrollAreaClassName?: string;
  drawerScrollAreaHeight?: string;
  // Configuración para paginación del servidor (básica)
  serverPagination?: ServerPaginationTanstackTableConfig;
  // Configuración extendida para paginación del servidor con búsqueda y filtros
  serverConfig?: ServerPaginationWithSearchConfig;
  // Estado de carga (opcional, si no se proporciona se maneja internamente)
  isLoading?: boolean;
  // Props para manejar filtros externos (mejora de filtrado del servidor)
  externalGlobalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  externalFilterValue?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  toolbarActions,
  filterPlaceholder,
  facetedFilters,
  renderExpandedRow,
  onClickRow,
  columnVisibilityConfig,
  enableColumnPinning = false,
  expansionMode = "vertical",
  renderLateralContent,
  lateralPanelSize = 40,
  onLateralToggle,
  drawerTitle = "",
  drawerDescription = "",
  drawerScrollAreaClassName = "h-[70vh] px-0 pb-4",
  drawerScrollAreaHeight,
  serverPagination,
  serverConfig,
  isLoading: externalIsLoading,
  externalGlobalFilter,
  onGlobalFilterChange,
  externalFilterValue,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState(externalGlobalFilter ?? "");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
    (columnVisibilityConfig as VisibilityState) ?? {}
  );

  // Sincronizar filtro global externo con estado interno
  React.useEffect(() => {
    if (externalGlobalFilter !== undefined) {
      setGlobalFilter(externalGlobalFilter);
    }
  }, [externalGlobalFilter]);

  // Manejar cambios en el filtro global
  const handleGlobalFilterChange = React.useCallback(
    (value: string) => {
      setGlobalFilter(value);
      if (onGlobalFilterChange) {
        onGlobalFilterChange(value);
      }
    },
    [onGlobalFilterChange]
  );

  // Estado de expansión (solo si se habilita la funcionalidad expandible)
  const [expanded, setExpanded] = React.useState({});

  // Estado para expansión lateral
  const [lateralExpanded, setLateralExpanded] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<TData | null>(null);

  // Estado para drawer en móviles (expansión vertical)
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerRow, setDrawerRow] = React.useState<TData | null>(null);
  // Estado persistente para la fila seleccionada (para transiciones)
  const [selectedRowForTransition, setSelectedRowForTransition] = React.useState<TData | null>(null);

  // Hook para detectar si es móvil
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkIsMobile = () => {
      const wasMobile = isMobile;
      const nowMobile = window.innerWidth < 768; // md breakpoint

      setIsMobile(nowMobile);

      // Si cambió de móvil a desktop y el drawer está abierto, cerrarlo
      if (wasMobile && !nowMobile && drawerOpen) {
        setDrawerOpen(false);
        setDrawerRow(null);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, [isMobile, drawerOpen]);

  // Efecto para limpiar el estado del drawer cuando se cierra
  React.useEffect(() => {
    if (!drawerOpen) {
      setDrawerRow(null);
    }
  }, [drawerOpen]);

  // Configurar altura del ScrollArea si se proporciona (siguiendo patrón de ResponsiveDialog)
  const finalDrawerScrollClassName = React.useMemo(() => {
    const baseClasses = drawerScrollAreaClassName;
    const heightClass = drawerScrollAreaHeight ? `h-[${drawerScrollAreaHeight}]` : "";
    return `${baseClasses} ${heightClass}`.trim();
  }, [drawerScrollAreaClassName, drawerScrollAreaHeight]);

  // Determinar qué configuración usar (prioridad: serverConfig > serverPagination)
  const activeServerConfig = serverConfig ?? serverPagination;
  // Estado de paginación local o del servidor
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: activeServerConfig?.pageIndex ?? 0,
    pageSize: activeServerConfig?.pageSize ?? 10,
  });

  // Estado de carga de paginación (interno si no se proporciona externamente)
  const [internalIsLoading, setInternalIsLoading] = React.useState(false);

  // Usar el estado de carga externo si se proporciona, sino usar el interno
  const isLoading = externalIsLoading ?? internalIsLoading;

  React.useEffect(() => {
    // Solo activar carga y llamar al servidor si hay configuración del servidor y no se proporciona estado externo
    if (activeServerConfig?.onPaginationChange && externalIsLoading === undefined) {
      setInternalIsLoading(true);
      activeServerConfig.onPaginationChange(pagination.pageIndex, pagination.pageSize).finally(() => {
        setInternalIsLoading(false);
      });
    }
  }, [pagination.pageIndex, pagination.pageSize, activeServerConfig, externalIsLoading]);

  // Manejar cambios de paginación
  const handlePaginationChange = React.useCallback(
    (updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState)) => {
      const newPagination = typeof updaterOrValue === "function" ? updaterOrValue(pagination) : updaterOrValue;
      setPagination(newPagination);
      if (activeServerConfig?.onPaginationChange) {
        activeServerConfig.onPaginationChange(newPagination.pageIndex, newPagination.pageSize);
      }
    },
    [pagination, activeServerConfig]
  );

  const table = useReactTable<TData>({
    data,
    columns,
    filterFns: {
      global: globalFilterFn,
    },
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
      ...(enableColumnPinning && { columnPinning }),
      ...(renderExpandedRow && { expanded }),
      pagination,
    },
    ...(renderExpandedRow && {
      onExpandedChange: setExpanded,
      getRowCanExpand: () => true,
    }),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: handleGlobalFilterChange,
    ...(enableColumnPinning && { onColumnPinningChange: setColumnPinning }),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: activeServerConfig ? undefined : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn,
    ...(activeServerConfig
      ? {
          pageCount: activeServerConfig.pageCount,
          manualPagination: true,
        }
      : {
          manualPagination: false,
        }),
  });

  // Efecto para sincronizar drawer con expansión vertical cuando cambia de móvil a desktop
  React.useEffect(() => {
    if (!isMobile && drawerRow && expansionMode === "vertical" && renderExpandedRow) {
      // Si estamos en desktop y había una fila seleccionada en el drawer,
      // expandir esa fila en la tabla
      const rowId = table.getRowModel().rows.find((row) => row.original === drawerRow)?.id;
      if (rowId) {
        setExpanded({ [rowId]: true });
      }
    }
  }, [isMobile, drawerRow, expansionMode, renderExpandedRow, table]);

  // Efecto adicional para manejar el cambio de móvil a desktop
  React.useEffect(() => {
    if (!isMobile && selectedRowForTransition && expansionMode === "vertical" && renderExpandedRow) {
      const rowId = table.getRowModel().rows.find((row) => row.original === selectedRowForTransition)?.id;
      if (rowId) {
        setExpanded({ [rowId]: true });
        // Cerrar el drawer después de expandir
        setTimeout(() => {
          setDrawerOpen(false);
        }, 100);
      }
    }
  }, [isMobile, selectedRowForTransition, expansionMode, renderExpandedRow, table]);

  // Efecto para limpiar expansión vertical cuando se cambia a móvil
  React.useEffect(() => {
    if (isMobile && expansionMode === "vertical" && renderExpandedRow) {
      // Si cambiamos a móvil, limpiar cualquier expansión vertical
      setExpanded({});
    }
  }, [isMobile, expansionMode, renderExpandedRow]);

  // Efecto para abrir drawer automáticamente cuando se cambia a móvil con fila expandida
  React.useEffect(() => {
    if (isMobile && expansionMode === "vertical" && renderExpandedRow) {
      const expandedRowId = Object.keys(expanded).find((id) => (expanded as Record<string, boolean>)[id]);
      if (expandedRowId) {
        const expandedRow = table.getRowModel().rows.find((row) => row.id === expandedRowId);
        if (expandedRow) {
          setSelectedRowForTransition(expandedRow.original);
          setDrawerRow(expandedRow.original);
          setDrawerOpen(true);
        }
      }
    }
  }, [isMobile, expansionMode, renderExpandedRow, expanded, table]);

  // Estilos para columnas fijadas (solo si está habilitado el pinning)
  const getCommonPinningStyles = (column: Column<TData>): React.CSSProperties => {
    if (!enableColumnPinning) {
      return {};
    }

    const isPinned = column.getIsPinned();
    return {
      left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
      right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
      zIndex: isPinned ? 1 : 0,
    };
  };

  /**
   * Verifica si un clic debe ser ignorado para la expansión de filas.
   * Utiliza un enfoque robusto basado en:
   * 1. Verificar si el elemento está dentro de la fila de la tabla (currentTarget)
   * 2. Verificar si es un elemento interactivo nativo (button, a, input, etc.)
   * 3. Verificar atributos ARIA de interactividad
   */
  const shouldIgnoreRowClick = (event: React.MouseEvent<HTMLTableRowElement>, target: HTMLElement): boolean => {
    const row = event.currentTarget;

    // 1. Si el target no está contenido en la fila, el clic viene de un portal (diálogo, drawer, etc.)
    if (!row.contains(target)) {
      return true;
    }

    // 2. Verificar elementos interactivos nativos
    const interactiveTags = ["BUTTON", "A", "INPUT", "SELECT", "TEXTAREA", "LABEL"];
    if (interactiveTags.includes(target.tagName)) {
      return true;
    }

    // 3. Verificar si algún ancestro (hasta la fila) es interactivo
    let current: HTMLElement | null = target;
    while (current && current !== row) {
      // Elementos HTML interactivos
      if (interactiveTags.includes(current.tagName)) {
        return true;
      }

      // Roles ARIA de interactividad
      const role = current.getAttribute("role");
      if (role && ["button", "link", "menuitem", "option", "checkbox", "radio", "switch", "tab"].includes(role)) {
        return true;
      }

      // Elementos con tabindex que indican interactividad
      const tabIndex = current.getAttribute("tabindex");
      if (tabIndex !== null && tabIndex !== "-1" && current.onclick !== null) {
        return true;
      }

      // Detectar elementos con data attributes de Radix que indican interactividad
      if (
        current.hasAttribute("data-radix-collection-item") ||
        (current.hasAttribute("data-disabled") === false && current.closest("[data-radix-menu-content]"))
      ) {
        return true;
      }

      current = current.parentElement;
    }

    return false;
  };

  // Manejar clic en fila para expansión lateral
  const handleRowClick = React.useCallback(
    (row: TData, event?: React.MouseEvent<HTMLTableRowElement>) => {
      // Si el clic debe ser ignorado (elemento interactivo o fuera de la fila), no hacer nada
      if (event && shouldIgnoreRowClick(event, event.target as HTMLElement)) {
        return;
      }

      if (expansionMode === "lateral" && renderLateralContent) {
        const isCurrentlySelected = selectedRow === row;
        if (isCurrentlySelected) {
          // Si ya está seleccionada, cerrar el panel
          setLateralExpanded(false);
          setSelectedRow(null);
          onLateralToggle?.(false);
        } else {
          // Seleccionar nueva fila y abrir panel
          setSelectedRow(row);
          setLateralExpanded(true);
          onLateralToggle?.(true, row);
        }
      } else if (expansionMode === "vertical" && renderExpandedRow) {
        // Mantener el estado persistente de la fila seleccionada
        setSelectedRowForTransition(row);

        if (isMobile) {
          // En móviles, usar drawer para expansión vertical
          setDrawerRow(row);
          setDrawerOpen(true);
        } else {
          // En desktop, usar expansión vertical tradicional
          const rowId = table.getRowModel().rows.find((r) => r.original === row)?.id;
          if (rowId) {
            const isCurrentlyExpanded = (expanded as Record<string, boolean>)[rowId];
            if (isCurrentlyExpanded) {
              // Si ya está expandida, colapsarla
              setExpanded((prev) => {
                const newExpanded = { ...prev };
                delete (newExpanded as Record<string, boolean>)[rowId];
                return newExpanded;
              });
            } else {
              // Expandir la fila
              setExpanded((prev) => ({ ...prev, [rowId]: true }));
            }
          }
        }
      } else if (onClickRow) {
        // Comportamiento original si no es expansión lateral
        onClickRow(row);
      }
    },
    [
      expansionMode,
      renderLateralContent,
      renderExpandedRow,
      selectedRow,
      onLateralToggle,
      onClickRow,
      isMobile,
      table,
      expanded,
    ]
  );

  // Cerrar panel lateral
  const closeLateralPanel = React.useCallback(() => {
    setLateralExpanded(false);
    setSelectedRow(null);
    onLateralToggle?.(false);
  }, [onLateralToggle]);

  // Componente de tabla
  const TableComponent = () => (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        toolbarActions={toolbarActions}
        filterPlaceholder={filterPlaceholder}
        facetedFilters={facetedFilters}
        serverConfig={serverConfig}
        externalFilterValue={externalFilterValue}
        onGlobalFilterChange={onGlobalFilterChange}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const { column } = header;
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={enableColumnPinning ? getCommonPinningStyles(column) : undefined}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading && activeServerConfig ? (
              // Show skeleton rows while fetching data - solo el contenido de la tabla
              Array(5)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {columns.map((_, colIndex) => (
                      <TableCell key={`skeleton-${index}-${colIndex}`} className="h-12">
                        <div className="h-4 bg-muted animate-pulse rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    className={`transition-colors duration-150 ease-in-out hover:bg-muted/30 cursor-pointer ${
                      expansionMode === "lateral" && selectedRow === row.original ? "bg-muted/50" : ""
                    } ${expansionMode === "vertical" && row.getIsExpanded() ? "bg-muted/30" : ""}`}
                    onClick={(e) => handleRowClick(row.original, e)}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const { column } = cell;
                      return (
                        <TableCell
                          key={cell.id}
                          style={enableColumnPinning ? getCommonPinningStyles(column) : undefined}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  {row.getIsExpanded() && renderExpandedRow && expansionMode === "vertical" && !isMobile && (
                    <TableRow
                      data-state={row.getIsExpanded() ? "expanded" : "collapsed"}
                      className="animate-in fade-in-0 slide-in-from-top-1 duration-200 ease-out"
                    >
                      <TableCell colSpan={columns.length} className="p-0">
                        <div className="border-t bg-muted/20">
                          <div className="p-4">{renderExpandedRow(row.original)}</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <Empty />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} serverPagination={activeServerConfig} />
    </div>
  );

  // Si es expansión lateral, usar ResizablePanelGroup o layout móvil
  if (expansionMode === "lateral" && renderLateralContent) {
    // En móviles, mostrar como expansión vertical
    if (isMobile) {
      return (
        <div className="space-y-4">
          <TableComponent />
          {lateralExpanded && selectedRow && (
            <div className="border rounded-md bg-background animate-in fade-in-0 slide-in-from-bottom-2 duration-200 ease-out">
              <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                <h3 className="text-lg font-semibold">Detalles</h3>
                <button
                  onClick={closeLateralPanel}
                  className="p-1 hover:bg-muted rounded-md transition-colors duration-150"
                  aria-label="Cerrar panel"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">{renderLateralContent(selectedRow)}</div>
            </div>
          )}
        </div>
      );
    }

    // En desktop, usar ResizablePanelGroup
    return (
      <div className="h-full">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={lateralExpanded ? 100 - lateralPanelSize : 100} minSize={30}>
            <TableComponent />
          </ResizablePanel>

          {lateralExpanded && selectedRow && (
            <>
              <ResizableHandle
                withHandle
                className="bg-border hover:bg-border/80 transition-colors duration-150 ml-4"
              />
              <ResizablePanel
                defaultSize={lateralPanelSize}
                minSize={20}
                className="border-l bg-background animate-in fade-in-0 slide-in-from-right-2 duration-200 ease-out"
              >
                <div className="h-full flex flex-col">
                  {/* Header del panel lateral */}
                  <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                    <h3 className="text-lg font-semibold">Detalles</h3>
                    <button
                      onClick={closeLateralPanel}
                      className="p-1 hover:bg-muted rounded-md transition-colors duration-150"
                      aria-label="Cerrar panel"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Contenido del panel lateral */}
                  <div className="flex-1 p-4 overflow-auto">{renderLateralContent(selectedRow)}</div>
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    );
  }

  // Modo vertical (comportamiento original)
  return (
    <>
      <TableComponent />

      {/* Drawer para expansión vertical en móviles */}
      {expansionMode === "vertical" && renderExpandedRow && (
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerContent onClick={(ev) => ev.stopPropagation()}>
            <DrawerHeader className="pb-2">
              <DrawerTitle>{drawerTitle || "Detalles"}</DrawerTitle>
              <DrawerDescription>
                {drawerDescription || "Información detallada del elemento seleccionado"}
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex-1 overflow-hidden">
              <ScrollArea className={finalDrawerScrollClassName}>
                <div className="px-4">{drawerRow && renderExpandedRow(drawerRow)}</div>
              </ScrollArea>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
