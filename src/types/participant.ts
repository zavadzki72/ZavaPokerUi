export type Participant = {
  connectionId: string;
  userId: string; // O ID persistente e chave principal
  name: string; 
  isAdm: boolean;
  role: 'votante' | 'espectador';
  hasVoted: boolean;
  vote: string | null;
};

// Não coloque o AdoWorkItem aqui