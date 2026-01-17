"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { app, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserCircle, LogOut } from "lucide-react";
import { ProfileForm } from "@/components/profile-form";
import type { UserProfile } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface ProfileTabProps {
  onProfileUpdate: (profile: UserProfile) => void;
}

export default function ProfileTab({ onProfileUpdate }: ProfileTabProps) {
  const { toast } = useToast();
  const router = useRouter();
  const auth = getAuth(app);
  const { user } = useAuth();
  const [initialData, setInitialData] = useState<Partial<UserProfile> | undefined>();

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          setInitialData(data);
          onProfileUpdate(data);
        } else {
          // Para usuários novos, inicializa com dados vazios
          setInitialData({});
        }
      };
      fetchProfile();
    }
  }, [user, onProfileUpdate]);

  const handleSubmit = async (data: UserProfile) => {
    if (!user) {
      toast({ title: "Erro", description: "Usuário não autenticado.", variant: "destructive" });
      return;
    }
    try {
      await setDoc(doc(db, "users", user.uid), data, { merge: true });
      onProfileUpdate(data);
      toast({
        title: "Perfil Salvo!",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível salvar o perfil.", variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro!",
        description: "Não foi possível fazer logout. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="glass-card text-white border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <UserCircle className="text-primary" /> Perfil do Usuário
          </CardTitle>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut size={16} />
            Sair
          </Button>
        </div>
        <CardDescription>
          Mantenha seus dados atualizados para que a IA possa criar os melhores planos para você.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {initialData !== undefined ? (
          <ProfileForm
            onSubmit={handleSubmit}
            defaultValues={initialData}
            submitButtonText={Object.keys(initialData).length > 0 ? "Atualizar Perfil" : "Criar Perfil"}
          />
        ) : (
          <p>Carregando perfil...</p>
        )}
      </CardContent>
    </Card>
  );
}
