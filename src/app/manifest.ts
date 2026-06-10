import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Directorio 1579',
    short_name: 'Directorio',
    description: 'Plataforma de gestión consorcial para residentes de Directorio 1579.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1B2A4A',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
