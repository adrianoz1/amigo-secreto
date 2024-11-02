import './globals.css';

export const metadata = {
  title: 'Sorteio de Amigo Secreto',
  description: 'Realize seu sorteio de amigo secreto com facilidade!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
