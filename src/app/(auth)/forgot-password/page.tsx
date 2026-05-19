'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: `${window.location.origin}/reset-password` }
      );

      if (resetError) {
        setError('Error al enviar el email. Intentá de nuevo.');
        return;
      }

      setSuccess(true);
    } catch {
      setError('Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card padding="lg" className="shadow-lg text-center">
        <div className="w-12 h-12 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-4">
          <Mail className="h-6 w-6 text-success-500" />
        </div>
        <h2 className="font-display text-xl font-semibold text-text-primary mb-2">
          Email enviado
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          Revisá tu bandeja de entrada en <strong>{email}</strong> y seguí las instrucciones para restablecer tu contraseña.
        </p>
        <Link href="/login">
          <Button variant="secondary" fullWidth>
            Volver al login
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card padding="lg" className="shadow-lg">
      <Link
        href="/login"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Link>

      <h2 className="font-display text-xl font-semibold text-text-primary mb-1">
        Recuperar contraseña
      </h2>
      <p className="text-sm text-text-secondary mb-6">
        Te enviaremos un link para restablecer tu contraseña
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

        {error && (
          <div className="p-3 rounded-[--radius-md] bg-error-50 border border-error-500/20">
            <p className="text-sm text-error-700">{error}</p>
          </div>
        )}

        <Button type="submit" fullWidth loading={loading} size="lg">
          Enviar link de recuperación
        </Button>
      </form>
    </Card>
  );
}
