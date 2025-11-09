import React from 'react';
import type { AdoWorkItem as AdoWorkItemType } from '../services/adoService';

interface AdoWorkItemProps {
  item: AdoWorkItemType;
}

const getIconType = (type: string) => {
  if (type.toLowerCase().includes('bug')) return 'B';
  if (type.toLowerCase().includes('task')) return 'T';
  return 'P';
};

const getIconClass = (type: string) => {
  if (type.toLowerCase().includes('bug')) return 'bug';
  return '';
};

export const AdoWorkItem: React.FC<AdoWorkItemProps> = ({ item }) => {
  return (
    <div className="ado-card">
      <div className="ado-card-header">
        <span className={`ado-card-type-icon ${getIconClass(item.type)}`}>
          {getIconType(item.type)}
        </span>
        <span className="ado-card-title">
          <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
            {item.type} {item.id}: {item.title}
          </a>
        </span>
      </div>
      <div 
        className="ado-card-description"
        dangerouslySetInnerHTML={{ __html: item.description }}
      />
    </div>
  );
};