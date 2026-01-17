"use client"

import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { Dumbbell, User, Calendar, Apple } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export default function TestSidebarPage() {
    return (
        <div className="flex min-h-screen bg-background p-4">
            <SidebarProvider>
                <Sidebar collapsible="icon">
                    <SidebarHeader>
                        <div className="flex items-center justify-between p-2">
                            <div className="flex items-center gap-2">
                                <Dumbbell className="w-8 h-8 text-primary" />
                                <h1 className="text-2xl font-bold text-primary group-data-[collapsible=icon]:hidden">FitGenius</h1>
                            </div>
                            <div className="group-data-[collapsible=icon]:hidden">
                                <ModeToggle />
                            </div>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton isActive={true}>
                                    <User />
                                    <span>Perfil</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <Dumbbell />
                                    <span>Plano de Treino</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarContent>
                </Sidebar>
                <div className="flex-1 p-8">
                    <h1 className="text-4xl font-bold">Conteúdo Principal</h1>
                    <p className="mt-4 text-lg">Este é um teste para visualizar a sidebar com o efeito Apple Glass.</p>
                    <div className="mt-8 w-full h-64 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg"></div>
                </div>
            </SidebarProvider>
        </div>
    )
}
