import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useSignalR } from '../contexts/SignalRContext';
import { Button } from '../components/Button';
import { VotingPack } from '../components/VotingPack';
import { getWorkItemDetails, type AdoWorkItem as AdoWorkItemType } from '../services/adoService';
import { RoomHeader } from '../components/RoomHeader';
import { RoomSidebar } from '../components/RoomSidebar';
import { VotingStage } from '../components/VotingStage';

const packOptions = {
  fibonacci: ['0', '1', '2', '3', '5', '8', '13', '21', '?', '☕'],
  sequencial: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  tshirt: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?'],
};

type PackType = keyof typeof packOptions;

export const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { userName, userRole, setUserRole, isAdm, setIsAdm } = useUser();
  const { connection } = useSignalR();
  const [message, setMessage] = useState("Aguardando eventos...");
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [activePack, setActivePack] = useState<PackType>('fibonacci');
  const [adoWorkItemId, setAdoWorkItemId] = useState('');
  const [loadedWorkItem, setLoadedWorkItem] = useState<AdoWorkItemType | null>(null);
  const [isLoadingItem, setIsLoadingItem] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (!connection || !userName || !roomId) return;
    const user = { userName, roomId, userRole, isAdm };
    connection.invoke("JoinRoom", user)
      .then(() => console.log(`Utilizador ${userName} (${userRole}) entrou na sala ${roomId}. ADM: ${isAdm}`))
      .catch(err => console.error("Erro ao entrar na sala: ", err));
      
    const handleReceiveMessage = (receivedMessage: string) => {
      setMessage(receivedMessage);
    };
    const handleAdminStatusChange = (isAdmin: boolean) => {
      setIsAdm(isAdmin);
    };
    connection.on("ReceiveMessage", handleReceiveMessage);
    connection.on("ReceiveAdminStatus", handleAdminStatusChange);
    
    // connection.on("ReceiveRevealState", (state: boolean) => {
    //   setIsRevealed(state);
    // });
    
    return () => {
      connection.off("ReceiveMessage", handleReceiveMessage);
      connection.off("ReceiveAdminStatus", handleAdminStatusChange);
      // connection.off("ReceiveRevealState");
    };
  }, [connection, userName, roomId, userRole, isAdm, setIsAdm]);

  const handleVote = (vote: string) => {
    if (userRole !== 'votante') return;
    if (selectedVote === vote) {
      setSelectedVote(null);
    } else {
      setSelectedVote(vote);
    }
  };

  const toggleUserRole = () => {
    const newRole = userRole === 'votante' ? 'espectador' : 'votante';
    setUserRole(newRole);
    if (newRole === 'espectador') {
      setSelectedVote(null);
    }
  };
  
  const handlePackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPackName = e.target.value as PackType;
    setActivePack(newPackName);
    setSelectedVote(null); 
    setIsRevealed(false);
  };
  
  const handleLoadWorkItem = async () => {
    if (!adoWorkItemId) return;
    setIsLoadingItem(true);
    setLoadedWorkItem(null);
    setIsRevealed(false);
    
    try {
      const item = await getWorkItemDetails(adoWorkItemId);
      setLoadedWorkItem(item);
    } catch (error) {
      console.error("Erro ao carregar (mock) work item:", error);
    } finally {
      setIsLoadingItem(false);
    }
  };
  
  const handleRevealToggle = () => {
    const newState = !isRevealed;
    setIsRevealed(newState);
    
    // connection?.invoke("ToggleVotes", roomId, newState);
  };

  return (
    <div className="room-layout-container">
      
      <RoomHeader 
        roomId={roomId || '...'} 
        userName={userName || '...'} 
      />

      <main className="room-main-component room-main">
        <VotingStage 
          isRevealed={isRevealed} 
        />
        
        {userRole === 'votante' ? (
          <VotingPack 
            options={packOptions[activePack]}
            selectedValue={selectedVote}
            onVote={handleVote}
          />
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', background: 'var(--color-card-bg)', borderTop: '1px solid var(--color-primary)' }}>
            <h3>Você é um espectador.</h3>
          </div>
        )}
      </main>

      <RoomSidebar
        isAdm={isAdm}
        activePack={activePack}
        onPackChange={handlePackChange}
        adoWorkItemId={adoWorkItemId}
        onAdoIdChange={setAdoWorkItemId}
        onLoadAdoItem={handleLoadWorkItem}
        isLoadingAdoItem={isLoadingItem}
        loadedWorkItem={loadedWorkItem}
        isRevealed={isRevealed}
        onRevealToggle={handleRevealToggle}
      />
      
      <Button 
        onClick={toggleUserRole} 
        style={{ position: 'absolute', bottom: '100px', left: '20px', backgroundColor: '#555' }}
      >
        Mudar para {userRole === 'votante' ? 'Espectador' : 'Votante'}
      </Button>
      
      <div style={{ position: 'absolute', bottom: '10px', left: '20px', background: 'black', color: 'lime', padding: '10px', fontSize: '12px' }}>
        <p>Log: {message}</p>
      </div>

    </div>
  );
};