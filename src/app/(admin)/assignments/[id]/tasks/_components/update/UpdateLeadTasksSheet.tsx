"use client";

import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";

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
import { toastWrapper } from "@/types/toasts";
import { UpdateTask } from "../../_actions/LeadTaskActions";
import { CreateLeadTasksSchema, leadTaskSchema } from "../../_schemas/createLeadTasksSchema";
import { LeadTaskDetail, TaskTypes } from "../../_types/leadTask";
import UpdateLeadsForm from "./UpdateLeadTasksForm";

const infoSheet = {
    title: "Actualizar Tarea",
    description: "Actualiza la tarea del lead",
};

interface UpdateLeadTasksSheetProps extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  task: LeadTaskDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateLeadTasksSheet({ task, open, onOpenChange }: UpdateLeadTasksSheetProps) {
    const [isPending, startTransition] = useTransition();
    const [isSuccess, setIsSuccess] = useState(false);

    console.log("task", JSON.stringify(task, null, 2));

    const form = useForm<CreateLeadTasksSchema>({
        resolver: zodResolver(leadTaskSchema),
        defaultValues: {
            type: (task?.type as TaskTypes) ?? undefined,
            description: task?.description ?? "",
            scheduledDate: task?.scheduledDate ?? "",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                type: (task?.type as TaskTypes) ?? undefined,
                description: task?.description ?? "",
                scheduledDate: task?.scheduledDate ?? "",
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, task]);

    const onSubmit = async(input: CreateLeadTasksSchema) => {
        startTransition(async() => {
            // Preparar los datos según el tipo de cliente
            const clientData = {
                type: input.type,
                description: input.description,
                scheduledDate: input.scheduledDate,
            };

            if (!task?.id) {
                throw new Error("Lead ID is required");
            }
            const [, error] = await toastWrapper(UpdateTask(task.id, clientData), {
                loading: "Actualizando tarea...",
                success: "Tarea actualizada exitosamente",
                error: (e) => `Error al actualizar tarea: ${e.message}`,
            });

            if (!error) {
                setIsSuccess(true);
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
                            {task?.lead?.client?.dni ?? task?.lead?.client?.ruc}
                        </Badge>
                    </SheetTitle>
                    <SheetDescription>
                        {infoSheet.description}
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="w-full h-[calc(100vh-150px)] p-0">
                    <UpdateLeadsForm form={form} onSubmit={onSubmit}>
                        <SheetFooter className="gap-2 pt-2 sm:space-x-0">
                            <div className="flex flex-row-reverse gap-2">
                                <Button type="submit" disabled={isPending}>
                                    {isPending && <RefreshCcw className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
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
