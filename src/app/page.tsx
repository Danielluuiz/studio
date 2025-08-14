"use client";

import React, { useState, useEffect } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Dumbbell, User, Apple, LineChart as LucideLineChart, Bot } from "lucide-react";
import ProfileTab from "@/components/dashboard-tabs/profile-tab";
import type { UserProfile } from "@/components/profile-form";
import WorkoutTab from "@/components/dashboard-tabs/workout-tab";
import MealTab from "@/components/dashboard-tabs/meal-tab";
import ProgressTab from "@/components/dashboard-tabs/progress-tab";
import AssistantTab from "@/components/dashboard-tabs/assistant-tab";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

type ActiveView = "profile" | "workout" | "meal" | "progress" | "assistant";

function PageContent() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>("profile");
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return null;
  }

  const handleProfileUpdate = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const renderContent = () => {
    switch (activeView) {
      case "profile":
        return <ProfileTab onProfileUpdate={handleProfileUpdate} />;
      case "workout":
        return <WorkoutTab userProfile={userProfile} />;
      case "meal":
        return <MealTab userProfile={userProfile} />;
      case "progress":
        return <ProgressTab userProfile={userProfile} />;
      case "assistant":
        return <AssistantTab />;
      default:
        return <ProfileTab onProfileUpdate={handleProfileUpdate} />;
    }
  };

  return (
    <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <Dumbbell className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary group-data-[collapsible=icon]:hidden">FitGenius</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveView("profile")} isActive={activeView === "profile"} tooltip="Perfil">
                  <User /> <span className="group-data-[collapsible=icon]:hidden">Perfil</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveView("workout")} isActive={activeView === "workout"} tooltip="Plano de Treino">
                  <Dumbbell /> <span className="group-data-[collapsible=icon]:hidden">Plano de Treino</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveView("meal")} isActive={activeView === "meal"} tooltip="Plano Alimentar">
                  <Apple /> <span className="group-data-[collapsible=icon]:hidden">Plano Alimentar</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveView("progress")} isActive={activeView === "progress"} tooltip="Acompanhamento">
                  <LucideLineChart /> <span className="group-data-[collapsible=icon]:hidden">Acompanhamento</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveView("assistant")} isActive={activeView === "assistant"} tooltip="Assistente">
                  <Bot /> <span className="group-data-[collapsible=icon]:hidden">Assistente</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
              <div className="flex items-center gap-4 mb-4">
                  <SidebarTrigger className="md:hidden" />
                   <h1 className="text-2xl font-bold text-primary md:hidden">FitGenius</h1>
              </div>
              <main>
                {renderContent()}
              </main>
            </div>
        </SidebarInset>
    </SidebarProvider>
  );
}

export default function Home() {
    return <PageContent />;
}
