import React, { createContext, useContext, useState, useEffect } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

interface SignalRContextType {
  connection: HubConnection | null;
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    const hubUrl = import.meta.env.VITE_SIGNALR_HUB_URL;

    if (!hubUrl) {
      console.error("VITE_SIGNALR_HUB_URL não está definida no .env.development");
      return;
    }

    const newConnection = new HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    // NÃO faças setConnection(newConnection) aqui.
    // Isso é que causa a race condition.

    newConnection.start()
      .then(() => {
        console.log('SignalR Conectado!');
        // SÓ DEPOIS de estar ligado é que o fornecemos ao React.
        setConnection(newConnection);
      })
      .catch(err => console.error('Falha na conexão com SignalR: ', err));

    return () => {
      // Garante que a ligação é fechada quando o provider é desmontado
      newConnection.stop();
    };
  }, []); // O array vazio [] garante que isto só corre UMA VEZ.

  return (
    <SignalRContext.Provider value={{ connection }}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => {
  const context = useContext(SignalRContext);
  if (context === undefined) {
    throw new Error('useSignalR must be used within a SignalRProvider');
  }
  return context;
};