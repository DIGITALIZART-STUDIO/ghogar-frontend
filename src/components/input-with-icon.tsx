"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
    Icon: LucideIcon;
    iconClassName?: string;
    wrapperClassName?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [k: string]: any;
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(({ className, Icon, iconClassName, wrapperClassName, ...props }, ref) => (
    <div className={cn("relative flex items-center", wrapperClassName)}>
        <div className={cn("absolute left-3 z-10 flex items-center pointer-events-none", iconClassName)}>
            <Icon className="h-4 w-4 shrink-0 opacity-50" />
        </div>
        <Input ref={ref} className={cn("pl-9", className)} {...props} />
    </div>
));

InputWithIcon.displayName = "InputWithIcon";

export { InputWithIcon };
