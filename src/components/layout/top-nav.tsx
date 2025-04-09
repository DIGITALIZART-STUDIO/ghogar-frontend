"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
  links: {
    title: string;
    href: string;
    disabled?: boolean;
  }[];
}

export function TopNav({ className, links, ...props }: TopNavProps) {
  const pathname = usePathname();

  return (
    <>
      <div className="md:hidden">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <Menu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start">
            {links.map(({ title, href, disabled }) => {
              const isActive = pathname === href;
              return (
                <DropdownMenuItem key={`${title}-${href}`} asChild>
                  <Link
                    href={href}
                    className={cn(!isActive && "text-muted-foreground", disabled && "pointer-events-none opacity-50")}
                  >
                    {title}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav className={cn("hidden items-center space-x-4 md:flex lg:space-x-6", className)} {...props}>
        {links.map(({ title, href, disabled }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={`${title}-${href}`}
              href={href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                !isActive && "text-muted-foreground",
                disabled && "pointer-events-none opacity-50"
              )}
            >
              {title}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
