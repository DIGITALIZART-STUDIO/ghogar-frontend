"use client";

import { BarChart3, Calendar, DollarSign, Receipt, TrendingUp } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

import { FilterYear } from "@/components/ui/filter-year";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useSelectedProject } from "@/hooks/use-selected-project";
import { useDashboardFinanceManager } from "../../_hooks/useDashboard";
import AccountsReceivableTabsContent from "./accounts-receivable/AccountsReceivableTabsContent";
import IncomeProjectionTabsContent from "./income-projection/IncomeProjectionTabsContent";
import IncomeTabsContent from "./income/IncomeTabsContent";
import OverviewTabsContent from "./overview/OverviewTabsContent";
import PaymentScheduleTabsContent from "./payment-schedule/PaymentScheduleTabsContent";

export default function FinanceManagerDashboard() {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [activeTab, setActiveTab] = useState("overview");
    const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

    // Obtener el proyecto seleccionado del contexto global
    const { selectedProject, isAllProjectsSelected } = useSelectedProject();

    // Determinar el projectId a enviar: si es "Todos los proyectos" no se envía nada
    const projectIdToSend = isAllProjectsSelected ? null : selectedProject?.id;

    const { data, isLoading } = useDashboardFinanceManager(selectedYear, projectIdToSend);

    // Buscar el elemento headerContent cuando el componente se monta
    useEffect(() => {
        const findElement = () => {
            const element = document.getElementById("headerContent");
            if (element) {
                setPortalElement(element);
            }
        };

        // Buscar inmediatamente
        findElement();

        // Si no existe, usar MutationObserver para detectar cuando se crea
        if (!portalElement) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === "childList") {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                const foundElement = (node as Element).querySelector("#headerContent");
                                if (foundElement) {
                                    setPortalElement(foundElement as HTMLElement);
                                    observer.disconnect();
                                }
                            }
                        });
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            return () => observer.disconnect();
        }
    }, [portalElement]);

    return (
        <div>
            {portalElement &&
            createPortal(
                <FilterYear selectedYear={selectedYear} onSelectYear={setSelectedYear} />,
                portalElement
            )}
            <div className="space-y-6">

                {/* Pestañas principales */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

                    <div>
                        <TabsList className="h-auto p-1 border border-card grid w-full grid-cols-5 ">
                            <TabsTrigger
                                value="overview"
                                className={cn(
                                    "relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2"
                                )}
                            >
                                <TrendingUp className="w-4 h-4 shrink-0" />
                                <span className="truncate text-ellipsis">Resumen</span>
                            </TabsTrigger>

                            <TabsTrigger
                                value="income"
                                className={cn(
                                    "relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 "
                                )}
                            >
                                <DollarSign className="w-4 h-4 shrink-0" />
                                <span className="truncate text-ellipsis">Ingresos</span>
                            </TabsTrigger>

                            <TabsTrigger
                                value="accounts-receivable"
                                className={cn(
                                    "relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2"
                                )}
                            >
                                <Receipt className="w-4 h-4 shrink-0" />
                                <span className="truncate text-ellipsis"> Cuentas por Cobrar</span>
                            </TabsTrigger>

                            <TabsTrigger
                                value="payment-schedule"
                                className={cn(
                                    "relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2"
                                )}
                            >
                                <Calendar className="w-4 h-4 shrink-0" />
                                <span className="truncate text-ellipsis">Cronograma Pagos</span>
                            </TabsTrigger>

                            <TabsTrigger
                                value="income-projection"
                                className={cn(
                                    "relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2"
                                )}
                            >
                                <BarChart3 className="w-4 h-4 shrink-0" />
                                <span className="truncate text-ellipsis">Proyecciones</span>
                            </TabsTrigger>

                        </TabsList>
                    </div>

                    <OverviewTabsContent data={data} isLoading={isLoading} />
                    <IncomeTabsContent data={data} isLoading={isLoading} />
                    <AccountsReceivableTabsContent data={data} isLoading={isLoading} />
                    <PaymentScheduleTabsContent data={data} isLoading={isLoading} />
                    <IncomeProjectionTabsContent data={data} isLoading={isLoading} />
                </Tabs>
            </div>
        </div>
    );
}
