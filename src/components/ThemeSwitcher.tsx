import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './Button';

export const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      onClick={toggleTheme} 
      style={{ position: 'absolute', top: '20px', right: '20px' }}
    >
      Mudar para {theme === 'light' ? 'Dark' : 'Light'}
    </Button>
  );
};