
import React from 'react';
import { ScenarioParams } from '../types';
import { TrendingUp, TrendingDown, Target, Activity } from 'lucide-react';

interface ScenarioControlsProps {
  params: ScenarioParams;
  setParams: React.Dispatch<React.SetStateAction<ScenarioParams>>;
}

export const ScenarioControls: React.FC<ScenarioControlsProps> = ({ params, setParams }) => {
  // Helper para actualizar un campo especifico
  const updateParam = (field: keyof ScenarioParams, value: string) => {
    setParams(prev => ({ ...prev, [field]: Number(value) }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-in fade-in slide-in-from-top-4 duration-500 print:hidden">
      {/* TNA Target - Main Driver */}
      <div className="bg-slate-900 border border-blue-900/40 rounded-xl p-5 relative overflow-hidden group shadow-lg shadow-blue-900/5 hover:border-blue-500/30 transition-all">
        <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
           <Target className="w-20 h-20 text-blue-400" />
        </div>
        
        <label className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
          <Target className="w-4 h-4" />
          TNA Objetivo (Escenario Base)
        </label>
        
        <div className="relative flex items-center">
          <input
            type="number"
            step="0.5"
            value={params.targetTNA}
            onChange={(e) => updateParam('targetTNA', e.target.value)}
            className="w-full bg-transparent text-4xl font-mono font-bold text-white outline-none z-10 placeholder-slate-700"
          />
          <span className="text-slate-500 font-medium text-xl absolute right-0">%</span>
        </div>
        
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <Activity className="w-3 h-3" />
          <span>Rendimiento anual esperado</span>
        </div>
      </div>

      {/* Optimistic Spread */}
      <div className="bg-slate-900 border border-emerald-900/40 rounded-xl p-5 relative overflow-hidden group shadow-lg shadow-emerald-900/5 hover:border-emerald-500/30 transition-all">
        <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
           <TrendingUp className="w-20 h-20 text-emerald-400" />
        </div>
        
        <label className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Spread Optimista (Baja Tasa)
        </label>
        
        <div className="relative flex items-center gap-2">
           <span className="text-emerald-500 text-2xl font-bold">-</span>
          <input
            type="number"
             step="0.5"
            value={params.optimisticSpread}
            onChange={(e) => updateParam('optimisticSpread', e.target.value)}
            className="w-full bg-transparent text-3xl font-mono font-bold text-white outline-none z-10"
          />
           <span className="text-slate-500 font-medium text-lg absolute right-0">pts</span>
        </div>
        
         <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-500">TNA Resultante:</span>
            <span className="bg-emerald-950/40 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold border border-emerald-900/30">
                {(params.targetTNA - params.optimisticSpread).toFixed(2)}%
            </span>
         </div>
      </div>

      {/* Pessimistic Spread */}
      <div className="bg-slate-900 border border-rose-900/40 rounded-xl p-5 relative overflow-hidden group shadow-lg shadow-rose-900/5 hover:border-rose-500/30 transition-all">
         <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
           <TrendingDown className="w-20 h-20 text-rose-400" />
        </div>
        
        <label className="text-rose-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
          <TrendingDown className="w-4 h-4" />
          Spread Pesimista (Sube Tasa)
        </label>
        
        <div className="relative flex items-center gap-2">
          <span className="text-rose-500 text-2xl font-bold">+</span>
          <input
            type="number"
             step="0.5"
            value={params.pessimisticSpread}
            onChange={(e) => updateParam('pessimisticSpread', e.target.value)}
            className="w-full bg-transparent text-3xl font-mono font-bold text-white outline-none z-10"
          />
          <span className="text-slate-500 font-medium text-lg absolute right-0">pts</span>
        </div>
        
        <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-500">TNA Resultante:</span>
            <span className="bg-rose-950/40 text-rose-400 px-2 py-0.5 rounded font-mono font-bold border border-rose-900/30">
                {(params.targetTNA + params.pessimisticSpread).toFixed(2)}%
            </span>
         </div>
      </div>
    </div>
  );
};
