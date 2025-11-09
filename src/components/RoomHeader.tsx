import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';

interface RoomHeaderProps {
  roomId: string;
  userName: string;
}

export const RoomHeader: React.FC<RoomHeaderProps> = ({ roomId, userName }) => {
  return (
    <header className="room-header-component room-header">
      <h1>Sala ID: {roomId}</h1>
      <div className="room-header-user-info">
        <span>Olá, {userName}</span>
        <Link to="/">
          <Button style={{ padding: '8px 12px' }}>Sair da Sala</Button>
        </Link>
      </div>
    </header>
  );
};