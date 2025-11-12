import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useSignalR } from '../contexts/SignalRContext';
import { Button } from '../components/Button';
import { VotingPack } from '../components/VotingPack';
import { RoomHeader } from '../components/RoomHeader';
import { RoomSidebar } from '../components/RoomSidebar';
import { VotingStage } from '../components/VotingStage';
import { type Participant } from '../types/participant'; 
// Importa o tipo ADO do único sítio correto
import { type AdoWorkItem as AdoWorkItemType } from '../types/adoWorkItem'; 

const packOptions = {
  fibonacci: ['0', '1', '2', '3', '5', '8', '13', '21', '?', '☕'],
  sequencial: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  tshirt: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?'],
};

type PackType = keyof typeof packOptions;

export const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate(); 
  const { userId, userName, userRole, setUserRole, isAdm, setIsAdm } = useUser();
  const { connection } = useSignalR();
  
  // --- Estados ---
  const [message, setMessage] = useState("Aguardando eventos...");
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [activePack, setActivePack] = useState<PackType>('fibonacci');
  const [adoWorkItemId, setAdoWorkItemId] = useState('');
  const [loadedWorkItem, setLoadedWorkItem] = useState<AdoWorkItemType | null>(null);
  const [isLoadingItem, setIsLoadingItem] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);

  // Efeito 1: Guarda de Autenticação (Verifica se o utilizador tem ID e Nome)
  useEffect(() => {
    if (!userName || !userId) {
      navigate('/');
    }
  }, [userName, userId, navigate]); 
  
  // Efeito 2: Lógica da Sala (O mais importante)
  useEffect(() => {
    // Aguarda que tudo esteja pronto
    if (!connection || !userName || !roomId || !userId) {
      return; 
    }
    
    // --- 1. REGISTAR OS LISTENERS PRIMEIRO ---
    
    const handleReceiveMessage = (receivedMessage: string) => { setMessage(receivedMessage); };
    const handleAdminStatusChange = (isAdmin: boolean) => { setIsAdm(isAdmin); };
    const handleParticipantList = (participantsList: Participant[]) => { setParticipants(participantsList); };
    
    const handleRevealState = (state: boolean) => {
      setIsRevealed(state);
      if (state === false) {
        setSelectedVote(null);
      }
    };
    
    const handleReceiveVotePack = (packName: PackType) => {
      setActivePack(packName);
    };
    
    const handleReceiveWorkItem = (item: AdoWorkItemType | null) => {
      setLoadedWorkItem(item); 
      setIsLoadingItem(false); 
      if (item === null) {
        setAdoWorkItemId(''); 
      }
    };
    
    connection.on("ReceiveMessage", handleReceiveMessage);
    connection.on("ReceiveAdminStatus", handleAdminStatusChange);
    connection.on("ReceiveRevealState", handleRevealState);
    connection.on("UpdateUserList", handleParticipantList); 
    connection.on("ReceiveVotePack", handleReceiveVotePack); 
    connection.on("ReceiveWorkItem", handleReceiveWorkItem); 

    
    // --- 2. INVOCAR O 'JoinRoom' DEPOIS ---
    
    const user = { userId, userName, roomId, userRole };
    connection.invoke("JoinRoom", user)
      .catch(err => console.error("Erro ao entrar na sala: ", err));
    
    
    // --- 3. FUNÇÃO DE LIMPEZA (CLEANUP) ---
    return () => {
      connection.off("ReceiveMessage", handleReceiveMessage);
      connection.off("ReceiveAdminStatus", handleAdminStatusChange);
      connection.off("ReceiveRevealState", handleRevealState);
      connection.off("UpdateUserList", handleParticipantList);
      connection.off("ReceiveVotePack", handleReceiveVotePack); 
      connection.off("ReceiveWorkItem", handleReceiveWorkItem); 
    };
    
    // CORREÇÃO DO LOOP INFINITO: 'isAdm' foi removido deste array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, userName, roomId, userRole, userId, setIsAdm, navigate]); 
  
  
  // --- Handlers ---

  const handleVote = (vote: string) => {
    if (userRole !== 'votante' || !connection) return; 
    let newVote: string | null = vote;
    if (selectedVote === vote) newVote = null; 
    setSelectedVote(newVote); 
    if (roomId) {
      connection.invoke("SubmitVote", roomId, newVote)
        .catch(err => console.error("Erro ao enviar voto: ", err));
    }
  };

  const toggleUserRole = () => {
    const newRole = userRole === 'votante' ? 'espectador' : 'votante';
    setUserRole(newRole); 
    if (newRole === 'espectador') {
      setSelectedVote(null);
    }
    if (connection && roomId) {
      connection.invoke("ChangeRole", roomId, newRole)
        .catch(err => console.error("Erro ao mudar de role: ", err));
    }
  };
  
  const handlePackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPackName = e.target.value as PackType;
    if (connection && roomId) {
      connection.invoke("ChangeVotePack", roomId, newPackName)
        .catch(err => console.error("Erro ao mudar o pack: ", err));
    }
  };
  
  const handleLoadWorkItem = async () => {
    if (!adoWorkItemId || !connection || !roomId) return;
    setIsLoadingItem(true); 
    connection.invoke("LoadWorkItem", roomId, adoWorkItemId)
      .catch(err => {
        console.error("Erro ao carregar item: ", err);
        setIsLoadingItem(false); 
      });
  };

  const handleClearWorkItem = () => {
    if (connection && roomId) {
      connection.invoke("ClearWorkItem", roomId)
        .catch(err => console.error("Erro ao limpar item: ", err));
    }
  };
  
  const handleRevealToggle = () => {
    if (connection && roomId) {
      connection.invoke("ToggleVotes", roomId)
        .catch(err => console.error("Erro ao alternar votos: ", err));
    }
  };
  
  // Envia o UserId do alvo
  const handleTransferAdmin = (newAdminUserId: string) => {
    if (connection && roomId) {
      connection.invoke("TransferAdmin", roomId, newAdminUserId)
        .catch(err => console.error("Erro ao transferir admin: ", err));
    }
  };

  // Renderização
  if (!userName) {
    return <div>A carregar...</div>;
  }

  return (
    <div className="room-layout-container">
      
      <RoomHeader 
        roomId={roomId || '...'} 
        userName={userName || '...'} 
      />

      <main className="room-main-component room-main">
        <VotingStage 
          isRevealed={isRevealed} 
          participants={participants}
          activePack={activePack} 
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
        myUserId={userId} // Passa o seu próprio ID
        activePack={activePack}
        onPackChange={handlePackChange}
        adoWorkItemId={adoWorkItemId}
        onAdoIdChange={setAdoWorkItemId}
        onLoadAdoItem={handleLoadWorkItem}
        onClearAdoItem={handleClearWorkItem} 
        isLoadingAdoItem={isLoadingItem}
        loadedWorkItem={loadedWorkItem}
        isRevealed={isRevealed}
        onRevealToggle={handleRevealToggle}
        participants={participants}
        onTransferAdmin={handleTransferAdmin} 
      />
      
      <Button 
        onClick={toggleUserRole} 
        style={{ position: 'absolute', bottom: '100px', left: '20px', backgroundColor: '#555' }}
      >
        Mudar para {userRole === 'votante' ? 'Espectador' : 'Votante'}
      </Button>
      
       <div style={{ position: 'absolute', bottom: '10px', left: '20px', background: 'black', color: 'lime', padding: '10px', fontSize: '12px', zIndex: 100 }}>
        <p>Log: {message}</p>
        <p>Estou Admin? {isAdm ? 'Sim' : 'Não'}</p> 
      </div>

    </div>
  );
};