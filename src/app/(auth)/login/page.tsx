'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes('Invalid login')) {
          setError('Email o contraseña incorrectos');
        } else {
          setError('Error al iniciar sesión. Intentá de nuevo.');
        }
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Error de conexión. Verificá tu internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card padding="lg" className="shadow-lg">
        <h2 className="font-display text-xl font-semibold text-text-primary mb-1">
          Iniciar sesión
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          Ingresá con tu cuenta del edificio
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-4 w-4" />}
            required
            autoComplete="email"
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="h-4 w-4" />}
            required
            autoComplete="current-password"
          />

          {error && (
            <div className="p-3 rounded-[--radius-md] bg-error-50 border border-error-500/20">
              <p className="text-sm text-error-700">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            loading={loading}
            size="lg"
          >
            Ingresar
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Link
            href="/forgot-password"
            className="text-sm text-primary-500 hover:text-primary-700 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </Card>

      <p className="text-center text-xs text-text-muted mt-6">
        ¿No tenés cuenta? Contactá a la administración del edificio.
      </p>
    </>
  );
}
