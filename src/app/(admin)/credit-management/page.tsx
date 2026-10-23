import { Suspense } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import { CreditManagementPageClient } from "./_components/CreditManagementPageClient";

export default function CreditManagementPage() {
  return (
    <Suspense
      fallback={
        <div>
          <HeaderPage title="Gestión de créditos" description="Cargando cartera..." />
          <DataTableSkeleton columns={8} numFilters={1} />
        </div>
      }
    >
      <CreditManagementPageClient />
    </Suspense>
  );
}
