"use client";

import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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

interface ProfileFormProps {
  onSubmit: SubmitHandler<UserProfile>;
  defaultValues?: Partial<UserProfile>;
  submitButtonText?: string;
}

export function ProfileForm({ 
  onSubmit, 
  defaultValues,
  submitButtonText = "Salvar Perfil"
}: ProfileFormProps) {
  const form = useForm<UserProfile>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      age: undefined,
      weight: undefined,
      height: undefined,
      gender: "",
      goal: "",
      experienceLevel: "",
      dietaryRestrictions: "",
      weeklyAvailability: "",
      equipmentAvailable: "Apenas peso corporal",
      ...defaultValues
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Idade</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Sua idade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Peso (kg)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Seu peso" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Altura (cm)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Sua altura" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gênero</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu gênero" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="experienceLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nível de Experiência</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu nível" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="iniciante">Iniciante</SelectItem>
                    <SelectItem value="intermediario">Intermediário</SelectItem>
                    <SelectItem value="avancado">Avançado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem className="lg:col-span-3">
                <FormLabel>Objetivo</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ex: Quero ganhar massa muscular e definir o abdômen."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Seja o mais detalhado possível no seu objetivo.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weeklyAvailability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disponibilidade Semanal</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione os dias" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1-2">1-2 dias</SelectItem>
                    <SelectItem value="3-4">3-4 dias</SelectItem>
                    <SelectItem value="5-6">5-6 dias</SelectItem>
                    <SelectItem value="todos">Todos os dias</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="equipmentAvailable"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipamentos Disponíveis</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione os equipamentos" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="nenhum">Apenas peso corporal</SelectItem>
                    <SelectItem value="basico">Halteres e Elásticos</SelectItem>
                    <SelectItem value="completo">Academia Completa</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dietaryRestrictions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Restrições Alimentares</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Intolerância a lactose, alergia a glúten..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full">{submitButtonText}</Button>
      </form>
    </Form>
  );
}
