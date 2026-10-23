"use client";

import { useCallback, useEffect, useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { useSelectedProject } from "@/hooks/use-selected-project";
import { ReportAccessGuard } from "../../_components/ReportAccessGuard";
import { ADMINISTRATIVE_REPORT_ROLES } from "../../_utils/report-permissions";
import { CreditsReportFiltersBar } from "./_components/CreditsReportFiltersBar";
import { CreditsReportTable } from "./_components/CreditsReportTable";
import { useCreditsReport } from "./_hooks/useCreditsReport";
import { useExportCreditsReport } from "./_hooks/useExportCreditsReport";
import { PendingInstallmentsFilter } from "./_types/creditsReport";

export default function CreditsReportPage() {
  return (
    <ReportAccessGuard allowedRoles={ADMINISTRATIVE_REPORT_ROLES}>
      <CreditsReportPageContent />
    </ReportAccessGuard>
  );
}

function CreditsReportPageContent() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { getSelectedProjectId, isAllProjectsSelected } = useSelectedProject();
  const projectId = isAllProjectsSelected ? undefined : (getSelectedProjectId() ?? undefined);

  const {
    data,
    isLoading,
    error,
    filters,
    setDateRange,
    setSearch,
    setPendingInstallments,
    resetFilters,
    totalCount,
    totalPages,
  } = useCreditsReport(page, pageSize, projectId);

  const exportMutation = useExportCreditsReport();

  useEffect(() => {
    setPage(1);
  }, [projectId]);

  const handleDateRangeChange = useCallback(
    (from: string, to: string) => {
      setPage(1);
      setDateRange(from, to);
    },
    [setDateRange]
  );

  const handleSearchChange = useCallback(
    (search: string) => {
      setPage(1);
      setSearch(search);
    },
    [setSearch]
  );

  const handlePendingInstallmentsChange = useCallback(
    (value: PendingInstallmentsFilter) => {
      setPage(1);
      setPendingInstallments(value);
    },
    [setPendingInstallments]
  );

  const handleReset = useCallback(() => {
    setPage(1);
    resetFilters();
  }, [resetFilters]);

  const handlePaginationChange = useCallback(async (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  const handleExport = useCallback(() => {
    exportMutation.mutate(filters);
  }, [exportMutation, filters]);

  if (!data) {
    if (error) {
      return (
        <div>
          <HeaderPage
            title="Reporte de créditos"
            description="Contratos activos por fecha de inicio, con cliente, proyecto y cuotas pendientes."
          />
          <ErrorGeneral />
        </div>
      );
    }

    return (
      <div>
        <HeaderPage title="Reporte de créditos" description="Cargando créditos activos..." />
        <DataTableSkeleton columns={8} numFilters={2} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <HeaderPage
        title="Reporte de créditos"
        description="Contratos activos por fecha de inicio. Filtra por cliente, DNI y cuotas pendientes. El proyecto se toma del selector del encabezado."
      />

      <CreditsReportFiltersBar
        filters={filters}
        onDateRangeChange={handleDateRangeChange}
        onSearchChange={handleSearchChange}
        onPendingInstallmentsChange={handlePendingInstallmentsChange}
        onReset={handleReset}
        onExport={handleExport}
        isExporting={exportMutation.isPending}
      />

      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <CreditsReportTable
          data={data.data ?? []}
          pagination={{
            page: data.meta?.page ?? 1,
            pageSize: data.meta?.pageSize ?? 10,
            total: totalCount,
            totalPages: totalPages,
          }}
          onPaginationChange={handlePaginationChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
