import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PokéQuiz ⚡ - Desafío de Gimnasio Pokémon',
  description: 'Compite a ritmo de entrenador en batallas de preguntas con imágenes ilimitadas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;700;900&family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-amber-400 selection:text-slate-950 font-sans">
        {children}
      </body>
    </html>
  );
}
