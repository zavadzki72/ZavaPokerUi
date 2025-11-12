import React from 'react';
// Importa os tipos
import { type Participant } from '../types/participant';
import { VoteCard } from './VoteCard'; 

// Define os tipos de Pack
type PackType = 'fibonacci' | 'sequencial' | 'tshirt';

interface VotingStageProps {
  isRevealed: boolean;
  participants: Participant[]; 
  activePack: PackType; // Precisa do pack para calcular a média
}

// Estilo para o container dos votos revelados
const revealedVotesContainerStyles: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  justifyContent: 'center',
  alignItems: 'center',
  maxWidth: '100%',
};

// Componente para calcular estatísticas (Problema 4)
const VoteStatistics: React.FC<{ 
  participants: Participant[]; 
  pack: PackType; 
}> = ({ participants, pack }) => {
  
  // Pega apenas os votos válidos de votantes
  const validVotes = participants
    .filter(p => p.role === 'votante' && p.vote != null)
    .map(p => p.vote!);

  if (validVotes.length === 0) return null;

  let statisticsElement: React.ReactNode = null;

  if (pack === 'tshirt') {
    // Para T-Shirt, contamos os votos
    const counts: { [key: string]: number } = {};
    validVotes.forEach(vote => {
      // Ignora '?' e '☕' da contagem de T-Shirt
      if (vote !== '?' && vote !== '☕') {
         counts[vote] = (counts[vote] || 0) + 1;
      }
    });
    
    const voteCounts = Object.entries(counts)
      .map(([vote, count]) => `${vote}(${count})`)
      .join(', ');

    statisticsElement = (
      <span>
        Votos: {voteCounts || 'Nenhum voto de tamanho'}
      </span>
    );

  } else {
    // Para numéricos, calculamos a média
    const numericVotes = validVotes
      .map(v => parseFloat(v))
      .filter(v => !isNaN(v)); // Filtra '?' e '☕'

    if (numericVotes.length > 0) {
      const sum = numericVotes.reduce((acc, val) => acc + val, 0);
      const average = (sum / numericVotes.length).toFixed(1);
      statisticsElement = <span>Média: {average}</span>;
    } else {
       statisticsElement = <span>Nenhum voto numérico</span>;
    }
  }

  return (
    <div style={{ marginTop: '20px', fontSize: '1.2em', fontWeight: 'bold' }}>
      {statisticsElement}
    </div>
  );
};


export const VotingStage: React.FC<VotingStageProps> = ({ isRevealed, participants, activePack }) => {
  
  // Filtra participantes que são votantes e que de facto votaram (ou 'hasVoted' se escondido)
  const votingParticipants = participants.filter(
    (p) => p.role === 'votante' && (isRevealed ? p.vote != null : p.hasVoted)
  );

  return (
    <div className="voting-stage-component">
      
      <div className="voting-stage-box">
        {isRevealed ? (
          // 1. Estado REVELADO
          <div style={{...revealedVotesContainerStyles, flexDirection: 'column'}}>
            {/* Secção dos Cartões */}
            <div style={revealedVotesContainerStyles}>
              {votingParticipants.length > 0 ? (
                votingParticipants.map((p) => (
                  <VoteCard
                    key={p.connectionId}
                    value={p.vote!} // Mostra o voto real
                    isSelected={false} // Apenas para exibição
                    onClick={() => {}} // Não clicável
                    name={p.name} // Passa o nome para o cartão
                  />
                ))
              ) : (
                <p>Nenhum voto foi registado.</p>
              )}
            </div>
            
            {/* Secção da Média/Estatísticas (Problema 4) */}
            <VoteStatistics participants={participants} pack={activePack} />
            
          </div>
        ) : (
          // 2. Estado ESCONDIDO (Aguardando)
          <div style={revealedVotesContainerStyles}>
            {votingParticipants.length > 0 ? (
                votingParticipants.map((p) => (
                  // Mostra um cartão "virado" para cada pessoa que votou
                  <VoteCard
                    key={p.connectionId}
                    value="✓" // Mostra que votou
                    isSelected={true} // Usa o estilo 'selected' para o cartão virado
                    onClick={() => {}} // Não clicável
                  />
                ))
            ) : (
              <p>A aguardar os votos dos participantes...</p>
            )}
          </div>
        )}
      </div>
      
    </div>
  );
};