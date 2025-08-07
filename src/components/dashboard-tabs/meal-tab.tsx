"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateMealSuggestions } from "@/ai/flows/generate-meal-suggestions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Apple, UtensilsCrossed, ShoppingCart } from "lucide-react";
import type { UserProfile } from "@/components/profile-form";

interface MealTabProps {
  userProfile: UserProfile | null;
}

interface MealPlan {
  weeklyMealSuggestions: string;
  macronutrientDistribution: string;
  shoppingList: string;
}

export default function MealTab({ userProfile }: MealTabProps) {
  const { toast } = useToast();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePlan = async () => {
    if (!userProfile) {
      toast({
        title: "Perfil Incompleto",
        description: "Por favor, preencha seu perfil antes de gerar um plano alimentar.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setMealPlan(null);
    try {
      const result = await generateMealSuggestions({
        objective: userProfile.goal,
        dietaryRestrictions: userProfile.dietaryRestrictions || "Nenhuma",
        preferences: "N/A", // Preferences not in form, can be added later
        weeklyAvailability: userProfile.weeklyAvailability,
      });
      setMealPlan(result);
      toast({
        title: "Plano Alimentar Gerado!",
        description: "Suas sugestões de refeições estão prontas.",
      });
    } catch (error) {
      console.error("Error generating meal plan:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o plano alimentar. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <Apple className="text-primary" />
            Plano Alimentar IA
          </CardTitle>
          <CardDescription>
            Gere sugestões de refeições semanais personalizadas com base no seu perfil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGeneratePlan} disabled={isLoading || !userProfile} className="bg-primary hover:bg-primary/90">
            {isLoading ? "Gerando Plano..." : "Gerar Plano Alimentar"}
          </Button>
          {!userProfile && (
             <p className="text-sm text-destructive mt-2">Preencha seu perfil para habilitar a geração de plano.</p>
          )}
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      )}

      {mealPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Seu Plano Alimentar Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="suggestions">
                <AccordionTrigger className="text-lg font-medium">
                  <UtensilsCrossed className="inline-block mr-2 text-primary" />
                  Sugestões de Refeições
                </AccordionTrigger>
                <AccordionContent>
                  <pre className="whitespace-pre-wrap p-4 bg-secondary rounded-md font-sans text-sm">{mealPlan.weeklyMealSuggestions}</pre>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="macros">
                <AccordionTrigger className="text-lg font-medium">
                  <span className="text-primary font-bold mr-2">Σ</span>
                  Distribuição de Macronutrientes
                </AccordionTrigger>
                <AccordionContent>
                  <pre className="whitespace-pre-wrap p-4 bg-secondary rounded-md font-sans text-sm">{mealPlan.macronutrientDistribution}</pre>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shopping-list">
                <AccordionTrigger className="text-lg font-medium">
                  <ShoppingCart className="inline-block mr-2 text-primary" />
                  Lista de Compras
                </AccordionTrigger>
                <AccordionContent>
                  <pre className="whitespace-pre-wrap p-4 bg-secondary rounded-md font-sans text-sm">{mealPlan.shoppingList}</pre>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
