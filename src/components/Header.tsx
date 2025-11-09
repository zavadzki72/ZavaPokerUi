import React from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="home-header">
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="logo-container">
          <span style={{ fontSize: '24px', marginRight: '10px' }}>🃏</span>
          <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
            Planning Poker
          </span>
        </div>
      </Link>
      <ThemeSwitcher />
    </header>
  );
};