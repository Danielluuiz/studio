"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";
import ProfileTab, { type UserProfile } from "@/components/dashboard-tabs/profile-tab";
import WorkoutTab from "@/components/dashboard-tabs/workout-tab";
import MealTab from "@/components/dashboard-tabs/meal-tab";
import ProgressTab from "@/components/dashboard-tabs/progress-tab";
import AssistantTab from "@/components/dashboard-tabs/assistant-tab";

export default function Home() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const handleProfileUpdate = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
          <Dumbbell className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold font-headline text-primary">
            FitGenius
          </h1>
        </header>

        <main>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 bg-secondary/80">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="workout">Plano de Treino</TabsTrigger>
              <TabsTrigger value="meal">Plano Alimentar</TabsTrigger>
              <TabsTrigger value="progress">Acompanhamento</TabsTrigger>
              <TabsTrigger value="assistant">Assistente</TabsTrigger>
            </TabsList>
            <Card className="mt-4">
              <CardContent className="p-6">
                <TabsContent value="profile">
                  <ProfileTab onProfileUpdate={handleProfileUpdate} />
                </TabsContent>
                <TabsContent value="workout">
                  <WorkoutTab userProfile={userProfile} />
                </TabsContent>
                <TabsContent value="meal">
                  <MealTab userProfile={userProfile} />
                </TabsContent>
                <TabsContent value="progress">
                  <ProgressTab userProfile={userProfile} />
                </TabsContent>
                <TabsContent value="assistant">
                  <AssistantTab />
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
