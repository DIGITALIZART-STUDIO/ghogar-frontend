import { components } from "@/types/api";
import { backend as api } from "@/types/backend2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateUser, DeactivateUser, GetPaginatedUsers, ReactivateUser, UpdateProfilePassword, UpdateUser, UpdateUserPassword } from "../actions";
import { useAuthContext } from "@/context/auth-provider";
import { toast } from "sonner";

export function useUsers() {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Users", undefined, {
        retry: false, // NO hacer retries automáticos
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para actualizar contraseña de perfil
export function useUpdateProfilePassword() {
    const { handleAuthError } = useAuthContext();

    return useMutation({
        mutationFn: async (dto: components["schemas"]["UpdateProfilePasswordDTO"]) => {
            const [value, error] = await UpdateProfilePassword(dto);
            if (error) {
                throw error;
            }
            return value;
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para paginación de usuarios
export function usePaginatedUsers(page: number = 1, pageSize: number = 10) {
    return useQuery({
        queryKey: ["paginatedUsers", page, pageSize],
        queryFn: async () => {
            const [data, error] = await GetPaginatedUsers(page, pageSize);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        retry: false,
    });
}

// Hook para crear usuario
export function useCreateUser() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return useMutation({
        mutationFn: async (user: components["schemas"]["UserCreateDTO"]) => {
            const [data, error] = await CreateUser(user);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedUsers"] });
            toast.success("Usuario creado exitosamente");
        },
        onError: async (error: unknown) => {
            const handled = await handleAuthError(error);
            if (!handled) {
                toast.error("Error al crear usuario");
            }
        },
    });
}

// Hook para actualizar usuario
export function useUpdateUser() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return useMutation({
        mutationFn: async ({
            userId,
            user,
        }: {
            userId: string;
            user: components["schemas"]["UserUpdateDTO"];
        }) => {
            const [value, error] = await UpdateUser(userId, user);
            if (error) {
                throw error;
            }
            return value;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedUsers"] });
            toast.success("Usuario actualizado exitosamente");
        },
        onError: async (error: unknown) => {
            const handled = await handleAuthError(error);
            if (!handled) {
                toast.error("Error al actualizar usuario");
            }
        },
    });
}

// Hook para actualizar solo la contraseña
export function useUpdateUserPassword() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return useMutation({
        mutationFn: async ({
            userId,
            passwordDto,
        }: {
            userId: string;
            passwordDto: components["schemas"]["UserUpdatePasswordDTO"];
        }) => {
            const [value, error] = await UpdateUserPassword(userId, passwordDto);
            if (error) {
                throw error;
            }
            return value;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedUsers"] });
            toast.success("Contraseña actualizada exitosamente");
        },
        onError: async (error: unknown) => {
            const handled = await handleAuthError(error);
            if (!handled) {
                toast.error("Error al actualizar contraseña");
            }
        },
    });
}

// Hook para desactivar usuario
export function useDeactivateUser() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return useMutation({
        mutationFn: async (userId: string) => {
            const [value, error] = await DeactivateUser(userId);
            if (error) {
                throw error;
            }
            return value;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedUsers"] });
            toast.success("Usuario desactivado exitosamente");
        },
        onError: async (error: unknown) => {
            const handled = await handleAuthError(error);
            if (!handled) {
                toast.error("Error al desactivar usuario");
            }
        },
    });
}

// Hook para reactivar usuario
export function useReactivateUser() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return useMutation({
        mutationFn: async (userId: string) => {
            const [value, error] = await ReactivateUser(userId);
            if (error) {
                throw error;
            }
            return value;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedUsers"] });
            toast.success("Usuario reactivado exitosamente");
        },
        onError: async (error: unknown) => {
            const handled = await handleAuthError(error);
            if (!handled) {
                toast.error("Error al reactivar usuario");
            }
        },
    });
}

