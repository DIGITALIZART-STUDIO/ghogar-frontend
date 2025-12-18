"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Table as TableInstance } from "@tanstack/react-table";

import { DataTable } from "@/components/datatable/data-table";
import {
  CustomPaginationTableParams,
  ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";
import { ReservationDto } from "../_types/reservation";
import { createFacetedFilters } from "../_utils/reservations.filter.utils";
import { reservationsColumns } from "./ReservationsTableColumns";
import { ReservationsTableToolbarActions } from "./ReservationsTableToolbarActions";

interface ReservationsTableProps {
  data: Array<ReservationDto>;
  pagination: CustomPaginationTableParams;
  onPaginationChange: ServerPaginationChangeEventCallback;
  search?: string;
  onSearchChange: (search: string) => void;
  status?: Array<string>;
  onStatusChange: (status: Array<string>) => void;
  paymentMethod?: Array<string>;
  onPaymentMethodChange: (paymentMethod: Array<string>) => void;
  isLoading?: boolean;
}

export function ReservationsTable({
  data,
  pagination,
  onPaginationChange,
  search,
  onSearchChange,
  status,
  onStatusChange,
  paymentMethod,
  onPaymentMethodChange,
  isLoading = false,
}: ReservationsTableProps) {
  const router = useRouter();

  const handleEditInterface = useCallback(
    (id: string) => {
      router.push(`/reservations/${id}/edit`);
    },
    [router]
  );

  const columns = useMemo(() => reservationsColumns(handleEditInterface), [handleEditInterface]);

  // Crear filtros personalizados con callbacks del servidor
  const customFacetedFilters = useMemo(
    () => createFacetedFilters(onStatusChange, onPaymentMethodChange, status, paymentMethod),
    [onStatusChange, onPaymentMethodChange, status, paymentMethod]
  );

  return (
    <DataTable
      isLoading={isLoading}
      data={data}
      columns={columns}
      toolbarActions={(table: TableInstance<ReservationDto>) => <ReservationsTableToolbarActions table={table} />}
      filterPlaceholder="Buscar separaciones..."
      facetedFilters={customFacetedFilters}
      externalFilterValue={search}
      onGlobalFilterChange={onSearchChange}
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
