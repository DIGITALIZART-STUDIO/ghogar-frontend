"use client";

import { useMemo, useState } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { DataTable } from "@/components/datatable/data-table";
import { ReservationsTableToolbarActions } from "./PendingContractsTableToolbarActions";
import { CustomPaginationTableParams, ServerPaginationChangeEventCallback } from "@/types/tanstack-table/CustomPagination";
import { ReservationPendingValidationDto } from "../../reservations/_types/reservation";
import { pendingContractsColumns } from "./PendingContractsTableColumns";
import { createPendingContractsFacetedFilters } from "../_utils/pending-contracts.filter.utils";
import { PaymentHistoryList } from "./PaymentHistoryList";

interface PendingContractsTableProps {
    data: Array<ReservationPendingValidationDto>;
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
    isLoading?: boolean;
}

export function PendingContractsTable({
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
    isLoading = false,
}: PendingContractsTableProps) {
    const [, setSelectedReservation] = useState<ReservationPendingValidationDto | null>(null);
    const [, setIsLateralOpen] = useState(false);

    const columns = useMemo(() => pendingContractsColumns(), []);

    // Crear filtros personalizados con callbacks del servidor
    const customFacetedFilters = useMemo(
        () => createPendingContractsFacetedFilters(
            onStatusChange,
            onPaymentMethodChange,
            onContractValidationStatusChange,
            status,
            paymentMethod,
            contractValidationStatus
        ),
        [onStatusChange, onPaymentMethodChange, onContractValidationStatusChange, status, paymentMethod, contractValidationStatus]
    );

    // Función para renderizar el contenido lateral
    const renderLateralContent = (reservation: ReservationPendingValidationDto) => {
        // Deserializar PaymentHistory si es string
        let paymentHistory = [];
        if (reservation.paymentHistory) {
            try {
                if (typeof reservation.paymentHistory === "string") {
                    paymentHistory = JSON.parse(reservation.paymentHistory);
                } else {
                    paymentHistory = reservation.paymentHistory;
                }
            } catch (error) {
                console.error("Error al deserializar PaymentHistory:", error);
                paymentHistory = [];
            }
        }

        return (
            <PaymentHistoryList
                paymentHistory={paymentHistory}
                reservationId={reservation.id ?? ""}
                currency={reservation.currency ?? "PEN"}
                reservationData={reservation}
            />
        );
    };

    // Manejar toggle del panel lateral
    const handleLateralToggle = (isOpen: boolean, row?: ReservationPendingValidationDto) => {
        setIsLateralOpen(isOpen);
        if (isOpen && row) {
            setSelectedReservation(row);
        } else {
            setSelectedReservation(null);
        }
    };

    return (
        <DataTable
            isLoading={isLoading}
            data={data}
            columns={columns}
            toolbarActions={(table: TableInstance<ReservationPendingValidationDto>) => (
                <ReservationsTableToolbarActions table={table} />
            )}
            filterPlaceholder="Buscar separaciones..."
            facetedFilters={customFacetedFilters}
            // Configuración para expansión lateral
            expansionMode="lateral"
            renderLateralContent={renderLateralContent}
            lateralPanelSize={45}
            onLateralToggle={handleLateralToggle}
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
