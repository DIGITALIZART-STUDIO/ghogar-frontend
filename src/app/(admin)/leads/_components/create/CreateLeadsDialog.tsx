"use client";

import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Plus, RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useLeadCreateDefaults } from "../../_hooks/useLeadCreateDefaults";
import { useCreateLead, useCreateLeadFromPhone } from "../../_hooks/useLeads";
import { CreateLeadFromPhoneSchema, leadFromPhoneSchema } from "../../_schemas/createLeadFromPhoneSchema";
import { CreateLeadSchema, leadSchema } from "../../_schemas/createLeadsSchema";
import { LeadStatus } from "../../_types/lead";
import CreateLeadFromPhoneForm from "./CreateLeadFromPhoneForm";
import CreateLeadsForm from "./CreateLeadsForm";

type CreateLeadMode = "client" | "phone";

const formConfig: Record<CreateLeadMode, { title: string; description: string }> = {
  client: {
    title: "Crear lead con cliente",
    description: "Complete los detalles a continuación para crear un nuevo lead con un cliente existente.",
  },
  phone: {
    title: "Crear lead con celular",
    description:
      "Ingrese el número de celular para crear un lead. Si el cliente no existe, se registrará automáticamente.",
  },
};

export function CreateLeadsDialog() {
  const isDesktop = useMediaQuery("(min-width: 810px)");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<CreateLeadMode>("client");
  const [isSuccess, setIsSuccess] = useState(false);

  const { currentUserId, isSalesAdvisor, isLoadingUser, validateAssignment } = useLeadCreateDefaults();

  const clientForm = useForm<CreateLeadSchema>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      clientId: "",
      assignedToId: "",
      projectId: "",
      captureSource: undefined,
    },
  });

  const phoneForm = useForm<CreateLeadFromPhoneSchema>({
    resolver: zodResolver(leadFromPhoneSchema),
    defaultValues: {
      phoneNumber: "",
      assignedToId: "",
      projectId: "",
      captureSource: undefined,
    },
  });

  const createLead = useCreateLead();
  const createLeadFromPhone = useCreateLeadFromPhone();

  const isPending = createLead.isPending || createLeadFromPhone.isPending;
  const { title, description } = formConfig[mode];

  const resetFormDefaults = useCallback(
    (formMode: CreateLeadMode) => {
      const defaults = {
        assignedToId: currentUserId,
        projectId: "",
        captureSource: undefined as undefined,
      };

      if (formMode === "client") {
        clientForm.reset({
          ...defaults,
          clientId: "",
        });
      } else {
        phoneForm.reset({
          ...defaults,
          phoneNumber: "",
        });
      }
    },
    [clientForm, phoneForm, currentUserId]
  );

  const handleOpen = (newMode: CreateLeadMode) => {
    setMode(newMode);
    resetFormDefaults(newMode);
    setOpen(true);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      clientForm.reset();
      phoneForm.reset();
    }
  };

  const handleClose = () => {
    if (mode === "client") {
      clientForm.reset();
    } else {
      phoneForm.reset();
    }
  };

  const onSubmitClient = async (input: CreateLeadSchema) => {
    const assignmentError = validateAssignment(input.assignedToId);
    if (assignmentError) {
      clientForm.setError("assignedToId", { type: "manual", message: assignmentError });
      return;
    }

    const payload = {
      clientId: input.clientId || undefined,
      assignedToId: input.assignedToId || undefined,
      captureSource: input.captureSource,
      projectId: input.projectId || undefined,
      status: LeadStatus.Registered,
    };

    const promise = createLead.mutateAsync({ body: payload });

    toast.promise(promise, {
      loading: "Creando lead...",
      success: "Lead creada exitosamente",
      error: (e) => `Error al crear lead: ${e.message ?? e}`,
    });

    promise
      .then(() => {
        setIsSuccess(true);
      })
      .catch((error) => {
        if (error?.message?.includes("cliente")) {
          clientForm.setError("clientId", {
            type: "manual",
            message: "Error con el cliente seleccionado",
          });
        }
        if (error?.message?.includes("asesor")) {
          clientForm.setError("assignedToId", {
            type: "manual",
            message: "Error con el asesor seleccionado",
          });
        }
      });
  };

  const onSubmitPhone = async (input: CreateLeadFromPhoneSchema) => {
    const assignmentError = validateAssignment(input.assignedToId);
    if (assignmentError) {
      phoneForm.setError("assignedToId", { type: "manual", message: assignmentError });
      return;
    }

    const promise = createLeadFromPhone.mutateAsync({
      body: {
        phoneNumber: input.phoneNumber,
        captureSource: input.captureSource,
        assignedToId: input.assignedToId || undefined,
        projectId: input.projectId || undefined,
      },
    });

    toast.promise(promise, {
      loading: "Creando lead...",
      success: "Lead creada exitosamente",
      error: (e) => `Error al crear lead: ${e.message ?? e}`,
    });

    promise
      .then(() => {
        setIsSuccess(true);
      })
      .catch((error) => {
        if (error?.message?.includes("teléfono") || error?.message?.includes("telefono")) {
          phoneForm.setError("phoneNumber", {
            type: "manual",
            message: "Error con el número de teléfono ingresado",
          });
        }
        if (error?.message?.includes("asesor")) {
          phoneForm.setError("assignedToId", {
            type: "manual",
            message: "Error con el asesor seleccionado",
          });
        }
      });
  };

  useEffect(() => {
    if (isSuccess) {
      clientForm.reset();
      phoneForm.reset();
      setOpen(false);
      setIsSuccess(false);
    }
  }, [isSuccess, clientForm, phoneForm]);

  useEffect(() => {
    if (open && currentUserId) {
      if (mode === "client") {
        clientForm.setValue("assignedToId", currentUserId);
      } else {
        phoneForm.setValue("assignedToId", currentUserId);
      }
    }
  }, [open, currentUserId, mode, clientForm, phoneForm]);

  const triggerButton = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isLoadingUser}>
          <Plus className="mr-2 size-4" aria-hidden="true" />
          Crear lead
          <ChevronDown className="ml-2 size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => handleOpen("client")}>Crear lead con cliente</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleOpen("phone")}>Crear lead con celular</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const dialogFooter = (
    <DialogFooter>
      <div className="grid grid-cols-2 gap-2 w-full">
        <DialogClose asChild>
          <Button onClick={handleClose} type="button" variant="outline" className="w-full">
            Cancelar
          </Button>
        </DialogClose>
        <Button disabled={isPending} className="w-full" type="submit">
          {isPending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
          Registrar
        </Button>
      </div>
    </DialogFooter>
  );

  const drawerFooter = (
    <DrawerFooter className="px-0 pt-2 flex flex-col-reverse">
      <Button disabled={isPending} className="w-full" type="submit">
        {isPending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
        Registrar
      </Button>
      <DrawerClose asChild>
        <Button variant="outline" className="w-full" onClick={handleClose} type="button">
          Cancelar
        </Button>
      </DrawerClose>
    </DrawerFooter>
  );

  if (isDesktop) {
    return (
      <>
        {triggerButton}
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogContent tabIndex={undefined} className="px-0">
            <DialogHeader className="px-4">
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-full max-h-[80vh] px-0" disableOverflow>
              <div className="px-6">
                {mode === "client" ? (
                  <CreateLeadsForm
                    form={clientForm}
                    onSubmit={onSubmitClient}
                    isSalesAdvisor={isSalesAdvisor}
                    currentUserId={currentUserId}
                  >
                    {dialogFooter}
                  </CreateLeadsForm>
                ) : (
                  <CreateLeadFromPhoneForm
                    form={phoneForm}
                    onSubmit={onSubmitPhone}
                    isSalesAdvisor={isSalesAdvisor}
                    currentUserId={currentUserId}
                  >
                    {dialogFooter}
                  </CreateLeadFromPhoneForm>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      {triggerButton}
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerContent>
          <DrawerHeader className="pb-2">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-[40vh] px-0">
              <div className="px-4">
                {mode === "client" ? (
                  <CreateLeadsForm
                    form={clientForm}
                    onSubmit={onSubmitClient}
                    isSalesAdvisor={isSalesAdvisor}
                    currentUserId={currentUserId}
                  >
                    {drawerFooter}
                  </CreateLeadsForm>
                ) : (
                  <CreateLeadFromPhoneForm
                    form={phoneForm}
                    onSubmit={onSubmitPhone}
                    isSalesAdvisor={isSalesAdvisor}
                    currentUserId={currentUserId}
                  >
                    {drawerFooter}
                  </CreateLeadFromPhoneForm>
                )}
              </div>
            </ScrollArea>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
