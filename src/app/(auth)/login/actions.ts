"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/variables";

export async function LogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_KEY);
  cookieStore.delete(REFRESH_TOKEN_KEY);
  redirect("/login");
}

// Función para logout desde el cliente
export async function ClientLogoutAction() {
  "use client";

  const { handleLogout } = await import("@/context/auth-provider").then((m) => m.useAuthContext());
  await handleLogout();
}
