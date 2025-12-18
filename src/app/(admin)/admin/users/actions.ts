"use server";

import { components } from "@/types/api";
import { PaginatedResponse } from "@/types/api/paginated-response";
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

export async function UpdateProfilePassword(
    dto: components["schemas"]["UpdateProfilePasswordDTO"],
): Promise<Result<{ message: string }, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.PUT("/api/Users/profile/password", {
        ...auth,
        body: dto,
    })
    );

    if (error) {
        console.error("Error updating profile password:", error);
        return err(error);
    }

    if (!response || typeof response !== "object" || !("message" in response)) {
        return err({
            statusCode: 500,
            message: "Respuesta inesperada del servidor",
            error: response,
        });
    }

    return ok(response as { message: string });
}

// Obtener usuarios paginados
export async function GetPaginatedUsers(
    page: number = 1,
    pageSize: number = 10
): Promise<Result<PaginatedResponse<components["schemas"]["UserGetDTO"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Users/all", {
        ...auth,
        params: {
            query: {
                page,
                pageSize,
            },
        },
    }));

    if (error) {
        console.log("Error getting paginated users:", error);
        return err(error);
    }

    // Normaliza la respuesta para que nunca sea undefined
    return ok({
        data: response?.data ?? [],
        meta: response?.meta ?? {
            page,
            pageSize,
            totalCount: 0,
            totalPages: 0,
        },
    });
}
