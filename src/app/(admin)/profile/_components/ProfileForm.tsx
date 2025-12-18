"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Edit3, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/auth-provider";
import { PasswordForm, passwordSchema, UserInfoForm, userInfoSchema } from "../_schemas/updateProfileSchema";
import { PasswordRequirement } from "../_types/password";
import { getInitials } from "../_utils/profile.utils";
import { useUpdateProfilePassword, useUpdateUser } from "../../admin/users/_hooks/useUser";
import { UserGetDTO } from "../../admin/users/_types/user";
import { UserRoleLabels } from "../../admin/users/_utils/user.utils";
import ProfileInformation from "./ProfileInformation";
import SecurityForm from "./SecurityForm";

interface ProfileFormProps {
  data: UserGetDTO;
}

export default function ProfileForm({ data }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const updateUser = useUpdateUser();
  const updateProfilePassword = useUpdateProfilePassword();
  const { handleLogout } = useAuthContext();

  // Asume que data tiene la estructura adecuada
  const userData = {
    name: data.user.name,
    userName: data.user.userName ?? "",
    phone: data.user.phoneNumber,
    email: data.user.email,
    role: data.roles?.[0] ?? "Usuario",
  };

  const mainRole = (userData.role ?? "Other") as keyof typeof UserRoleLabels;
  const roleConfig = UserRoleLabels[mainRole] ?? UserRoleLabels.Other;

  // Formulario de información personal
  const userForm = useForm<UserInfoForm>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      name: userData.name,
      phone: userData.phone ?? "",
    },
  });

  // Formulario de contraseña
  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current: "",
      new: "",
      confirm: "",
    },
  });

  // Watch para validación en tiempo real
  const newPassword = passwordForm.watch("new");
  const confirmPassword = passwordForm.watch("confirm");

  const [passwordRequirements, setPasswordRequirements] = useState<Array<PasswordRequirement>>([
    { id: "length", text: "Mínimo 8 caracteres", regex: /.{8,}/, met: false },
    { id: "uppercase", text: "Al menos una letra mayúscula (A-Z)", regex: /[A-Z]/, met: false },
    { id: "lowercase", text: "Al menos una letra minúscula (a-z)", regex: /[a-z]/, met: false },
    { id: "number", text: "Al menos un número (0-9)", regex: /\d/, met: false },
    {
      id: "special",
      text: 'Al menos un carácter especial (!@#$%^&*()_,.?":{}|<>)',
      regex: /[!@#$%^&*()_,.?":{}|<>]/,
      met: false,
    },
  ]);

  const [passwordsMatch, setPasswordsMatch] = useState(false);

  useEffect(() => {
    const updatedRequirements = passwordRequirements.map((req) => ({
      ...req,
      met: req.regex.test(newPassword ?? ""),
    }));
    setPasswordRequirements(updatedRequirements);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newPassword]);

  useEffect(() => {
    setPasswordsMatch(newPassword !== "" && newPassword === confirmPassword);
  }, [newPassword, confirmPassword]);

  const onUserInfoSubmit = async (formData: UserInfoForm) => {
    const promise = updateUser.mutateAsync({
      params: {
        path: { userId: data.user.id ?? "" },
      },
      body: {
        name: formData.name,
        email: userData.email ?? "",
        phone: formData.phone,
        role: userData.role,
      },
    });

    toast.promise(promise, {
      loading: "Actualizando perfil...",
      success: "Perfil actualizado correctamente.",
      error: (e) => `Error actualizando perfil: ${e.message ?? e}`,
    });

    promise.then(() => {
      setIsEditing(false);
    });
  };

  const onPasswordSubmit = async (formData: PasswordForm) => {
    const promise = updateProfilePassword.mutateAsync({
      body: {
        currentPassword: formData.current,
        newPassword: formData.new,
        confirmPassword: formData.confirm,
      },
    });

    toast.promise(promise, {
      loading: "Actualizando contraseña...",
      success: "Contraseña actualizada correctamente.",
      error: (e) => `Error actualizando contraseña: ${e.message ?? e}`,
    });

    promise.then(() => {
      passwordForm.reset();
      handleLogout();
    });
  };
  return (
    <div>
      <div className="space-y-6">
        {/* Header Profesional */}
        <div className="rounded-lg border bg-card border-gray-200 overflow-hidden">
          <div className="bg-card px-8 py-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="relative">
                <Avatar className="w-18 h-18 border-2 border-gray-200 bg-white dark:bg-gray-900">
                  <AvatarFallback className="text-xl font-semibold text-gray-700 dark:text-white bg-gray-50 dark:bg-gray-900">
                    {getInitials(userData.name, userData.userName)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="text-center lg:text-left flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {userData.name && userData.name.trim() !== "" ? userData.name : userData.userName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-3">{roleConfig.label}</p>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verificado
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                    <Shield className="w-3 h-3 mr-1" />
                    Acceso Total
                  </Badge>
                </div>
              </div>

              <Button onClick={() => setIsEditing(!isEditing)} variant="outline" size="lg">
                <Edit3 className="w-4 h-4 mr-2" />
                {isEditing ? "Cancelar Edición" : "Editar Perfil"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Información Personal */}
          <ProfileInformation
            userData={userData}
            roleConfig={roleConfig}
            isEditing={isEditing}
            userForm={userForm}
            onUserInfoSubmit={onUserInfoSubmit}
          />

          {/* Panel de Seguridad */}
          <SecurityForm
            passwordForm={passwordForm}
            onPasswordSubmit={onPasswordSubmit}
            passwordRequirements={passwordRequirements}
            passwordsMatch={passwordsMatch}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            data={data}
          />
        </div>
      </div>
    </div>
  );
}
