import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Users, Zap, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { signalRService } from '../services/signalRService';
import { VotePackage } from '../types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [votePackages, setVotePackages] = useState<VotePackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  
  const [createForm, setCreateForm] = useState({
    roomName: '',
    userName: '',
    votePackageId: ''
  });
  
  const [joinForm, setJoinForm] = useState({
    roomId: '',
    userName: ''
  });

  useEffect(() => {
    loadVotePackages();
  }, []);

  const loadVotePackages = async () => {
    try {
      await signalRService.connect();
      const packages = await signalRService.getVotePackages();
      setVotePackages(packages);
      if (packages.length > 0) {
        setCreateForm(prev => ({ ...prev, votePackageId: packages[0].id }));
      }
    } catch (error) {
      console.error('Failed to load vote packages', error);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const roomId = await signalRService.createRoom(
        createForm.roomName,
        createForm.votePackageId,
        createForm.userName
      );
      
      localStorage.setItem('zava-poker-username', createForm.userName);
      navigate(`/room/${roomId}`);
    } catch (error: any) {
      alert(error.message || 'Erro ao criar sala');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signalRService.joinRoom(joinForm.roomId, joinForm.userName);
      localStorage.setItem('zava-poker-username', joinForm.userName);
      navigate(`/room/${joinForm.roomId}`);
    } catch (error: any) {
      alert(error.message || 'Erro ao entrar na sala');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-180px)] flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-16 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                Planning Poker Simplificado
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-slide-up">
              Estime projetos com sua equipe em
              <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent"> tempo real</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto animate-slide-up">
              Facilite suas sessões de planning poker com uma interface intuitiva, 
              colaboração em tempo real e recursos pensados para times ágeis.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Criar Nova Sala
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => setShowJoinModal(true)}
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-semibold border-2 border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500 transition-all flex items-center justify-center gap-2"
              >
                <Users className="w-5 h-5" />
                Entrar em Sala
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Por que escolher o Zava Poker?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Recursos pensados para tornar suas estimativas mais eficientes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-primary-50 dark:from-gray-800 dark:to-gray-800 border border-blue-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Rápido e Simples
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Crie salas instantaneamente sem cadastro. Compartilhe o link e comece a estimar.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800 border border-purple-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Colaboração Real
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sincronização em tempo real com SignalR. Todos veem as atualizações instantaneamente.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 border border-green-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Flexível
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Escolha entre Fibonacci, Sequencial ou T-Shirt Sizes. Adapte às suas necessidades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Criar Nova Sala
            </h2>
            
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome da Sala
                </label>
                <input
                  type="text"
                  required
                  value={createForm.roomName}
                  onChange={(e) => setCreateForm({ ...createForm, roomName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Sprint Planning - Time Alpha"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Seu Nome
                </label>
                <input
                  type="text"
                  required
                  value={createForm.userName}
                  onChange={(e) => setCreateForm({ ...createForm, userName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="João Silva"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sistema de Votação
                </label>
                <select
                  value={createForm.votePackageId}
                  onChange={(e) => setCreateForm({ ...createForm, votePackageId: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {votePackages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} ({pkg.items.join(', ')})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold hover:from-primary-700 hover:to-primary-600 transition-all disabled:opacity-50"
                >
                  {loading ? 'Criando...' : 'Criar Sala'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Entrar em Sala
            </h2>
            
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ID da Sala
                </label>
                <input
                  type="text"
                  required
                  value={joinForm.roomId}
                  onChange={(e) => setJoinForm({ ...joinForm, roomId: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="00000000-0000-0000-0000-000000000000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Seu Nome
                </label>
                <input
                  type="text"
                  required
                  value={joinForm.userName}
                  onChange={(e) => setJoinForm({ ...joinForm, userName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Maria Santos"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold hover:from-primary-700 hover:to-primary-600 transition-all disabled:opacity-50"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};