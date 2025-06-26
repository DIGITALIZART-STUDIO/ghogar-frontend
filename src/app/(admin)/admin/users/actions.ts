"use server";

import { components } from "@/types/api";
import { backend, FetchError, wrapper } from "@/types/backend";
import { ok, err, Result } from "@/utils/result";
import { revalidatePath } from "next/cache";

type UserCreateDTO = components["schemas"]["UserCreateDTO"]

export async function CreateUser(body: UserCreateDTO): Promise<Result<null, FetchError>> {
    const [, error] = await wrapper((auth) => backend.POST("/api/Users", {
        ...auth,
        body,
    }));

    if (error) {
        console.error("Error creating user:", error);
        return err(error);
    }

    revalidatePath("/(admin)/admin/users");
    return ok(null);
}

// Actualizar datos de usuario
export async function UpdateUser(
    userId: string,
    user: components["schemas"]["UserUpdateDTO"],
): Promise<Result<components["schemas"]["UserGetDTO"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.PUT("/api/Users/{userId}", {
        ...auth,
        params: { path: { userId } },
        body: user,
    }),
    );

    revalidatePath("/(admin)/users", "page");

    if (error) {
        console.log(`Error updating user ${userId}:`, error);
        return err(error);
    }
    return ok(response!);
}

// Actualizar solo la contraseña
export async function UpdateUserPassword(
    userId: string,
    passwordDto: components["schemas"]["UserUpdatePasswordDTO"],
): Promise<Result<void, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.PUT("/api/Users/{userId}/password", {
        ...auth,
        params: { path: { userId } },
        body: passwordDto,
    }),
    );

    revalidatePath("/(admin)/users", "page");

    if (error) {
        console.log(`Error updating password for user ${userId}:`, error);
        return err(error);
    }
    return ok(response);
}

// Desactivar usuario
export async function DeactivateUser(
    userId: string,
): Promise<Result<void, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.DELETE("/api/Users/{userId}", {
        ...auth,
        params: { path: { userId } },
    }),
    );

    revalidatePath("/(admin)/users", "page");

    if (error) {
        console.log(`Error deactivating user ${userId}:`, error);
        return err(error);
    }
    return ok(response);
}

// Activar usuario
export async function ReactivateUser(
    userId: string,
): Promise<Result<void, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.PATCH("/api/Users/{userId}/reactivate", {
        ...auth,
        params: { path: { userId } },
    }),
    );

    revalidatePath("/(admin)/users", "page");

    if (error) {
        console.log(`Error reactivating user ${userId}:`, error);
        return err(error);
    }
    return ok(response);
}
