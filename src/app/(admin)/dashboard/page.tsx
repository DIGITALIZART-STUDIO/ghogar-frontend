"use client";

import { useState } from "react";
import { ContractDownloadDialog } from "./_testing/ContractDownloadDialog";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const [open, setOpen] = useState(false);
    return (
        <div>
            hello
            <Button
                onClick={() => setOpen(true)}
            >
                open
            </Button>
            <ContractDownloadDialog
                isOpen={open}
                onOpenChange={setOpen}
                ContractId={"5adb913f-1d4e-43cf-b645-2dead80150be"}
            />
        </div>
    );
}
