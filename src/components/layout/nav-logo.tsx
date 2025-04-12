"use client";

import * as React from "react";
import Link from "next/link";
import { Hash } from "lucide-react";

import { useSidebar } from "../ui/sidebar";

export function NavLogo() {
    const { state } = useSidebar();

    return (
        <Link href="/" className="flex items-center justify-center p-2 hover:opacity-80 transition-opacity">
            {state === "collapsed" ? <Hash className="size-5 text-primary" /> : <Hash className="size-5 text-primary" />}
        </Link>
    );
}
