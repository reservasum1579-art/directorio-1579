export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-background">
      {/* Decorative gradient overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary-700/[0.03] to-transparent" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-accent-500/[0.04] blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 animate-fade-in-up">
          <div className="w-14 h-14 rounded-[--radius-lg] bg-primary-700 flex items-center justify-center shadow-lg mb-4">
            <span className="text-white font-display font-bold text-2xl">D</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-primary-700">
            Directorio 1579
          </h1>
          <p className="text-sm text-text-muted mt-1">Portal Consorcial</p>
        </div>

        {/* Content */}
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
