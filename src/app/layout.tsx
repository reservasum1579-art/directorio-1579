import type { Metadata, Viewport } from 'next';
import './globals.css';

// Font setup removed due to network restrictions

// Font setup removed due to network restrictions

export const metadata: Metadata = {
  title: {
    default: 'Directorio 1579 — Portal Consorcial',
    template: '%s | Directorio 1579',
  },
  description:
    'Plataforma de gestión consorcial para residentes de Directorio 1579. Reservas SUM, expensas, marketplace y más.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Directorio 1579',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1B2A4A',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className="h-full"
    >
      <body className="min-h-full flex flex-col bg-background text-text-primary font-sans antialiased">
        <div id="modal-root"></div>
        {children}
      </body>
    </html>
  );
}
