"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUpdateLead } from "../../_hooks/useLeads";
import { CreateLeadSchema, leadSchema } from "../../_schemas/createLeadsSchema";
import { Lead, LeadCaptureSource } from "../../_types/lead";
import UpdateLeadsForm from "./UpdateLeadsForm";

const infoSheet = {
  title: "Actualizar Lead",
  description: "Actualiza la información del lead y guarda los cambios",
};

interface UpdateLeadSheetProps extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateLeadSheet({ lead, open, onOpenChange }: UpdateLeadSheetProps) {
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<CreateLeadSchema>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      clientId: lead?.clientId ?? "",
      assignedToId: lead?.assignedToId ?? "",
      projectId: lead?.projectId ?? "",
      captureSource: lead?.captureSource as LeadCaptureSource,
    },
  });

  // Hook para actualizar lead
  const updateLead = useUpdateLead();

  useEffect(() => {
    if (open) {
      form.reset({
        clientId: lead?.clientId ?? "",
        assignedToId: lead?.assignedToId ?? "",
        projectId: lead?.projectId ?? "",
        captureSource: lead?.captureSource as LeadCaptureSource,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, lead]);

  const onSubmit = async (input: CreateLeadSchema) => {
    if (!lead?.id) {
      toast.error("No se encontró el ID del lead.");
      return;
    }

    const payload = {
      clientId: input.clientId,
      assignedToId: input.assignedToId,
      captureSource: input.captureSource,
      projectId: input.projectId,
    };

    const promise = updateLead.mutateAsync({
      params: {
        path: { id: lead.id },
      },
      body: payload,
    });

    toast.promise(promise, {
      loading: "Actualizando lead...",
      success: "Lead actualizada exitosamente",
      error: (e) => `Error al actualizar lead: ${e.message ?? e}`,
    });

    promise
      .then(() => {
        setIsSuccess(true);
      })
      .catch((error) => {
        if (error?.message?.includes("cliente")) {
          form.setError("clientId", {
            type: "manual",
            message: "Error con el cliente seleccionado",
          });
        }
        if (error?.message?.includes("asesor")) {
          form.setError("assignedToId", {
            type: "manual",
            message: "Error con el asesor seleccionado",
          });
        }
      });
  };

  useEffect(() => {
    if (isSuccess) {
      form.reset();
      onOpenChange(false);
      setIsSuccess(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md h-full overflow-hidden" tabIndex={undefined}>
        <SheetHeader className="text-left pb-0">
          <SheetTitle className="flex flex-col items-start">
            {infoSheet.title}
            <Badge className="bg-emerald-100 capitalize text-emerald-700" variant="secondary">
              {lead?.client?.dni ?? lead?.client?.ruc}
            </Badge>
          </SheetTitle>
          <SheetDescription>{infoSheet.description}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="w-full h-[calc(100vh-150px)] p-0">
          <UpdateLeadsForm form={form} onSubmit={onSubmit}>
            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
              <div className="flex flex-row-reverse gap-2">
                <Button type="submit" disabled={updateLead.isPending}>
                  {updateLead.isPending && <RefreshCcw className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                  Actualizar
                </Button>
                <SheetClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </UpdateLeadsForm>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
