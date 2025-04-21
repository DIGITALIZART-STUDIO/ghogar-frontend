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
