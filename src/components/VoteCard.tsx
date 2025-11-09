import React from 'react';

interface VoteCardProps {
  value: string;
  isSelected: boolean;
  onClick: (value: string) => void;
}

export const VoteCard: React.FC<VoteCardProps> = ({ value, isSelected, onClick }) => {
  const className = `vote-card ${isSelected ? 'selected' : ''}`;

  return (
    <div 
      className={className}
      onClick={() => onClick(value)}
    >
      {value}
    </div>
  );
};