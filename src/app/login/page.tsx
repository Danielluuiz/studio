'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Chrome, Shield } from 'lucide-react'; // Using Shield for Apple
import { ModeToggle } from '@/components/mode-toggle';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSocialLogin = async (provider: GoogleAuthProvider | OAuthProvider) => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If user is new, save their data to Firestore
        await setDoc(userDocRef, {
          name: user.displayName || 'Usuário',
          email: user.email,
          createdAt: new Date(),
        });
      }

      router.push('/');
    } catch (err: any) {
      setError(`Falha ao fazer login: ${err.message}`);
    }
  };

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    handleSocialLogin(provider);
  };

  const handleAppleLogin = () => {
    const provider = new OAuthProvider('apple.com');
    handleSocialLogin(provider);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err: any) {
      setError('Falha ao fazer login. Verifique seu e-mail e senha.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 relative">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <Card className="w-full max-w-md glass-card border-0">
        <CardHeader className="text-center space-y-1">
          <div className="flex justify-center mb-4">
            {/* Placeholder for Logo if needed, or just text */}
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-brand-red to-red-700 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              FG
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Bem-vindo de volta</CardTitle>
          <CardDescription>
            Acesse sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button variant="outline" onClick={handleGoogleLogin} className="w-full flex items-center gap-2 glass-input hover:bg-white/40 border-0 h-11">
              <Chrome size={18} /> Continuar com Google
            </Button>
            <Button variant="outline" onClick={handleAppleLogin} className="w-full flex items-center gap-2 glass-input hover:bg-white/40 border-0 h-11">
              <Shield size={18} /> Continuar com Apple
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-muted-foreground">
                  Ou continue com
                </span>
              </div>
            </div>

            <form onSubmit={handleEmailLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@exemplo.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input h-11"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input h-11"
                />
              </div>
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
              <Button type="submit" className="w-full liquid-button h-11 font-semibold text-md shadow-lg">
                Entrar
              </Button>
            </form>
            <div className="text-center mt-4 text-sm">
              Ainda não tem uma conta?{' '}
              <Link href="/signup" className="font-semibold text-brand-red hover:underline">
                Cadastre-se
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

