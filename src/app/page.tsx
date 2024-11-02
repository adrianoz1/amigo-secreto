"use client";

import { useState } from 'react';

interface Participante {
  nome: string;
  email: string;
}

export default function Home() {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [nome, setNome] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const adicionarParticipante = () => {
    if (nome && email) {
      setParticipantes([...participantes, { nome, email }]);
      setNome('');
      setEmail('');
    }
  };

  const atualizarLista = () => {
    return participantes.map((participante, index) => (
      <li key={index} className="py-1 text-gray-700 text-sm sm:text-base">
        {`${participante.nome} (${participante.email})`}
      </li>
    ));
  };

  const realizarSorteio = async () => {
    if (participantes.length < 2) {
      alert('É necessário pelo menos 2 participantes.');
      return;
    }

    setIsLoading(true);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/sortear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantes }),
      });
      const data = await response.json();
      setSuccessMessage(data.message);
      setParticipantes([]);
    } catch (error) {
      console.error(error);
      alert('Erro ao realizar sorteio. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCollapse = () => setIsOpen(!isOpen);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-400 text-white p-4 sm:p-6">
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl sm:text-4xl font-bold mb-6 text-center text-black">Amigo Secreto Fácil</h1>
          <form onSubmit={(e) => e.preventDefault()} className="mb-4">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-2">
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome"
                required
                className="border border-gray-300 p-3 rounded-md flex-1 text-gray-700"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                required
                className="border border-gray-300 p-3 rounded-md flex-1 text-gray-700"
              />
            </div>
            <button
              type="button"
              onClick={adicionarParticipante}
              className="bg-blue-500 text-white w-full mt-4 p-2 rounded-md transition hover:bg-blue-600"
            >
              Adicionar Participante
            </button>
          </form>
          
          <ul className="mb-4 space-y-1">{atualizarLista()}</ul>

          <button
            onClick={realizarSorteio}
            className={`bg-green-500 text-white w-full p-2 rounded-md transition hover:bg-green-600 ${
              isLoading ? 'cursor-not-allowed opacity-75' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Realizar Sorteio'}
          </button>

          {successMessage && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md text-center">
              {successMessage}
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={toggleCollapse}
              className="bg-gray-200 text-gray-800 w-full p-2 rounded-md mb-2 transition hover:bg-gray-300"
            >
              {isOpen ? 'Esconder Como Funciona' : 'Como Funciona?'}
            </button>
            {isOpen && (
              <div className="bg-gray-100 p-4 rounded-md shadow-inner">
                <h2 className="text-lg font-semibold mb-2">Como Funciona</h2>
                <p className="text-gray-700 mb-2">1. Insira o nome e o e-mail dos participantes.</p>
                <p className="text-gray-700 mb-2">2. Clique em &quot;Adicionar Participante&quot; para incluir cada participante.</p>
                <p className="text-gray-700">3. Após adicionar todos, clique em &quot;Realizar Sorteio&quot; para descobrir quem tirou quem!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="text-white w-full p-4 text-center mt-4">
        <p>Se tiver alguma dúvida, entre em contato conosco em <a href="mailto:contato@amigosecretofacil.com.br" className="underline">contato@amigosecretofacil.com.br</a>.</p>
        <p className="text-sm">© 2024 Amigo Secreto Fácil. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
