import React from 'react';

interface VotingStageProps {
  isRevealed: boolean;
}

export const VotingStage: React.FC<VotingStageProps> = ({ isRevealed }) => {
  return (
    <div className="voting-stage-component">
      
      <div className="voting-stage-box">
        {isRevealed ? 'Votos Revelados!' : 'A aguardar os votos dos participantes...'}
      </div>
      
    </div>
  );
};