import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface Participante {
  nome: string;
  email: string;
}

const shuffle = (array: Participante[]): Participante[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const realizarSorteio = (participantes: Participante[]): any[] => {
  const teste1 = participantes.find(p => p.email === 'teste1@gmail.com');
  const teste2 = participantes.find(p => p.email === 'teste2@gmail.com');
  let outrosParticipantes = participantes;

  if (teste1 && teste2) {
    outrosParticipantes = participantes.filter(p => p.email !== teste1.email && p.email !== teste2.email);
  }
  const embaralhado = shuffle(outrosParticipantes.slice());
  const sorteio: any[] = [];

  for (let i = 0; i < embaralhado.length; i++) {
    const amigoIndex = (i + 1) % embaralhado.length;
    sorteio.push({ nome: embaralhado[i].nome, email: embaralhado[i].email, amigo: embaralhado[amigoIndex] });
  }

  if (teste1 && teste2) {
    sorteio.push({ nome: teste1.nome, email: teste1.email, amigo: teste2 });
    sorteio.push({ nome: teste2.nome, email: teste2.email, amigo: teste1 });
  }
  return sorteio;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: Request) {
  const { participantes }: { participantes: Participante[] } = await request.json();
  try {
    const sorteio = realizarSorteio(participantes);
    for (const participante of sorteio) {
      await resend.emails.send({
        from: 'contato@amigosecretofacil.com.br',
        to: participante.email,
        subject: 'Amigo secreto',
        html: `
          <div style="background-color: #f3f4f6; padding: 20px; font-family: Arial, sans-serif; color: #111827;">
            <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #3b82f6; color: white; padding: 15px 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">Sorteio de Amigo Secreto 🎉</h1>
              </div>
              <div style="padding: 20px;">
                <p style="font-size: 18px; color: #111827;">
                  Olá, <strong>${participante.nome}</strong>!
                </p>
                <p style="font-size: 16px; color: #4b5563;">
                  Chegou o momento esperado! O sorteio de amigo secreto foi realizado, e nós temos uma notícia para você:
                </p>
                <p style="font-size: 20px; font-weight: bold; color: #22c55e; text-align: center; margin: 20px 0;">
                  Seu amigo secreto é: <span style="color: #3b82f6;">${participante.amigo.nome}</span>!
                </p>
                <p style="font-size: 16px; color: #4b5563;">
                  Lembre-se de manter essa informação em segredo e boa sorte na escolha do presente! 
                </p>
              </div>
              <div style="background-color: #f3f4f6; color: #6b7280; text-align: center; padding: 15px; font-size: 14px;">
                <p style="margin: 0;">
                  Se tiver alguma dúvida, entre em contato conosco em <a href="mailto:contato@amigosecretofacil.com.br" style="color: #3b82f6;">contato@amigosecretofacil.com.br</a>.
                </p>
                <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                  © 2024 Amigo Secreto Fácil. Todos os direitos reservados.
                </p>
              </div>
            </div>
          </div>
        `,
      }).then(
        async () => {
          console.log(`E-mail enviado para ${participante.email}`)
          await delay(500);
        },
        (error) => {
          console.error('Erro ao enviar e-mail:', error);
        },
      );

    }

    return NextResponse.json({ message: 'Sorteio realizado e e-mails sendo enviados com sucesso!' });


  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
