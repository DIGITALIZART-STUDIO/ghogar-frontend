"use client";

import {  useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { DataTable } from "@/components/datatable/data-table";
import { ReservationsTableToolbarActions } from "./PendingContractsTableToolbarActions";
import { CustomPaginationTableParams, ServerPaginationChangeEventCallback } from "@/types/tanstack-table/CustomPagination";
import { ReservationDto, ReservationWithPendingPaymentsDto } from "../../reservations/_types/reservation";
import { creditManagementColumns } from "./PendingContractsTableColumns";
import { createPendingContractsFacetedFilters } from "../_utils/credit-management.filter.utils";

interface CreditManagementTableProps {
    data: Array<ReservationWithPendingPaymentsDto>;
    pagination: CustomPaginationTableParams;
    onPaginationChange: ServerPaginationChangeEventCallback;
    search?: string;
    onSearchChange: (search: string) => void;
    status?: Array<string>;
    onStatusChange: (status: Array<string>) => void;
    paymentMethod?: Array<string>;
    onPaymentMethodChange: (paymentMethod: Array<string>) => void;
    contractValidationStatus?: Array<string>;
    onContractValidationStatusChange: (contractValidationStatus: Array<string>) => void;
}

export function CreditManagementTable({
    data,
    pagination,
    onPaginationChange,
    search,
    onSearchChange,
    status,
    onStatusChange,
    paymentMethod,
    onPaymentMethodChange,
    contractValidationStatus,
    onContractValidationStatusChange,
}: CreditManagementTableProps) {
    const columns = useMemo(() => creditManagementColumns(), []);

    // Crear filtros personalizados con callbacks del servidor
    const customFacetedFilters = useMemo(
        () => createPendingContractsFacetedFilters(
            onStatusChange,
            onPaymentMethodChange,
            onContractValidationStatusChange,
            status ?? [],
            paymentMethod ?? [],
            contractValidationStatus ?? []
        ),
        [onStatusChange, onPaymentMethodChange, onContractValidationStatusChange, status, paymentMethod, contractValidationStatus]
    );

    return (
        <DataTable
            data={data}
            columns={columns}
            toolbarActions={(table: TableInstance<ReservationDto>) => <ReservationsTableToolbarActions table={table} />}
            filterPlaceholder="Buscar separaciones con pagos pendientes..."
            facetedFilters={customFacetedFilters}
            externalFilterValue={search}
            onGlobalFilterChange={onSearchChange}
            serverPagination={{
                pageIndex: pagination.page - 1,
                pageSize: pagination.pageSize,
                pageCount: pagination.totalPages,
                total: pagination.total,
                onPaginationChange: async (pageIndex, pageSize) => {
                    onPaginationChange(pageIndex + 1, pageSize);
                },
            }}
        />
    );
}
