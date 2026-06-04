'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function SetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get session to show user's name
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        const meta = data.user.user_metadata;
        setUserName(meta?.first_name || data.user.email || '');
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError('No se pudo establecer la contraseña. Intentá de nuevo.');
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push('/'), 2000);
    } catch {
      setError('Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card padding="lg" className="shadow-lg text-center">
        <div className="w-14 h-14 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-7 w-7 text-success-500" />
        </div>
        <h2 className="font-display text-xl font-semibold text-text-primary mb-2">
          ¡Contraseña establecida!
        </h2>
        <p className="text-sm text-text-secondary">
          Ingresando al portal...
        </p>
      </Card>
    );
  }

  return (
    <Card padding="lg" className="shadow-lg">
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold text-text-primary mb-1">
          {userName ? `¡Hola, ${userName}!` : '¡Bienvenido/a!'}
        </h2>
        <p className="text-sm text-text-secondary">
          Elegí una contraseña para acceder al portal del consorcio.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            label="Nueva contraseña"
            type={showPw ? 'text' : 'password'}
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="h-4 w-4" />}
            required
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-9 text-text-muted hover:text-text-primary transition-colors"
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <Input
          label="Confirmar contraseña"
          type={showPw ? 'text' : 'password'}
          placeholder="Repetí la contraseña"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          icon={<Lock className="h-4 w-4" />}
          required
        />

        {/* Password strength hints */}
        <div className="flex gap-2 flex-wrap">
          {[
            { label: '8+ caracteres', ok: password.length >= 8 },
            { label: 'Mayúscula', ok: /[A-Z]/.test(password) },
            { label: 'Número', ok: /\d/.test(password) },
          ].map((hint) => (
            <span
              key={hint.label}
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                hint.ok
                  ? 'bg-success-500/15 text-success-700'
                  : 'bg-background-warm text-text-muted'
              }`}
            >
              {hint.ok ? '✓ ' : ''}{hint.label}
            </span>
          ))}
        </div>

        {error && (
          <div className="p-3 rounded-[--radius-md] bg-error-50 border border-error-500/20">
            <p className="text-sm text-error-700">{error}</p>
          </div>
        )}

        <Button type="submit" fullWidth loading={loading} size="lg">
          Establecer contraseña e ingresar
        </Button>
      </form>
    </Card>
  );
}
