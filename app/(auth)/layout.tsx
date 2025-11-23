import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Autenticación | Sign Language Translator',
  description: 'Inicia sesión o regístrate para usar el traductor de lengua de señas',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Decoración de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-secondary/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Contenido */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}