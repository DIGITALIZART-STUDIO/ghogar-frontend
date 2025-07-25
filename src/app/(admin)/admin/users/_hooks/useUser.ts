import { components } from "@/types/api";
import { backend as api } from "@/types/backend2";
import { useMutation } from "@tanstack/react-query";
import { UpdateProfilePassword, UpdateUser } from "../actions";

export function useUsers() {
    return api.useQuery("get", "/api/Users", undefined, {
        retry: false,
    });
}

// Hook para actualizar usuario
export function useUpdateUser() {
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
    });
}

// Hook para actualizar contraseña de perfil
export function useUpdateProfilePassword() {
    return useMutation({
        mutationFn: async (dto: components["schemas"]["UpdateProfilePasswordDTO"]) => {
            const [value, error] = await UpdateProfilePassword(dto);
            if (error) {
                throw error;
            }
            return value;
        },
    });
}
