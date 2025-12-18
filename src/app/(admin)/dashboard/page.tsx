"use client";

import { useUsers } from "../admin/users/_hooks/useUser";
/* import SuperAdminDashboard from "./super-admin/SuperAdminDashboard"; */
import AdminDashboard from "./_components/admin/AdminDashboard";
import CommercialManagerDashboard from "./_components/commercial-manager/CommercialManagerDashboard";
import { DashboardGreeting } from "./_components/DashboardGreatings";
import FinanceManagerDashboard from "./_components/finance-manager/FinanceManagerDashboard";
import ManagerDashboard from "./_components/manager/ManagerDashboard";
import SalesAdvisorDashboard from "./_components/sales-advisor/SalesAdvisorDashboard";
import SupervisorDashboard from "./_components/supervisor/SupervisorDashboard";

export default function DashboardPage() {
    const { data, error, isLoading } = useUsers();

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Cargando usuario...</div>;
    }
    if (error || !data) {
        return <div className="p-8 text-center text-red-600 dark:text-red-400">Error al cargar usuario</div>;
    }

    const user = data;

    return (
        <div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <DashboardGreeting userName={user.user.name} role={user.roles[0]} />
                <div id="headerContent" className="mb-4 justify-items-end sm:mb-0" />
            </div>
            {user.roles[0] === "SuperAdmin" && <AdminDashboard />}
            {user.roles[0] === "Admin" && <AdminDashboard />}
            {user.roles[0] === "Supervisor" && <SupervisorDashboard />}
            {user.roles[0] === "SalesAdvisor" && <SalesAdvisorDashboard />}
            {user.roles[0] === "Manager" && <ManagerDashboard />}
            {user.roles[0] === "FinanceManager" && <FinanceManagerDashboard />}
            {user.roles[0] === "CommercialManager" && <CommercialManagerDashboard />}
        </div>
    );
}
