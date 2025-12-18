import { useState } from "react";
import { AlertTriangle, Check, Copy, Eye, EyeOff, RefreshCw } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { UserCreateDTO } from "../../_schemas/createUsersSchema";
import { calculatePasswordStrength, UserRoleLabels } from "../../_utils/user.utils";

interface UserCreateFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<UserCreateDTO>;
  onSubmit: (data: UserCreateDTO) => void;
  isGenerating: boolean;
  passwordCopied: boolean;
  handleGeneratePassword: () => void;
  handleCopyPassword: (password: string) => void;
}

export default function UserCreateForm({
  form,
  onSubmit,
  isGenerating,
  passwordCopied,
  handleGeneratePassword,
  handleCopyPassword,
  children,
}: UserCreateFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const watchedPassword = form.watch("password");
  const passwordStrength = calculatePasswordStrength(watchedPassword || "");
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Nombre completo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese el nombre completo"
                    {...field}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormDescription>Nombre completo del nuevo usuario</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Correo electrónico</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese el correo electrónico"
                    type="email"
                    {...field}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormDescription>Dirección de correo electrónico única</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Número de teléfono</FormLabel>
                <FormControl>
                  <PhoneInput
                    defaultCountry={"PE"}
                    placeholder="Ingrese el número de teléfono"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                  />
                </FormControl>
                <FormDescription>Número de contacto del usuario</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Rol de usuario</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="Seleccione el rol del usuario" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(UserRoleLabels)
                      .filter(([role]) => role !== "Other")
                      .map(([role, { label, icon: Icon, className }]) => (
                        <SelectItem key={role} value={role}>
                          <span className={"flex items-center gap-2"}>
                            <Icon className={`w-4 h-4 ${className}`} />
                            {label}
                          </span>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormDescription>Nivel de acceso y permisos del usuario</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Configuración de contraseña</h3>
              <p className="text-sm text-muted-foreground">Genere una contraseña segura o ingrese una personalizada</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGeneratePassword}
              disabled={isGenerating}
              className="gap-2"
            >
              <RefreshCw className={`size-4 ${isGenerating ? "animate-spin" : ""}`} />
              {isGenerating ? "Generando..." : "Generar"}
            </Button>
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Contraseña</FormLabel>
                <div className="space-y-3">
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Ingrese o genere una contraseña"
                        {...field}
                        className="pr-20 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </FormControl>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {field.value && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyPassword(field.value)}
                          className="h-8 w-8 p-0"
                        >
                          {passwordCopied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPassword(!showPassword)}
                        className="h-8 w-8 p-0"
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </Button>
                    </div>
                  </div>

                  {field.value && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Fortaleza de la contraseña:</span>
                        <Badge variant="outline" className={`${passwordStrength.color} text-white border-transparent`}>
                          {passwordStrength.label}
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.score / 7) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <FormDescription className="flex items-start gap-2">
                  <AlertTriangle className="size-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>
                    La contraseña debe tener al menos 8 caracteres e incluir mayúsculas, minúsculas, números y símbolos
                    especiales.
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {children}
      </form>
    </Form>
  );
}
