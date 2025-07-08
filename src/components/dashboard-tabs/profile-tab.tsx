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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserCircle } from "lucide-react";

const profileSchema = z.object({
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

interface ProfileTabProps {
  onProfileUpdate: (profile: UserProfile) => void;
}

export default function ProfileTab({ onProfileUpdate }: ProfileTabProps) {
  const { toast } = useToast();
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
    },
  });

  const onSubmit: SubmitHandler<UserProfile> = (data) => {
    onProfileUpdate(data);
    toast({
      title: "Perfil Salvo!",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <UserCircle className="text-primary"/> Perfil do Usuário
        </CardTitle>
        <CardDescription>
          Insira seus dados para que a IA possa criar planos personalizados para você.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            </div>
             <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objetivo Principal</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ex: Perder peso, ganhar massa muscular, melhorar o condicionamento..." {...field} />
                    </FormControl>
                     <FormDescription>Seja o mais específico possível.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-8">
                 <FormField
                  control={form.control}
                  name="weeklyAvailability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disponibilidade Semanal</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 3 vezes por semana, 1 hora por dia" {...field} />
                      </FormControl>
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
                      <FormControl>
                        <Input placeholder="Ex: Halteres, barra, acesso a academia" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                  control={form.control}
                  name="dietaryRestrictions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Restrições Alimentares</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Ex: Intolerância a lactose, vegetariano, alergia a nozes..." {...field} />
                      </FormControl>
                       <FormDescription>Deixe em branco se não houver.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">Salvar Perfil</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
