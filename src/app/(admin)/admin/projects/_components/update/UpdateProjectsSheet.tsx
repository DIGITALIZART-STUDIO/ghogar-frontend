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
import { UpdateProject } from "../../_actions/ProjectActions";
import { CreateProjectSchema, projectSchema } from "../../_schemas/createProjectsSchema";
import { ProjectData } from "../../_types/project";
import UpdateProjectsForm from "./UpdateProjectsForm";

const infoSheet = {
    title: "Actualizar Proyecto",
    description: "Actualiza la información del proyecto y guarda los cambios",
};

interface UpdateProjectsSheetProps extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  project: ProjectData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateProjectsSheet({ project, open, onOpenChange }: UpdateProjectsSheetProps) {
    const [isPending, startTransition] = useTransition();
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<CreateProjectSchema>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: project.name ?? "",
            location: project.location ?? "",
            currency: project.currency ?? "",
            defaultDownPayment: project.defaultDownPayment ?? 0,
            defaultFinancingMonths: project.defaultFinancingMonths ?? 0,
            maxDiscountPercentage: project.maxDiscountPercentage ?? 0,
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                name: project.name ?? "",
                location: project.location ?? "",
                currency: project.currency ?? "",
                defaultDownPayment: project.defaultDownPayment ?? 0,
                defaultFinancingMonths: project.defaultFinancingMonths ?? 0,
                maxDiscountPercentage: project.maxDiscountPercentage ?? 0,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, project]);

    const onSubmit = async (input: CreateProjectSchema) => {
        startTransition(async () => {
            // Preparar los datos según el tipo de cliente
            const projectData = {
                name: input.name,
                location: input.location,

                currency: input.currency,
                defaultDownPayment: input.defaultDownPayment,
                defaultFinancingMonths: input.defaultFinancingMonths,
            };

            if (!project?.id) {
                throw new Error("Block ID is required");
            }
            const [, error] = await toastWrapper(UpdateProject(project.id, projectData), {
                loading: "Actualizando proyecto...",
                success: "Proyecto actualizado exitosamente",
                error: (e) => `Error al actualizar proyecto: ${e.message}`,
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
                            {project?.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                    </SheetTitle>
                    <SheetDescription>{infoSheet.description}</SheetDescription>
                </SheetHeader>
                <ScrollArea className="w-full h-[calc(100vh-150px)] p-0">
                    <UpdateProjectsForm form={form} onSubmit={onSubmit}>
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
                    </UpdateProjectsForm>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
