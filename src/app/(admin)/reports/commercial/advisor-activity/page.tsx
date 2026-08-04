"use client";

import { useCallback, useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { useSelectedProject } from "@/hooks/use-selected-project";
import { AdvisorActivityFiltersBar } from "./_components/AdvisorActivityFiltersBar";
import { AdvisorActivityTable } from "./_components/AdvisorActivityTable";
import { useAdvisorActivityReport } from "./_hooks/useAdvisorActivityReport";
import { useExportAdvisorActivityReport } from "./_hooks/useExportAdvisorActivityReport";

export default function AdvisorActivityReportPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { getSelectedProjectId, isAllProjectsSelected } = useSelectedProject();
  // Si el usuario eligió "Todos los proyectos", no enviamos projectId (ver todos).
  const projectId = isAllProjectsSelected ? undefined : (getSelectedProjectId() ?? undefined);

  const {
    data,
    isLoading,
    error,
    filters,
    setDateRange,
    setAdvisorId,
    setStatus,
    setCaptureSource,
    setHasAdvisor,
    resetFilters,
    totalCount,
    totalPages,
  } = useAdvisorActivityReport(page, pageSize, projectId);

  const exportMutation = useExportAdvisorActivityReport();

  const handlePaginationChange = useCallback(async (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  const handleExport = useCallback(() => {
    exportMutation.mutate(filters);
  }, [exportMutation, filters]);

  if (isLoading && !data) {
    return (
      <div>
        <HeaderPage title="Actividad de Asesores" description="Cargando reporte de actividad comercial..." />
        <DataTableSkeleton columns={8} numFilters={2} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <HeaderPage
          title="Actividad de Asesores"
          description="Leads ingresados, estado y tareas realizadas por los asesores en el periodo seleccionado."
        />
        <ErrorGeneral />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <HeaderPage
        title="Actividad de Asesores"
        description="Leads ingresados, estado y tareas realizadas por los asesores en el periodo seleccionado."
      />

      <AdvisorActivityFiltersBar
        filters={filters}
        onDateRangeChange={setDateRange}
        onAdvisorChange={setAdvisorId}
        onHasAdvisorChange={setHasAdvisor}
        onReset={resetFilters}
        onExport={handleExport}
        isExporting={exportMutation.isPending}
      />

      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <AdvisorActivityTable
          data={data.data ?? []}
          pagination={{
            page: data.meta?.page ?? 1,
            pageSize: data.meta?.pageSize ?? 10,
            total: totalCount,
            totalPages: totalPages,
          }}
          onPaginationChange={handlePaginationChange}
          status={filters.status}
          setStatus={setStatus}
          captureSource={filters.captureSource}
          setCaptureSource={setCaptureSource}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
