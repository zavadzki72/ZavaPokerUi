import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import { UserProvider } from './contexts/UserContext.tsx'
import { SignalRProvider } from './contexts/SignalRContext.tsx'

import './styles/themes.css'
import './styles/global.css'
import './styles/VoteCard.css'
import './styles/AdoWorkItem.css'
import './styles/HomePage.css'
import './styles/RoomLayout.css'
import './styles/RoomHeader.css'
import './styles/RoomSidebar.css'
import './styles/VotingStage.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <UserProvider>
        <SignalRProvider>
          <App />
        </SignalRProvider>
      </UserProvider>
    </ThemeProvider>
  </React.StrictMode>,
)