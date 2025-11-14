import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Crown, Eye, User, Check, Copy, Settings, LogOut, 
  RefreshCw, Play, Trash2, UserCog 
} from 'lucide-react';
import { RoomState, VotePackage } from '../types';
import { signalRService } from '../services/signalRService';

export const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [userName] = useState(() => localStorage.getItem('zava-poker-username') || '');
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [votePackages, setVotePackages] = useState<VotePackage[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!userName || !roomId) {
      navigate('/');
      return;
    }

    setupRoom();
    
    return () => {
      if (userName) {
        signalRService.leaveRoom(userName).catch(console.error);
      }
    };
  }, [roomId, userName, navigate]);

  const setupRoom = async () => {
    try {
      await signalRService.connect();
      
      const packages = await signalRService.getVotePackages();
      setVotePackages(packages);

      signalRService.on('UpdateUserList', handleRoomUpdate);
      signalRService.on('VoteSubmitted', handleRoomUpdate);
      signalRService.on('RoomDestroyed', handleRoomDestroyed);
      
    } catch (error) {
      console.error('Failed to setup room', error);
      alert('Erro ao conectar à sala');
      navigate('/');
    }
  };

  const handleRoomUpdate = (state: RoomState) => {
    console.log('Room state updated:', state);
    setRoomState(state);
  };

  const handleRoomDestroyed = () => {
    alert('Sala encerrada pelo moderador');
    navigate('/');
  };

  const currentUser = roomState?.users.find(u => u.name === userName);
  const isOwner = currentUser?.isOwner || false;
  const isPlayer = currentUser?.role === 'Player';
  const hasVoted = currentUser?.hasVoted || false;

  const handleVote = async (value: string) => {
    if (!isPlayer || !roomId) return;
    
    try {
      setSelectedVote(value);
      await signalRService.submitVote(userName, value);
    } catch (error) {
      console.error('Failed to submit vote', error);
      setSelectedVote(null);
    }
  };

  const handleStartNewRound = async () => {
    if (!roomId) return;
    try {
      setSelectedVote(null);
      await signalRService.startRound(roomId);
    } catch (error) {
      console.error('Failed to start round', error);
    }
  };

  const handleRevealCards = async () => {
    if (!roomId) return;
    try {
      await signalRService.revealCards(roomId);
    } catch (error) {
      console.error('Failed to reveal cards', error);
    }
  };

  const handleToggleRole = async () => {
    if (!roomId) return;
    try {
      await signalRService.changeRole(roomId, userName);
    } catch (error) {
      console.error('Failed to toggle role', error);
    }
  };

  const handleChangeVotePackage = async (packageId: string) => {
    if (!roomId) return;
    try {
      await signalRService.changeVotePackage(roomId, packageId);
      setShowSettings(false);
    } catch (error) {
      console.error('Failed to change vote package', error);
    }
  };

  const handleTransferOwnership = async (newOwnerName: string) => {
    if (!roomId || newOwnerName === userName) return;
    
    if (confirm(`Transferir moderação para ${newOwnerName}?`)) {
      try {
        await signalRService.toggleOwner(roomId, newOwnerName);
      } catch (error) {
        console.error('Failed to transfer ownership', error);
      }
    }
  };

  const handleDestroyRoom = async () => {
    if (!roomId) return;
    
    if (confirm('Tem certeza que deseja encerrar a sala? Todos os participantes serão desconectados.')) {
      try {
        await signalRService.destroyRoom(roomId);
        navigate('/');
      } catch (error) {
        console.error('Failed to destroy room', error);
      }
    }
  };

  const handleLeaveRoom = async () => {
    try {
      await signalRService.leaveRoom(userName);
      navigate('/');
    } catch (error) {
      console.error('Failed to leave room', error);
    }
  };

  const copyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const calculateVoteStats = () => {
    if (!roomState?.areCardsRevealed) return null;
    
    const votes = roomState.users
      .filter(u => u.role === 'Player' && u.vote)
      .map(u => u.vote!);
    
    if (votes.length === 0) return null;

    const voteCounts: Record<string, number> = {};
    votes.forEach(vote => {
      voteCounts[vote] = (voteCounts[vote] || 0) + 1;
    });

    const mostCommon = Object.entries(voteCounts)
      .sort(([, a], [, b]) => b - a)[0];

    return {
      total: votes.length,
      mostCommon: mostCommon[0],
      distribution: voteCounts
    };
  };

  if (!roomState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Conectando à sala...</p>
        </div>
      </div>
    );
  }

  const stats = calculateVoteStats();
  const players = roomState.users.filter(u => u.role === 'Player');
  const spectators = roomState.users.filter(u => u.role === 'Spectator');
  const allVoted = players.length > 0 && players.every(p => p.hasVoted);

  return (
    <div className="min-h-[calc(100vh-180px)] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {roomState.roomName}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <button
                  onClick={copyRoomId}
                  className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <span className="font-mono">{roomId?.slice(0, 8)}...</span>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <span>•</span>
                <span>{roomState.votePackage.name}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleToggleRole}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                {isPlayer ? <Eye className="w-4 h-4" /> : <User className="w-4 h-4" />}
                {isPlayer ? 'Virar Espectador' : 'Virar Jogador'}
              </button>

              {isOwner && (
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Configurações
                </button>
              )}

              <button
                onClick={handleLeaveRoom}
                className="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Voting Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Control Panel (Owner) */}
            {isOwner && (
              <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-5 h-5" />
                  <h2 className="text-xl font-bold">Painel de Moderação</h2>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleStartNewRound}
                    className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Nova Rodada
                  </button>
                  
                  <button
                    onClick={handleRevealCards}
                    disabled={roomState.areCardsRevealed || !allVoted}
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Revelar Votos
                  </button>
                </div>

                {allVoted && !roomState.areCardsRevealed && (
                  <p className="mt-4 text-sm bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    ✅ Todos votaram! Você pode revelar os votos agora.
                  </p>
                )}
              </div>
            )}

            {/* Voting Cards */}
            {isPlayer && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Escolha seu voto
                </h2>
                
                {roomState.areCardsRevealed ? (
                  <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                    Aguarde uma nova rodada para votar
                  </div>
                ) : (
                  <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {roomState.votePackage.items.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleVote(item)}
                        disabled={hasVoted}
                        className={`
                          aspect-[3/4] rounded-xl font-bold text-2xl transition-all transform hover:scale-105 active:scale-95
                          ${selectedVote === item || (hasVoted && currentUser?.vote === item)
                            ? 'bg-gradient-to-br from-primary-600 to-primary-500 text-white shadow-lg ring-4 ring-primary-300 dark:ring-primary-700'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }
                          ${hasVoted ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
                        `}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
                
                {hasVoted && !roomState.areCardsRevealed && (
                  <p className="mt-4 text-center text-sm text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    Voto enviado! Aguardando outros jogadores...
                  </p>
                )}
              </div>
            )}

            {/* Results */}
            {roomState.areCardsRevealed && stats && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Resultados da Votação
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-primary-50 dark:from-gray-700 dark:to-gray-700 rounded-xl p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Mais Votado</p>
                    <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                      {stats.mostCommon}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-700 rounded-xl p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total de Votos</p>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {stats.total}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {Object.entries(stats.distribution)
                    .sort(([, a], [, b]) => b - a)
                    .map(([vote, count]) => (
                      <div key={vote} className="flex items-center gap-3">
                        <span className="w-12 text-lg font-bold text-gray-900 dark:text-white">
                          {vote}
                        </span>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-8 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-primary-600 to-primary-500 h-full flex items-center justify-end px-3 text-white text-sm font-semibold transition-all"
                            style={{ width: `${(count / stats.total) * 100}%` }}
                          >
                            {count > 0 && `${count} voto${count > 1 ? 's' : ''}`}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Participants Sidebar */}
          <div className="space-y-6">
            {/* Players */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Jogadores ({players.length})
              </h2>
              
              <div className="space-y-2">
                {players.map((user) => (
                  <div
                    key={user.userId}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {user.isOwner && <Crown className="w-4 h-4 text-yellow-500" />}
                      <span className={`font-medium ${user.name === userName ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}>
                        {user.name} {user.name === userName && '(você)'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {roomState.areCardsRevealed && user.vote ? (
                        <span className="px-3 py-1 bg-primary-600 text-white rounded-lg font-bold">
                          {user.vote}
                        </span>
                      ) : user.hasVoted ? (
                        <div className="w-8 h-10 bg-gradient-to-br from-primary-600 to-primary-500 rounded shadow-md"></div>
                      ) : (
                        <div className="w-8 h-10 bg-gray-300 dark:bg-gray-600 rounded opacity-30"></div>
                      )}
                      
                      {isOwner && user.name !== userName && (
                        <button
                          onClick={() => handleTransferOwnership(user.name)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                          title="Transferir moderação"
                        >
                          <UserCog className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Spectators */}
            {spectators.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Espectadores ({spectators.length})
                </h2>
                
                <div className="space-y-2">
                  {spectators.map((user) => (
                    <div
                      key={user.userId}
                      className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                    >
                      {user.isOwner && <Crown className="w-4 h-4 text-yellow-500" />}
                      <span className={`font-medium ${user.name === userName ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}>
                        {user.name} {user.name === userName && '(você)'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Configurações da Sala
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Sistema de Votação
                </label>
                <div className="space-y-2">
                  {votePackages.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => handleChangeVotePackage(pkg.id)}
                      className={`w-full p-4 rounded-lg text-left transition-colors ${
                        roomState.votePackage.id === pkg.id
                          ? 'bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-600 dark:border-primary-500'
                          : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">
                        {pkg.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {pkg.items.join(', ')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleDestroyRoom}
                  className="w-full px-4 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Encerrar Sala
                </button>
              </div>

              <button
                onClick={() => setShowSettings(false)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};