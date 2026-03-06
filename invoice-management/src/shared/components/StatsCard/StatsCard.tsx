import React from 'react';
import './StatsCard.css';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export default function StatsCard({ label, value, icon, trend }: StatsCardProps) {
  return (
    <div className="stats-card">
      {icon && <div className="stats-icon">{icon}</div>}
      <div className="stats-content">
        <p className="stats-label">{label}</p>
        <p className="stats-value">{value}</p>
      </div>
      {trend && <div className={`stats-trend trend-${trend}`}></div>}
    </div>
  );
}
