"use client";

import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { GetQuotationById } from "../../_actions/QuotationActions";
import { Quotation, SummaryQuotation } from "../../_types/quotation";
import QuotationViewContent from "./QuotationViewContent";

interface QuotationViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quotation: SummaryQuotation;
}

export function QuotationViewDialog({ open, onOpenChange, quotation }: QuotationViewDialogProps) {
    const isDesktop = useMediaQuery("(min-width: 900px)");
    const [data, setData] = useState<Quotation>();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchQuotationData() {
            if (open && quotation?.id) {
                setIsLoading(true);
                try {
                    const [quotationResult] = await GetQuotationById(quotation.id);
                    setData(quotationResult);
                } catch (error) {
                    console.error("Error fetching quotation:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        }

        fetchQuotationData();
    }, [open, quotation?.id]);

    // Calcular cuota mensual
    const calculateMonthlyPayment = () => {
        if (!data) {
            return 0;
        }
        return Math.round((data.amountFinanced ?? 0) / (data.monthsFinanced ?? 1));
    };

    // Calcular días restantes de validez
    const calculateDaysLeft = () => {
        if (!data) {
            return 0;
        }
        const validUntil = new Date(data.validUntil ?? new Date());
        const today = new Date();
        const diffTime = validUntil.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const daysLeft = calculateDaysLeft();

    // Renderizar diálogo o drawer según el tamaño de pantalla
    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[900px] px-0">
                    <DialogHeader className="px-4 flex flex-row items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        <div>
                            <DialogTitle className="flex items-center font-montserrat">
                                Detalles de Cotización
                            </DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground">
                                Detalles de la cotización seleccionada
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <ScrollArea className="h-full max-h-[70vh] px-0">
                        <div className="px-6">
                            <QuotationViewContent
                                data={data}
                                isLoading={isLoading}
                                calculateMonthlyPayment={calculateMonthlyPayment}
                                daysLeft={daysLeft}
                            />
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="h-[80vh]">
                <DrawerHeader className="border-b border-border flex flex-row items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    <div>
                        <DrawerTitle className="flex items-center font-montserrat">
                            Detalles de Cotización
                        </DrawerTitle>
                        <DrawerDescription className="text-sm text-muted-foreground">
                            Detalles de la cotización seleccionada
                        </DrawerDescription>
                    </div>
                </DrawerHeader>
                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full px-0">
                        <div className="p-4">
                            <QuotationViewContent
                                data={data}
                                isLoading={isLoading}
                                calculateMonthlyPayment={calculateMonthlyPayment}
                                daysLeft={daysLeft}
                            />
                        </div>
                    </ScrollArea>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
