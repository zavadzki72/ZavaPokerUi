# 🎴 Zava Poker - Frontend

Frontend moderno para Planning Poker desenvolvido com React, TypeScript e SignalR.

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool ultrarrápido
- **TailwindCSS** - Framework CSS utilitário
- **SignalR** - Comunicação em tempo real
- **React Router** - Roteamento
- **Lucide React** - Ícones

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Backend Zava Poker rodando em `http://localhost:5290`

## 🔧 Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview
```

## 🌐 Configuração da API

Por padrão, o frontend se conecta ao backend em `http://localhost:5290/zava-hub`.

Para alterar a URL, edite o arquivo `src/services/signalRService.ts`:

```typescript
this.connection = new signalR.HubConnectionBuilder()
  .withUrl('SUA_URL_AQUI/zava-hub')
  // ...
```

## 🎯 Funcionalidades

### Home Page
- Landing page atrativa com apresentação do produto
- Modal para criar nova sala
- Modal para entrar em sala existente
- Seleção de pacotes de votação (Fibonacci, Sequencial, T-Shirt)

### Sala de Votação
- Interface em tempo real com SignalR
- Sistema de votação com cartas visuais
- Revelação de votos com estatísticas
- Painel de moderação para o dono da sala
- Lista de participantes (jogadores e espectadores)
- Troca de papel (jogador/espectador)
- Transferência de moderação
- Alteração de pacote de votação
- Gerenciamento de rodadas

### Recursos Comuns
- **Dark Mode** - Tema claro/escuro com persistência
- **Header** - Navegação e controle de tema
- **Footer** - Informações e links
- **Design Responsivo** - Funciona em todos os dispositivos
- **Logs Detalhados** - Console com emojis para debugging

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Header.tsx      # Cabeçalho com navegação
│   └── Footer.tsx      # Rodapé
├── contexts/           # Context API
│   └── ThemeContext.tsx # Gerenciamento de tema
├── pages/              # Páginas da aplicação
│   ├── Home.tsx        # Landing page
│   └── Room.tsx        # Sala de votação
├── services/           # Serviços e integrações
│   └── signalRService.ts # Cliente SignalR
├── types/              # Definições TypeScript
│   └── index.ts        # Interfaces e tipos
├── App.tsx             # Componente raiz
├── main.tsx            # Entry point
└── index.css           # Estilos globais
```

## 🔄 Fluxo de Comunicação SignalR

### Eventos do Cliente → Servidor
- `GetVotePackages()` - Obter pacotes de votação disponíveis
- `CreateRoom()` - Criar nova sala
- `JoinRoom()` - Entrar em sala
- `LeaveRoom()` - Sair da sala
- `StartRound()` - Iniciar nova rodada
- `SubmitVote()` - Enviar voto
- `RevealCards()` - Revelar cartas
- `DestroyRoom()` - Encerrar sala
- `ToggleOwner()` - Transferir moderação
- `ChangeRole()` - Trocar papel (jogador/espectador)
- `ChangeVotePackage()` - Alterar pacote de votação

### Eventos do Servidor → Cliente
- `UpdateUserList` - Atualização completa do estado da sala
- `VoteSubmitted` - Notificação de voto enviado
- `RoomDestroyed` - Sala foi encerrada
- `OwnerToggled` - Moderação foi transferida
- `RoleChanged` - Papel de usuário alterado

## 🎨 Design System

### Cores Principais
- **Primary**: Azul (#0ea5e9) - Ações principais
- **Success**: Verde - Confirmações
- **Warning**: Amarelo - Alertas
- **Danger**: Vermelho - Ações destrutivas

### Componentes
- Botões com estados hover e disabled
- Cards com sombras e bordas arredondadas
- Modais com backdrop blur
- Animações suaves (fade-in, slide-up)
- Gradientes para elementos de destaque

## 📱 Responsividade

O layout se adapta automaticamente para:
- **Mobile** (< 768px) - Layout vertical, menu simplificado
- **Tablet** (768px - 1024px) - Layout híbrido
- **Desktop** (> 1024px) - Layout completo com sidebar

## 🐛 Debugging

Todos os eventos SignalR são logados no console com emojis para fácil identificação:

- 📤 Eventos enviados ao servidor
- 📥 Eventos recebidos do servidor
- ✅ Conexões bem-sucedidas
- ❌ Erros
- ⚠️ Avisos

## 🚧 Melhorias Futuras

- [ ] Testes unitários e E2E
- [ ] PWA (Progressive Web App)
- [ ] Histórico de votações
- [ ] Export de resultados (CSV/JSON)
- [ ] Integração com Jira/Azure DevOps
- [ ] Timer para votações
- [ ] Chat integrado
- [ ] Áudio de notificações
- [ ] Analytics de uso

## 📝 Notas de Desenvolvimento

### Código Limpo
- Componentes funcionais com hooks
- TypeScript para type safety
- Nomes descritivos e auto-explicativos
- Comentários apenas quando necessário
- Separação clara de responsabilidades

### Performance
- Lazy loading de rotas
- Memoização de componentes pesados
- Debounce em inputs
- Virtual scrolling para listas grandes

### Acessibilidade
- Semântica HTML correta
- Labels em todos os inputs
- Keyboard navigation
- Contraste adequado (WCAG AA)
- Screen reader friendly

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido por **Zavadzki** com ❤️

---

**Nota**: Certifique-se de que o backend está rodando antes de iniciar o frontend!