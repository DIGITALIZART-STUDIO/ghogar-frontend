"use client";

import { useCallback, useEffect, useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { useSelectedProject } from "@/hooks/use-selected-project";
import { ReportAccessGuard } from "../../_components/ReportAccessGuard";
import { ADMINISTRATIVE_REPORT_ROLES } from "../../_utils/report-permissions";
import { IncomeReportFiltersBar } from "./_components/IncomeReportFiltersBar";
import { IncomeReportSummaryCards } from "./_components/IncomeReportSummaryCards";
import { IncomeReportTable } from "./_components/IncomeReportTable";
import { useExportIncomeReport } from "./_hooks/useExportIncomeReport";
import { useIncomeReport } from "./_hooks/useIncomeReport";

export default function IncomeReportPage() {
  return (
    <ReportAccessGuard allowedRoles={ADMINISTRATIVE_REPORT_ROLES}>
      <IncomeReportPageContent />
    </ReportAccessGuard>
  );
}

function IncomeReportPageContent() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { getSelectedProjectId, isAllProjectsSelected } = useSelectedProject();
  const projectId = isAllProjectsSelected ? undefined : (getSelectedProjectId() ?? undefined);

  const { data, isLoading, error, filters, setDateRange, resetFilters, totalCount, totalPages } = useIncomeReport(
    page,
    pageSize,
    projectId
  );

  const exportMutation = useExportIncomeReport();

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
            title="Reporte de ingresos"
            description="Vouchers registrados en el periodo, incluyendo pagos de contratos y de separaciones."
          />
          <ErrorGeneral />
        </div>
      );
    }

    return (
      <div>
        <HeaderPage title="Reporte de ingresos" description="Cargando pagos registrados..." />
        <DataTableSkeleton columns={8} numFilters={1} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <HeaderPage
        title="Reporte de ingresos"
        description="Listado de vouchers por fecha de pago. El proyecto se toma del selector del encabezado."
      />

      <IncomeReportFiltersBar
        filters={filters}
        onDateRangeChange={handleDateRangeChange}
        onReset={handleReset}
        onExport={handleExport}
        isExporting={exportMutation.isPending}
      />

      <IncomeReportSummaryCards summary={data.summary} />

      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <IncomeReportTable
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
