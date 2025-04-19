"use client";

import type React from "react";
import { Building2, Home, IdCard, Mail, User } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { InputWithIcon } from "@/components/input-with-icon";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PhoneInput } from "@/components/ui/phone-input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateClientsSchema } from "../../_schemas/createClientsSchema";
import { ClientTypes } from "../../_types/client";
import { ClientTypesLabels } from "../../_utils/clients.utils";

interface CreateClientFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateClientsSchema>;
  onSubmit: (data: CreateClientsSchema) => void;
}

export default function CreateClientForm({ children, form, onSubmit }: CreateClientFormProps) {
    // Get the current client type to conditionally render fields
    const clientType = form.watch("type");

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Client Type Selection - Required */}
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel htmlFor="documentType">
                                    Tipo de Cliente
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecciona un tipo de cliente" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            {Object.values(ClientTypes).map((documentType) => {
                                                const documentTypeConfig = ClientTypesLabels[documentType];
                                                const Icon = documentTypeConfig.icon;

                                                return (
                                                    <SelectItem key={documentType} value={documentType} className="flex items-center gap-2">
                                                        <Icon className={`size-4 ${documentTypeConfig.className}`} />
                                                        <span>
                                                            {documentTypeConfig.label}
                                                        </span>
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Name - Required */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Nombre Completo
                                </FormLabel>
                                <FormControl>
                                    <InputWithIcon Icon={User} placeholder="Ejm: Juan Perez" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Co-Owner - Optional */}
                    <FormField
                        control={form.control}
                        name="coOwner"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Co-Propietario (Opcional)
                                </FormLabel>
                                <FormControl>
                                    <InputWithIcon Icon={User} placeholder="Ejm: María López" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Conditional fields based on client type */}
                    {clientType === ClientTypes.Natural ? (
                    // DNI - Required for Natural clients
                        <FormField
                            control={form.control}
                            name="dni"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        DNI
                                    </FormLabel>
                                    <FormControl>
                                        <InputWithIcon Icon={IdCard} placeholder="Ejm: 12345678" maxLength={8} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ) : clientType === ClientTypes.Juridico ? (
                        <>
                            {/* RUC - Required for Juridico clients */}
                            <FormField
                                control={form.control}
                                name="ruc"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            RUC
                                        </FormLabel>
                                        <FormControl>
                                            <InputWithIcon Icon={IdCard} placeholder="Ejm: 12345678901" maxLength={11} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Company Name - Required for Juridico clients */}
                            <FormField
                                control={form.control}
                                name="companyName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Nombre de la Empresa
                                        </FormLabel>
                                        <FormControl>
                                            <InputWithIcon Icon={Building2} placeholder="Ejm: Empresa S.A.C." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    ) : null}

                    {/* Phone Number - Required */}
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Teléfono
                                </FormLabel>
                                <FormControl>
                                    <PhoneInput
                                        defaultCountry={"PE"}
                                        placeholder="999 888 777"
                                        value={field.value}
                                        onChange={(value) => field.onChange(value)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email - Required */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Correo Electrónico
                                </FormLabel>
                                <FormControl>
                                    <InputWithIcon Icon={Mail} placeholder="usuario@ejemplo.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Address - Required */}
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>
                                    Dirección
                                </FormLabel>
                                <FormControl>
                                    <InputWithIcon Icon={Home} placeholder="Ejm: Jr. Los Pinos 123" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {children}
            </form>
        </Form>
    );
}
