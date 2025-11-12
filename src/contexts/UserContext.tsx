// Ficheiro: src/contexts/UserContext.tsx
// (Atualizado para criar e gerir um UserId persistente)

import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'votante' | 'espectador';

interface UserContextType {
  userId: string; // NOVO: O ID persistente
  userName: string;
  setUserName: (name: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAdm: boolean;
  setIsAdm: (isAdmin: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_ID_KEY = 'planning_poker_user_id'; // NOVO
const USER_NAME_KEY = 'planning_poker_user_name';
const USER_ROLE_KEY = 'planning_poker_user_role';
const USER_ADMIN_KEY = 'planning_poker_user_admin';

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // NOVO: Gerar o UserId uma única vez
  const [userId] = useState<string>(() => {
    let storedUserId = sessionStorage.getItem(USER_ID_KEY);
    if (!storedUserId) {
      storedUserId = crypto.randomUUID();
      sessionStorage.setItem(USER_ID_KEY, storedUserId);
    }
    return storedUserId;
  });
  
  const [userName, setUserNameState] = useState<string>(() => {
    return sessionStorage.getItem(USER_NAME_KEY) || '';
  });
  
  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    return (sessionStorage.getItem(USER_ROLE_KEY) as UserRole) || 'votante';
  });
  
  // ATENÇÃO: O 'isAdm' é o único estado que NÃO queremos que
  // seja persistido cegamente. O backend é que deve dizer.
  // Vamos iniciá-lo como 'false' e deixar o backend confirmar.
  const [isAdm, setIsAdmState] = useState<boolean>(false);

  useEffect(() => {
    if (userName) {
      sessionStorage.setItem(USER_NAME_KEY, userName);
    } else {
      sessionStorage.removeItem(USER_NAME_KEY);
    }
  }, [userName]);

  useEffect(() => {
    sessionStorage.setItem(USER_ROLE_KEY, userRole);
  }, [userRole]);
  
  // Vamos guardar o isAdm, mas teremos cuidado
  useEffect(() => {
    sessionStorage.setItem(USER_ADMIN_KEY, String(isAdm));
  }, [isAdm]);

  const setUserName = (name: string) => {
    setUserNameState(name);
  };
  
  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
  };
  
  const setIsAdm = (isAdmin: boolean) => {
    setIsAdmState(isAdmin);
  };

  return (
    <UserContext.Provider value={{ userId, userName, setUserName, userRole, setUserRole, isAdm, setIsAdm }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};