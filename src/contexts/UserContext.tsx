import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'votante' | 'espectador';

interface UserContextType {
  userName: string;
  setUserName: (name: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAdm: boolean;
  setIsAdm: (isAdmin: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_NAME_KEY = 'planning_poker_user_name';
const USER_ROLE_KEY = 'planning_poker_user_role';
const USER_ADMIN_KEY = 'planning_poker_user_admin';

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userName, setUserNameState] = useState<string>(() => {
    return sessionStorage.getItem(USER_NAME_KEY) || '';
  });
  
  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    return (sessionStorage.getItem(USER_ROLE_KEY) as UserRole) || 'votante';
  });
  
  const [isAdm, setIsAdmState] = useState<boolean>(() => {
    return sessionStorage.getItem(USER_ADMIN_KEY) === 'true';
  });

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
    <UserContext.Provider value={{ userName, setUserName, userRole, setUserRole, isAdm, setIsAdm }}>
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