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
import { Skeleton } from '@/components/ui/skeleton';

// Define a type for the user profile data
interface UserProfile {
  name: string;
  email: string;
  dateOfBirth?: string;
  fitnessGoals?: string;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // If auth is done loading and there's no user, redirect to login
    if (!loading && !user) {
      router.push('/login');
    }

    // If there is a user, fetch their profile
    if (user) {
      const fetchProfile = async () => {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          // Handle case where user exists in Auth but not in Firestore
          console.log('No such document!');
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
  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full mt-4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Perfil do Usuário</CardTitle>
          <CardDescription>Veja e edite suas informações.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profile.email} disabled />
              </div>
              {/* Add more fields as needed, e.g., Date of Birth, Fitness Goals */}
              {isEditing ? (
                <Button type="submit">Salvar Alterações</Button>
              ) : (
                <Button type="button" onClick={() => setIsEditing(true)}>Editar Perfil</Button>
              )}
            </div>
          </form>
          <Button variant="outline" className="w-full mt-4" onClick={handleLogout}>
            Sair (Logout)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
