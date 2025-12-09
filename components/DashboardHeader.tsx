
import React from 'react';
import { TrendingUp, Settings } from 'lucide-react';

interface DashboardHeaderProps {
  onOpenSettings: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="flex items-center justify-between p-6 bg-slate-900 border-b border-slate-800 print:hidden">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <TrendingUp className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">ArgBond Analytics</h1>
          <p className="text-sm text-slate-400">Renta Fija Argentina - Corto Plazo</p>
        </div>
      </div>
      <button 
        onClick={onOpenSettings}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700"
      >
        <Settings className="w-4 h-4" />
        <span>Configuración</span>
      </button>
    </header>
  );
};
