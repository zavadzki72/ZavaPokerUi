import React from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { AdoWorkItem } from './AdoWorkItem';
// Importa os tipos
import { type Participant } from '../types/participant'; 
import { type AdoWorkItem as AdoWorkItemType } from '../types/adoWorkItem'; 

// --- Estilos ---
const participantListStyles: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
};

const participantItemStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '5px 0',
  borderBottom: '1px solid var(--color-background)',
};

const voteStatusStyles: React.CSSProperties = {
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  backgroundColor: 'var(--color-primary)',
  opacity: 0.3,
  display: 'inline-block',
  textAlign: 'center',
  color: 'white',
  lineHeight: '20px',
  fontSize: '12px'
};

const adminButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: '0 5px',
  cursor: 'pointer',
  fontSize: '1.2em',
};
// --- Fim Estilos ---

type PackType = 'fibonacci' | 'sequencial' | 'tshirt';

interface RoomSidebarProps {
  isAdm: boolean;
  myUserId: string; // O seu próprio UserId
  activePack: PackType;
  onPackChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  adoWorkItemId: string;
  onAdoIdChange: (value: string) => void;
  onLoadAdoItem: () => void;
  onClearAdoItem: () => void; // Para limpar o item ADO
  isLoadingAdoItem: boolean;
  loadedWorkItem: AdoWorkItemType | null; 
  isRevealed: boolean;
  onRevealToggle: () => void;
  participants: Participant[]; 
  onTransferAdmin: (userId: string) => void; // Envia o UserId
}

export const RoomSidebar: React.FC<RoomSidebarProps> = ({
  isAdm,
  myUserId,
  activePack,
  onPackChange,
  adoWorkItemId,
  onAdoIdChange,
  onLoadAdoItem,
  onClearAdoItem,
  isLoadingAdoItem,
  loadedWorkItem,
  isRevealed,
  onRevealToggle,
  participants,
  onTransferAdmin,
}) => {
  
  // Lógica para desativar "Revelar Votos" se ninguém votou
  const hasVotes = participants.some(p => p.role === 'votante' && p.hasVoted);
  const revealButtonDisabled = !isRevealed && !hasVotes;
  
  const AdminPanel = () => (
    <div className="sidebar-section">
      <h4>Painel do Administrador</h4>
      
      <Button 
        onClick={onRevealToggle} 
        style={{ width: '100%', marginBottom: '15px' }}
        disabled={revealButtonDisabled}
      >
        {isRevealed ? 'Iniciar Novo Voto' : 'Revelar Votos'}
      </Button>
      
      <div>
        <label>Pacote de Votação:</label>
        <select
          value={activePack}
          onChange={onPackChange}
          style={{ width: '100%', padding: '8px', background: 'var(--color-card-bg)', color: 'var(--color-text)', border: '1px solid var(--color-primary)', borderRadius: '4px', marginTop: '5px' }}
        >
          <option value="fibonacci">Fibonacci</option>
          <option value="sequencial">Sequencial</option>
          <option value="tshirt">T-Shirt Sizes</option>
        </select>
      </div>
    </div>
  );

  return (
    <aside className="room-sidebar-component room-sidebar">
      {isAdm && <AdminPanel />}

      <div className="sidebar-section">
        <h4>Item em Votação (ADO)</h4>
        
        {/* Painel de carregar item (só Admin) */}
        {isAdm && (
          <div style={{ marginBottom: '15px' }}>
            <Input
              label="ID do Work Item:"
              value={adoWorkItemId}
              onChange={(e) => onAdoIdChange(e.target.value)}
              placeholder="Digite o ID do Item"
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <Button onClick={onLoadAdoItem} disabled={isLoadingAdoItem} style={{ width: '100%' }}>
                {isLoadingAdoItem ? 'A carregar...' : 'Carregar Item'}
              </Button>
              <Button 
                onClick={onClearAdoItem} 
                disabled={isLoadingAdoItem || !loadedWorkItem} 
                style={{ width: 'auto', background: '#555' }} 
                title="Limpar Item"
              >
                X
              </Button>
            </div>
          </div>
        )}
        
        {/* Item carregado (para todos) */}
        {isLoadingAdoItem && <p>A carregar item...</p>}
        {loadedWorkItem ? (
          <AdoWorkItem item={loadedWorkItem} />
        ) : (
          <p>Nenhum item carregado.</p>
        )}
      </div>

      {/* Lista de Participantes */}
      <div className="sidebar-section">
        <h4>Participantes ({participants.length})</h4>
        <ul style={participantListStyles}>
          {participants.map((p) => (
            <li key={p.userId} style={participantItemStyles}> {/* Key é o UserId */ }
              <span>
                {p.isAdm ? '👑' : (p.role === 'espectador' ? '👁️' : '👤')} {p.name}
                
                {/* Lógica para "Passar o Bastão" (R5) */}
                {isAdm && // Se eu sou Admin
                  p.userId !== myUserId && // E não sou eu mesmo
                  p.role === 'espectador' && // E o alvo é um espectador
                  (
                  <button 
                    style={adminButtonStyle} 
                    title={`Tornar ${p.name} Administrador`}
                    onClick={() => onTransferAdmin(p.userId)} // Envia o UserId
                  >
                    🚀
                  </button>
                )}
              </span>
              
              {/* Status do Voto */}
              {p.role === 'votante' && (
                isRevealed ? (
                  <span style={{ ...voteStatusStyles, opacity: 1, width: 'auto', padding: '0 5px' }}>
                    {p.vote || '-'}
                  </span>
                ) : (
                  <span style={{ ...voteStatusStyles, opacity: p.hasVoted ? 1 : 0.3 }}>
                    {p.hasVoted ? '✓' : ''}
                  </span>
                )
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};