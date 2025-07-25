"use client";

import React from "react";
import ProfileForm from "./_components/ProfileForm";
import { useUsers } from "../admin/users/_hooks/useUser";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ErrorGeneral from "@/components/errors/general-error";
import { HeaderPage } from "@/components/common/HeaderPage";
import { Separator } from "@/components/ui/separator";

export default function ProfileFormPage() {
    const { data, error, isLoading } = useUsers();

    if (isLoading) {
        return <LoadingSpinner text="Cargando perfil..." />;
    }

    if (error) {
        return (
            <div>
                <HeaderPage title="Perfil de Usuario" description="Información y configuración de tu cuenta." />
                <ErrorGeneral />
            </div>
        );
    }

    if (!data) {
        return (
            <div>
                <HeaderPage title="Perfil de Usuario" description="Información y configuración de tu cuenta." />
                <ErrorGeneral />
            </div>
        );
    }

    return (
        <div>
            <HeaderPage title="Perfil de Usuario" description="Información y configuración de tu cuenta." />
            <Separator className="my-4" />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <ProfileForm data={data} />
            </div>
        </div>
    );
}
