"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { useSearch } from "@/context/search-context";
import { sidebarData } from "../layout/data/sidebar-data";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "./command";
import { ScrollArea } from "./scroll-area";

export function CommandMenu() {
    const navigate = useRouter();
    const { setTheme } = useTheme();
    const { open, setOpen } = useSearch();

    const runCommand = React.useCallback(
        (command: () => unknown) => {
            setOpen(false);
            command();
        },
        [setOpen],
    );

    return (
        <CommandDialog modal open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Busca un módulo ..." />
            <CommandList>
                <ScrollArea type="hover" className="h-72 pr-1">
                    <CommandEmpty>
                        No se encontraron resultados.
                    </CommandEmpty>
                    {sidebarData.navGroups.map((group) => (
                        <CommandGroup key={group.title} heading={group.title}>
                            {group.items.map((navItem, i) => {
                                if (navItem.url) {
                                    return (
                                        <CommandItem
                                            key={`${navItem.url}-${i}`}
                                            value={navItem.title}
                                            onSelect={() => {
                                                runCommand(() => navigate.push(navItem.url as string));
                                            }}
                                        >
                                            <div className="mr-2 flex h-4 w-4 items-center justify-center">
                                                {navItem.icon && <navItem.icon className="size-2 text-muted-foreground/80" />}
                                            </div>
                                            {navItem.title}
                                        </CommandItem>
                                    );
                                }

                                return navItem.items?.map((subItem, i) => (
                                    <CommandItem
                                        key={`${subItem.url}-${i}`}
                                        value={subItem.title}
                                        onSelect={() => {
                                            runCommand(() => navigate.push(subItem.url as string));
                                        }}
                                    >
                                        <div className="mr-2 flex h-4 w-4 items-center justify-center">
                                            {subItem.icon && <subItem.icon className="size-2 text-muted-foreground/80" />}
                                        </div>
                                        {subItem.title}
                                    </CommandItem>
                                ));
                            })}
                        </CommandGroup>
                    ))}
                    <CommandSeparator />
                    <CommandGroup heading="Tema">
                        <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
                            <Sun />
                            {" "}
                            <span>
                                Claro
                            </span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
                            <Moon className="scale-90" />
                            <span>
                                Oscuro
                            </span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
                            <Laptop />
                            <span>
                                Sistema
                            </span>
                        </CommandItem>
                    </CommandGroup>
                </ScrollArea>
            </CommandList>
        </CommandDialog>
    );
}
