"use client";

import { useEffect, useMemo, useState } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { DataTable } from "@/components/datatable/data-table";
import {
  CustomPaginationTableParams,
  ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";
import { createPendingContractsFacetedFilters } from "../../_utils/pending-contracts.filter.utils";
import { ReservationPendingValidationDto } from "../../../reservations/_types/reservation";
import { PaymentHistoryList } from "../payment/PaymentHistoryList";
import { pendingContractsColumns } from "./PendingContractsTableColumns";
import { ReservationsTableToolbarActions } from "./PendingContractsTableToolbarActions";

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
  const [selectedReservation, setSelectedReservation] = useState<ReservationPendingValidationDto | null>(null);
  const [isLateralOpen, setIsLateralOpen] = useState(false);

  // Actualizar selectedReservation cuando los datos cambien y el panel esté abierto
  useEffect(() => {
    if (selectedReservation && isLateralOpen) {
      const updatedReservation = data.find((r) => r.id === selectedReservation.id);
      if (updatedReservation) {
        setSelectedReservation(updatedReservation);
      }
    }
  }, [data, selectedReservation, isLateralOpen]);

  const columns = useMemo(() => pendingContractsColumns(), []);

  // Crear filtros personalizados con callbacks del servidor
  const customFacetedFilters = useMemo(
    () =>
      createPendingContractsFacetedFilters(
        onStatusChange,
        onPaymentMethodChange,
        onContractValidationStatusChange,
        status,
        paymentMethod,
        contractValidationStatus
      ),
    [
      onStatusChange,
      onPaymentMethodChange,
      onContractValidationStatusChange,
      status,
      paymentMethod,
      contractValidationStatus,
    ]
  );

  // Función para renderizar el contenido lateral
  const renderLateralContent = () => {
    if (!selectedReservation) {
      return null;
    }

    // Buscar la reserva actualizada en los datos actuales
    const currentReservation = data.find((r) => r.id === selectedReservation.id) ?? selectedReservation;

    // Deserializar PaymentHistory si es string
    let paymentHistory = [];
    if (currentReservation.paymentHistory) {
      try {
        if (typeof currentReservation.paymentHistory === "string") {
          paymentHistory = JSON.parse(currentReservation.paymentHistory);
        } else {
          paymentHistory = currentReservation.paymentHistory;
        }
      } catch (error) {
        console.error("Error al deserializar PaymentHistory:", error);
        paymentHistory = [];
      }
    }

    return (
      <PaymentHistoryList
        paymentHistory={paymentHistory}
        reservationId={currentReservation.id ?? ""}
        currency={currentReservation.currency ?? "PEN"}
        reservationData={currentReservation}
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
