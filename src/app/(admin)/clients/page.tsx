import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { GetAllClients } from "./_actions/ClientActions";
import { ClientsTable } from "./_components/table/ClientsTable";

export default async function ClientsPage() {
  // Llamar directamente a la función de Server Actions
  const clientsResult = await GetAllClients();

  // Manejar el error si ocurre
  if (!clientsResult) {
    return (
      <div>
        <HeaderPage title="Clientes" description="Clientes registrados en el sistema." />
        <ErrorGeneral />
      </div>
    );
  }

  // Verificar la estructura de datos y acceder al array de clientes correctamente
  const clientsData = Array.isArray(clientsResult) && clientsResult[0] ? clientsResult[0] : [];

  return (
    <div>
      <HeaderPage title="Clientes" description="Clientes registrados en el sistema." />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <ClientsTable data={clientsData} />
      </div>
    </div>
  );
}
