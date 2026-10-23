import { Suspense } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import { ContractsPageClient } from "./_components/ContractsPageClient";

export default function ContractsPage() {
  return (
    <Suspense
      fallback={
        <div>
          <HeaderPage title="Contratos" description="Cargando contratos..." />
          <DataTableSkeleton columns={7} numFilters={2} />
        </div>
      }
    >
      <ContractsPageClient />
    </Suspense>
  );
}
