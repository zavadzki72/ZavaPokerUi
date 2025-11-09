import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useUser } from '../contexts/UserContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

type Tab = 'create' | 'join';

const LoginForm: React.FC = () => {
  const { userName, setUserName, setUserRole, setIsAdm } = useUser();
  
  const [localUserName, setLocalUserName] = useState(userName);
  const [roomId, setRoomId] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('create');
  
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (!localUserName) return;
    setUserName(localUserName);
    setUserRole('votante');
    setIsAdm(true);
    const newRoomId = crypto.randomUUID().substring(0, 6);
    navigate(`/room/${newRoomId}`);
  };

  const handleJoinRoom = () => {
    if (!localUserName || !roomId) return;
    setUserName(localUserName);
    setUserRole('votante');
    setIsAdm(false);
    navigate(`/room/${roomId}`);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'create') {
      handleCreateRoom();
    } else {
      handleJoinRoom();
    }
  };

  return (
    <div className="home-box">
      <div className="home-tabs">
        <button
          className={`home-tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Criar Sala
        </button>
        <button
          className={`home-tab ${activeTab === 'join' ? 'active' : ''}`}
          onClick={() => setActiveTab('join')}
        >
          Entrar na Sala
        </button>
      </div>
      
      <form className="home-tab-content" onSubmit={handleSubmit}>
        <Input
          label="O seu Nome:"
          value={localUserName}
          onChange={(e) => setLocalUserName(e.target.value)}
          placeholder="Digite o seu nome"
          required
        />

        {activeTab === 'join' && (
          <Input
            label="ID da Sala:"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Digite o código da sala"
            required
          />
        )}
        
        {activeTab === 'create' && (
          <Button 
            type="submit"
            disabled={!localUserName} 
            style={{ width: '100%' }}
          >
            Criar e Entrar
          </Button>
        )}
        
        {activeTab === 'join' && (
          <Button 
            type="submit"
            disabled={!localUserName || !roomId}
            style={{ width: '100%' }}
          >
            Entrar na Sala
          </Button>
        )}
      </form>
    </div>
  );
};

export const HomePage: React.FC = () => {
  return (
    <div className="home-page-layout">
      <Header />
      
      <main className="home-main-content">
        <div className="home-grid">
          
          <div className="home-hero-text">
            <h1>
              Planning Poker <span>Online</span>
            </h1>
            <p>
              Estimativas ágeis, simples e em tempo real para a sua equipa. 
              Diga adeus às reuniões longas e olá à produtividade.
            </p>
          </div>

          <div className="home-login-area">
            <LoginForm />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};