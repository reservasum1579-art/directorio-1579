"use client";
import React, { useState } from 'react';

export default function AssignUnitButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleAssign = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/assign-unit', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? 'Error inesperado');
      } else {
        setMessage(`Unidad asignada: ${data.unit?.floor}° ${data.unit?.unit_number}`);
      }
    } catch (e) {
      setMessage('Fallo al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleAssign}
        disabled={loading}
        className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition"
      >
        {loading ? 'Asignando...' : 'Asignar unidad automática'}
      </button>
      {message && <p className="mt-2 text-sm text-primary-900">{message}</p>}
    </div>
  );
}
