"use client";

import * as React from "react";
import Link from "next/link";

import LogoGestionHogarMobile from "@/assets/icons/LogoGestionHogarMobile";
import { useSidebar } from "../ui/sidebar";
import LogoGestionHogar from "@/assets/icons/LogoGestionHogar";

export function NavLogo() {
    const { state } = useSidebar();

    return (
        <Link href="/" className="flex items-center justify-center p-2 hover:opacity-80 transition-opacity">
            {state === "collapsed" ? <LogoGestionHogarMobile /> : <LogoGestionHogar className="h-11" />}
        </Link>
    );
}
