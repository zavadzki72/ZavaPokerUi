import React from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { AdoWorkItem } from './AdoWorkItem';
import { type AdoWorkItem as AdoWorkItemType } from '../services/adoService';

type PackType = 'fibonacci' | 'sequencial' | 'tshirt';

interface RoomSidebarProps {
  isAdm: boolean;
  activePack: PackType;
  onPackChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  adoWorkItemId: string;
  onAdoIdChange: (value: string) => void;
  onLoadAdoItem: () => void;
  isLoadingAdoItem: boolean;
  loadedWorkItem: AdoWorkItemType | null;
  isRevealed: boolean;
  onRevealToggle: () => void;
}

export const RoomSidebar: React.FC<RoomSidebarProps> = ({
  isAdm,
  activePack,
  onPackChange,
  adoWorkItemId,
  onAdoIdChange,
  onLoadAdoItem,
  isLoadingAdoItem,
  loadedWorkItem,
  isRevealed,
  onRevealToggle,
}) => {
  
  const AdminPanel = () => (
    <div className="sidebar-section">
      <h4>Painel do Administrador</h4>
      
      <Button 
        onClick={onRevealToggle} 
        style={{ width: '100%', marginBottom: '15px' }}
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
        {isAdm && (
          <div style={{ marginBottom: '15px' }}>
            <Input
              label="ID do Work Item:"
              value={adoWorkItemId}
              onChange={(e) => onAdoIdChange(e.target.value)}
              placeholder="Digite o ID do Item"
            />
            <Button onClick={onLoadAdoItem} disabled={isLoadingAdoItem} style={{ width: '100%', marginTop: '10px' }}>
              {isLoadingAdoItem ? 'A carregar...' : 'Carregar Item'}
            </Button>
          </div>
        )}
        
        {isLoadingAdoItem && <p>A carregar item...</p>}
        {loadedWorkItem ? (
          <AdoWorkItem item={loadedWorkItem} />
        ) : (
          <p>Nenhum item carregado.</p>
        )}
      </div>

      <div className="sidebar-section">
        <h4>Participantes</h4>
        <p>(Em breve...)</p>
      </div>
    </aside>
  );
};