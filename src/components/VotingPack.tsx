import React from 'react';
import { VoteCard } from './VoteCard';

interface VotingPackProps {
  options: string[];
  selectedValue: string | null;
  onVote: (value: string) => void;
}

export const VotingPack: React.FC<VotingPackProps> = ({ options, selectedValue, onVote }) => {
  return (
    <div className="voting-pack-container">
      {options.map((value) => (
        <VoteCard
          key={value}
          value={value}
          isSelected={selectedValue === value}
          onClick={onVote}
        />
      ))}
    </div>
  );
};