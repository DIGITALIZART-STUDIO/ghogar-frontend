"use client";

import { Clock, Filter, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SkeletonManageLeadTasks() {
    return (
        <div>
            <div className="flex flex-col space-y-4">
                {/* Header con título y botón */}
                <div className="flex items-center justify-end">
                    <Button disabled className="opacity-70">
                        <Plus className="mr-2 h-4 w-4" />
                        {" "}
                        Nueva Tarea
                    </Button>
                </div>

                <Tabs defaultValue="kanban">
                    {/* Tabs y filtros */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <TabsList>
                            <TabsTrigger value="kanban" disabled className="opacity-70">
                                Kanban
                            </TabsTrigger>
                            <TabsTrigger value="timeline" disabled className="opacity-70">
                                Línea de Tiempo
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex flex-wrap items-center gap-2">
                            {/* Skeleton para filtros */}
                            <div className="h-10 w-[130px] bg-muted rounded-md animate-pulse flex items-center px-3">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground/50" />
                                <div className="h-4 w-16 bg-muted-foreground/20 rounded animate-pulse" />
                            </div>

                            <Button variant="outline" size="sm" disabled className="opacity-70">
                                <Filter className="mr-2 h-4 w-4" />
                                {" "}
                                Más filtros
                            </Button>
                        </div>
                    </div>

                    <TabsContent value="kanban" className="mt-0">
                        {/* Grid de columnas skeleton */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Columna Pendientes */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg flex justify-between items-center">
                                        <span>
                                            Pendientes
                                        </span>
                                        <span className="text-sm font-normal bg-muted rounded-full px-2 py-0.5 animate-pulse">
                                            ...
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="min-h-[200px] rounded-md p-2 border border-muted-foreground/20">
                                        {/* Tarjetas skeleton */}
                                        {Array(3)
                                            .fill(0)
                                            .map((_, index) => (
                                                <div key={`pending-${index}`} className="mb-3">
                                                    <Card className="overflow-hidden">
                                                        <CardContent className="p-0">
                                                            <div className="p-4">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="h-4 w-4 bg-muted-foreground/20 rounded animate-pulse" />
                                                                        <div className="h-6 w-24 bg-blue-100 rounded-full animate-pulse" />
                                                                    </div>
                                                                    <div className="h-8 w-8 bg-muted rounded-md animate-pulse" />
                                                                </div>

                                                                <div className="mb-3 space-y-2">
                                                                    <div className="h-4 bg-muted rounded animate-pulse w-full" />
                                                                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                                                                    <div className="h-4 bg-muted-foreground/20 rounded animate-pulse w-1/3" />
                                                                </div>

                                                                <Separator className="my-3" />

                                                                <div className="flex justify-between items-center">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="h-4 w-4 bg-muted-foreground/20 rounded-full animate-pulse" />
                                                                        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                                                                    </div>
                                                                    <div className="h-5 w-20 bg-muted rounded-full animate-pulse" />
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Columna Completadas */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg flex justify-between items-center">
                                        <span>
                                            Completadas
                                        </span>
                                        <span className="text-sm font-normal bg-muted rounded-full px-2 py-0.5 animate-pulse">
                                            ...
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="min-h-[200px] rounded-md p-2 border border-muted-foreground/20">
                                        {/* Tarjetas skeleton */}
                                        {Array(2)
                                            .fill(0)
                                            .map((_, index) => (
                                                <div key={`completed-${index}`} className="mb-3">
                                                    <Card className="overflow-hidden opacity-80">
                                                        <CardContent className="p-0">
                                                            <div className="p-4">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="h-4 w-4 bg-muted-foreground/20 rounded animate-pulse" />
                                                                        <div className="h-6 w-24 bg-green-100 rounded-full animate-pulse" />
                                                                    </div>
                                                                    <div className="h-8 w-8 bg-muted rounded-md animate-pulse" />
                                                                </div>

                                                                <div className="mb-3 space-y-2">
                                                                    <div className="h-4 bg-muted rounded animate-pulse w-full" />
                                                                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                                                                    <div className="h-4 bg-muted-foreground/20 rounded animate-pulse w-1/3" />
                                                                </div>

                                                                <Separator className="my-3" />

                                                                <div className="flex justify-between items-center">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="h-4 w-4 bg-muted-foreground/20 rounded-full animate-pulse" />
                                                                        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                                                                    </div>
                                                                    <div className="h-5 w-20 bg-muted rounded-full animate-pulse" />
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="timeline" className="mt-0">
                        {/* Timeline skeleton */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                                        <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                                        <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                                    </div>

                                    <div className="h-6 w-40 bg-muted rounded animate-pulse" />

                                    <div className="flex items-center space-x-2">
                                        <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                                        <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Horas del día con tareas */}
                                    {Array(3)
                                        .fill(0)
                                        .map((_, hourIndex) => (
                                            <div key={hourIndex} className="relative">
                                                <div className="sticky top-0 z-10 bg-background py-1">
                                                    <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                                                </div>

                                                <div className="mt-2 space-y-3">
                                                    {/* Tareas para cada hora */}
                                                    {Array(Math.floor(Math.random() * 2) + 1)
                                                        .fill(0)
                                                        .map((_, taskIndex) => (
                                                            <div
                                                                key={`${hourIndex}-${taskIndex}`}
                                                                className="flex items-start gap-3 p-3 rounded-lg border"
                                                            >
                                                                <div className="p-0 h-8 w-8 mt-0.5 bg-muted rounded-full animate-pulse" />

                                                                <div className="flex-1 min-w-0 space-y-2">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
                                                                        <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                                                                    </div>

                                                                    <div className="h-4 bg-muted rounded animate-pulse w-full" />
                                                                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />

                                                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                                                                        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                                                                        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                                                                    </div>
                                                                </div>

                                                                <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
