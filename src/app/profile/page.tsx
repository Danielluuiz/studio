'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/context/AuthContext';
import { db, auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Define a type for the user profile data
interface UserProfile {
  name: string;
  email: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: string;
  goal?: string;
  experienceLevel?: string;
  dietaryRestrictions?: string;
  weeklyAvailability?: string;
  equipmentAvailable?: string;
  createdAt?: Date;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If auth is done loading and there's no user, redirect to login
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    // If there is a user, fetch their profile
    if (user) {
      const fetchProfile = async () => {
        setProfileLoading(true);
        setError(null);
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // Handle case where user exists in Auth but not in Firestore
            console.log('No profile document found, creating one...');
            const defaultProfile: UserProfile = {
              name: user.displayName || 'Usuário',
              email: user.email || '',
            };
            await setDoc(docRef, defaultProfile);
            setProfile(defaultProfile);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          setError('Erro ao carregar o perfil. Tente novamente.');
        } finally {
          setProfileLoading(false);
        }
      };
      fetchProfile();
    }
  }, [user, loading, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, profile, { merge: true }); // Use merge to avoid overwriting
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  // Show a loading skeleton while auth state is being determined
  if (loading || profileLoading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Perfil do Usuário</CardTitle>
            <CardDescription>
              Mantenha seus dados atualizados para que a IA possa criar os melhores planos para você.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando perfil...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Perfil do Usuário</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)}
              className="ml-auto"
            >
              {isEditing ? 'Cancelar' : 'Editar'}
            </Button>
          </CardTitle>
          <CardDescription>
            Mantenha seus dados atualizados para que a IA possa criar os melhores planos para você.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}
          <form onSubmit={handleUpdateProfile}>
            <div className="grid gap-6">
              {/* Informações Básicas */}
              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Informações Básicas</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={profile.name || ''}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={profile.email || ''} disabled />
                  </div>
                </div>
              </div>

              {/* Informações Físicas */}
              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Informações Físicas</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="age">Idade</Label>
                    <Input
                      id="age"
                      type="number"
                      value={profile.age || ''}
                      onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={profile.weight || ''}
                      onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value) })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="height">Altura (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={profile.height || ''}
                      onChange={(e) => setProfile({ ...profile, height: Number(e.target.value) })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gender">Gênero</Label>
                  <Input
                    id="gender"
                    value={profile.gender || ''}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Informações de Treino */}
              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Informações de Treino</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="experienceLevel">Nível de Experiência</Label>
                    <Input
                      id="experienceLevel"
                      value={profile.experienceLevel || ''}
                      onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="weeklyAvailability">Disponibilidade Semanal</Label>
                    <Input
                      id="weeklyAvailability"
                      value={profile.weeklyAvailability || ''}
                      onChange={(e) => setProfile({ ...profile, weeklyAvailability: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="equipmentAvailable">Equipamentos Disponíveis</Label>
                  <Input
                    id="equipmentAvailable"
                    value={profile.equipmentAvailable || ''}
                    onChange={(e) => setProfile({ ...profile, equipmentAvailable: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Objetivos e Restrições */}
              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Objetivos e Restrições</h3>
                <div className="grid gap-2">
                  <Label htmlFor="goal">Objetivo</Label>
                  <Input
                    id="goal"
                    value={profile.goal || ''}
                    onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dietaryRestrictions">Restrições Alimentares</Label>
                  <Input
                    id="dietaryRestrictions"
                    value={profile.dietaryRestrictions || ''}
                    onChange={(e) => setProfile({ ...profile, dietaryRestrictions: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Ex: Intolerância a lactose, alergia a glúten..."
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Salvar Alterações
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          </form>
          <Button variant="outline" className="w-full mt-6" onClick={handleLogout}>
            Sair
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
