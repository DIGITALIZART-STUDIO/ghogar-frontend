import { Suspense } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import { PaymentsTransactionPageClient } from "./_components/PaymentsTransactionPageClient";

export default function PaymentsTransactionPage() {
  return (
    <Suspense
      fallback={
        <div>
          <HeaderPage title="Gestión de Pagos" description="Cargando contratos..." />
          <DataTableSkeleton columns={7} numFilters={1} />
        </div>
      }
    >
      <PaymentsTransactionPageClient />
    </Suspense>
  );
}
