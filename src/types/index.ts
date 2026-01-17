import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  age: z.coerce.number().min(1, "Idade é obrigatória."),
  weight: z.coerce.number().min(1, "Peso é obrigatório."),
  height: z.coerce.number().min(1, "Altura é obrigatória."),
  gender: z.string().min(1, "Gênero é obrigatório."),
  goal: z.string().min(10, "Objetivo deve ter pelo menos 10 caracteres."),
  experienceLevel: z.string().min(1, "Nível de experiência é obrigatório."),
  dietaryRestrictions: z.string().optional(),
  weeklyAvailability: z.string().min(1, "Disponibilidade é obrigatória."),
  equipmentAvailable: z.string().min(1, "Equipamentos são obrigatórios."),
});

export type UserProfile = z.infer<typeof profileSchema>;

export interface WorkoutPlan {
  weeklySplit: string;
  days: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  warmupAndCooldown: string;
  notesAndProgression: string;
}

export interface MealPlan {
  weeklyMealSuggestions: string;
  macronutrientDistribution: string;
  shoppingList: string;
}
