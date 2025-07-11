'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Chrome, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const signUpSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  email: z.string().email("O formato do email é inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  age: z.coerce.number().min(1, "A idade é obrigatória."),
  weight: z.coerce.number().min(1, "O peso é obrigatório."),
  height: z.coerce.number().min(1, "A altura é obrigatória."),
  gender: z.string().min(1, "O gênero é obrigatório."),
  goal: z.string().min(10, "O objetivo deve ter pelo menos 10 caracteres."),
  experienceLevel: z.string().min(1, "O nível de experiência é obrigatório."),
  dietaryRestrictions: z.string().optional(),
  weeklyAvailability: z.string().min(1, "A disponibilidade semanal é obrigatória."),
  equipmentAvailable: z.string().min(1, "Os equipamentos disponíveis são obrigatórios."),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
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

  const handleSocialSignUp = async (provider: GoogleAuthProvider | OAuthProvider) => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName || 'Usuário',
          email: user.email,
          createdAt: new Date(),
        });
      }
      router.push('/profile');
    } catch (err: any) {
      setError(`Falha ao cadastrar: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => handleSocialSignUp(new GoogleAuthProvider());
  const handleAppleSignUp = () => handleSocialSignUp(new OAuthProvider('apple.com'));

  const handleEmailSignUp: SubmitHandler<SignUpFormValues> = async (data) => {
    setError(null);
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      
      const profileData = { ...data };
      delete (profileData as Partial<SignUpFormValues>).email;
      delete (profileData as Partial<SignUpFormValues>).password;

      await setDoc(doc(db, 'users', user.uid), {
        ...profileData,
        createdAt: new Date(),
      });
      
      toast({
        title: "Bem-vindo!",
        description: "Sua conta foi criada com sucesso.",
      });
      router.push('/profile');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background py-12">
      <Card className="w-full max-w-4xl mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Crie sua Conta e Perfil</CardTitle>
          <CardDescription>
            Já tem uma conta?{' '}
            <Link href="/login" className="underline text-primary">
              Faça login
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="max-w-md mx-auto mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" onClick={handleGoogleSignUp} disabled={isLoading} className="w-full flex items-center gap-2">
                        <Chrome size={18} /> Continuar com Google
                    </Button>
                    <Button variant="outline" onClick={handleAppleSignUp} disabled={isLoading} className="w-full flex items-center gap-2">
                        <Shield size={18} /> Continuar com Apple
                    </Button>
                </div>
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                        Ou preencha seus dados
                        </span>
                    </div>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleEmailSignUp)} className="space-y-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Auth Fields */}
                    <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Nome</FormLabel> <FormControl> <Input placeholder="Seu nome" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="email" render={({ field }) => ( <FormItem> <FormLabel>Email</FormLabel> <FormControl> <Input type="email" placeholder="m@exemplo.com" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="password" render={({ field }) => ( <FormItem> <FormLabel>Senha</FormLabel> <FormControl> <Input type="password" placeholder="Sua senha" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    
                    {/* Profile Fields */}
                    <FormField control={form.control} name="age" render={({ field }) => ( <FormItem> <FormLabel>Idade</FormLabel> <FormControl> <Input type="number" placeholder="Sua idade" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="weight" render={({ field }) => ( <FormItem> <FormLabel>Peso (kg)</FormLabel> <FormControl> <Input type="number" placeholder="Seu peso" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="height" render={({ field }) => ( <FormItem> <FormLabel>Altura (cm)</FormLabel> <FormControl> <Input type="number" placeholder="Sua altura" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="gender" render={({ field }) => ( <FormItem> <FormLabel>Gênero</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Selecione seu gênero" /> </SelectTrigger> </FormControl> <SelectContent> <SelectItem value="masculino">Masculino</SelectItem> <SelectItem value="feminino">Feminino</SelectItem> <SelectItem value="outro">Outro</SelectItem> </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="experienceLevel" render={({ field }) => ( <FormItem> <FormLabel>Nível de Experiência</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Selecione seu nível" /> </SelectTrigger> </FormControl> <SelectContent> <SelectItem value="iniciante">Iniciante</SelectItem> <SelectItem value="intermediario">Intermediário</SelectItem> <SelectItem value="avancado">Avançado</SelectItem> </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="weeklyAvailability" render={({ field }) => ( <FormItem> <FormLabel>Disponibilidade Semanal</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Selecione os dias" /> </SelectTrigger> </FormControl> <SelectContent> <SelectItem value="1-2">1-2 dias</SelectItem> <SelectItem value="3-4">3-4 dias</SelectItem> <SelectItem value="5-6">5-6 dias</SelectItem> <SelectItem value="todos">Todos os dias</SelectItem> </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="equipmentAvailable" render={({ field }) => ( <FormItem> <FormLabel>Equipamentos Disponíveis</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Selecione os equipamentos" /> </SelectTrigger> </FormControl> <SelectContent> <SelectItem value="nenhum">Apenas peso corporal</SelectItem> <SelectItem value="basico">Halteres e Elásticos</SelectItem> <SelectItem value="completo">Academia Completa</SelectItem> </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="dietaryRestrictions" render={({ field }) => ( <FormItem> <FormLabel>Restrições Alimentares</FormLabel> <FormControl> <Input placeholder="Ex: Intolerância a lactose, alergia a glúten..." {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="goal" render={({ field }) => ( <FormItem className="lg:col-span-3"> <FormLabel>Objetivo</FormLabel> <FormControl> <Textarea placeholder="Ex: Quero ganhar massa muscular e definir o abdômen." className="resize-none" {...field} /> </FormControl> <FormDescription> Seja o mais detalhado possível no seu objetivo. </FormDescription> <FormMessage /> </FormItem> )}/>
                </div>
                {error && <p className="text-destructive text-sm text-center mt-4">{error}</p>}
                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? 'Criando conta...' : 'Finalizar Cadastro'}
                </Button>
                </form>
            </Form>
        </CardContent>
      </Card>
    </div>
  );
}
