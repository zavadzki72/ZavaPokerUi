// Ficheiro: src/components/VoteCard.tsx
// (Atualizado para mostrar o nome)

import React from 'react';

interface VoteCardProps {
  value: string;
  isSelected: boolean;
  onClick: (value: string) => void;
  name?: string; // NOVO: Nome do votante (opcional)
}

export const VoteCard: React.FC<VoteCardProps> = ({ value, isSelected, onClick, name }) => {
  const className = `vote-card ${isSelected ? 'selected' : ''}`;

  return (
    <div 
      className={className}
      onClick={() => onClick(value)}
    >
      {/* NOVO: Wrapper para o conteúdo */}
      <div className="vote-card-content">
        <span className="vote-card-value">{value}</span>
        {name && <span className="vote-card-name">{name}</span>}
      </div>
    </div>
  );
};