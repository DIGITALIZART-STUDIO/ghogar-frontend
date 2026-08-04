"use client";

import { useMemo } from "react";

import { LeadCaptureSource, LeadStatus } from "@/app/(admin)/leads/_types/lead";
import { DataTable } from "@/components/datatable/data-table";
import {
  CustomPaginationTableParams,
  ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";
import { AdvisorActivityReportItem } from "../_types/advisorActivity";
import { createAdvisorActivityFacetedFilters } from "../_utils/advisorActivity.filter.utils";
import { advisorActivityColumns } from "./AdvisorActivityTableColumns";
import { AdvisorActivityTaskDetail } from "./AdvisorActivityTaskDetail";

interface AdvisorActivityTableProps {
  data: Array<AdvisorActivityReportItem>;
  pagination: CustomPaginationTableParams;
  onPaginationChange: ServerPaginationChangeEventCallback;
  status: Array<LeadStatus>;
  setStatus: (status: Array<LeadStatus>) => void;
  captureSource: Array<LeadCaptureSource>;
  setCaptureSource: (captureSource: Array<LeadCaptureSource>) => void;
  isLoading?: boolean;
}

export function AdvisorActivityTable({
  data,
  pagination,
  onPaginationChange,
  status,
  setStatus,
  captureSource,
  setCaptureSource,
  isLoading = false,
}: AdvisorActivityTableProps) {
  const columns = useMemo(() => advisorActivityColumns(), []);

  const customFacetedFilters = useMemo(
    () =>
      createAdvisorActivityFacetedFilters(
        (values) => setStatus(values as Array<LeadStatus>),
        (values) => setCaptureSource(values as Array<LeadCaptureSource>),
        status,
        captureSource
      ),
    [setStatus, setCaptureSource, status, captureSource]
  );

  return (
    <DataTable
      isLoading={isLoading}
      data={data}
      columns={columns}
      filterPlaceholder="Buscar por código, cliente o asesor..."
      facetedFilters={customFacetedFilters}
      renderExpandedRow={(row) => <AdvisorActivityTaskDetail row={row} />}
      serverPagination={{
        pageIndex: pagination.page - 1,
        pageSize: pagination.pageSize,
        pageCount: pagination.totalPages,
        total: pagination.total,
        onPaginationChange: onPaginationChange,
      }}
    />
  );
}
