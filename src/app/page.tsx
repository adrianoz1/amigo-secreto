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

  const adicionarParticipante = () => {
    if (nome && email) {
      setParticipantes([...participantes, { nome, email }]);
      setNome('');
      setEmail('');
    }
  };

  const atualizarLista = () => {
    return participantes.map((participante, index) => (
      <li key={index} className="py-1">{`${participante.nome} (${participante.email})`}</li>
    ));
  };

  const realizarSorteio = async () => {
    if (participantes.length < 2) {
      alert('É necessário pelo menos 2 participantes.');
      return;
    }

    try {
      const response = await fetch('/api/sortear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantes }),
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error(error);
      alert('Erro ao realizar sorteio. Tente novamente.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-black">Sorteio de Amigo Secreto</h1>
      <form onSubmit={(e) => e.preventDefault()} className="mb-4">
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
          required
          className="border border-gray-300 p-2 rounded-md mr-2 text-black"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          required
          className="border border-gray-300 p-2 rounded-md mr-2 text-black"
        />
        <button
          type="button"
          onClick={adicionarParticipante}
          className="bg-blue-500 text-white p-2 rounded-md transition hover:bg-blue-600"
        >
          Adicionar Participante
        </button>
      </form>
      <ul className="mb-4 text-gray-700">{atualizarLista()}</ul>
      <button
        onClick={realizarSorteio}
        className="bg-green-500 text-white p-2 rounded-md transition hover:bg-green-600"
      >
        Realizar Sorteio
      </button>
    </div>
  );
}
