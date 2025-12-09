import React from 'react';
import { BondAnalysis, SortConfig } from '../types';
import { Trash2, ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { formatDateLocal } from '../utils/finance';

interface BondTableProps {
  analysisData: BondAnalysis[];
  onRemove: (id: string) => void;
  sortConfig: SortConfig;
  onSort: (key: SortConfig['key']) => void;
}

export const BondTable: React.FC<BondTableProps> = ({ analysisData, onRemove, sortConfig, onSort }) => {
  
  const getSortIcon = (columnKey: SortConfig['key']) => {
    if (sortConfig.key !== columnKey) return <ChevronsUpDown className="w-3 h-3 text-slate-600 print:text-slate-400" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-3 h-3 text-emerald-400 print:text-black" /> 
      : <ArrowDown className="w-3 h-3 text-emerald-400 print:text-black" />;
  };

  const HeaderCell = ({ label, sortKey, align = 'left', className = '' }: { label: string, sortKey?: SortConfig['key'], align?: string, className?: string }) => (
    <th 
      className={`p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'} ${className} ${sortKey ? 'cursor-pointer hover:text-white hover:bg-slate-900 transition-colors select-none print:hover:bg-white print:text-slate-600' : ''}`}
      onClick={() => sortKey && onSort(sortKey)}
    >
      <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'}`}>
        {label}
        {sortKey && <span className="print:hidden">{getSortIcon(sortKey)}</span>}
      </div>
    </th>
  );

  return (
    <div className="overflow-x-auto print:overflow-visible">
      <table className="w-full text-left border-collapse print:border print:border-slate-300">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-950/50 print:bg-slate-100 print:border-slate-300">
            <HeaderCell label="Ticker" sortKey="ticker" className="w-24 print:w-auto" />
            <HeaderCell label="Vencimiento" sortKey="maturityDate" align="center" />
            <HeaderCell label="V. Técnico" sortKey="redemptionValue" align="right" />
            
            {/* Scenarios Headers */}
            <th className="p-4 text-xs font-semibold text-emerald-400/80 uppercase tracking-wider text-right bg-emerald-950/10 border-l border-emerald-900/20 print:bg-white print:text-black print:border-slate-300">
              <div className="flex flex-col items-end">
                <span>Optimista</span>
                <span className="text-[10px] opacity-70 print:text-slate-500">Tasa Baja</span>
              </div>
            </th>
            <th className="p-4 text-xs font-semibold text-blue-400/80 uppercase tracking-wider text-right bg-blue-950/10 border-l border-blue-900/20 border-r print:bg-white print:text-black print:border-slate-300">
              <div className="flex flex-col items-end">
                <span>Objetivo</span>
                <span className="text-[10px] opacity-70 print:text-slate-500">Precio Base</span>
              </div>
            </th>
            <th className="p-4 text-xs font-semibold text-rose-400/80 uppercase tracking-wider text-right bg-rose-950/10 border-r border-rose-900/20 print:bg-white print:text-black print:border-slate-300">
              <div className="flex flex-col items-end">
                <span>Pesimista</span>
                <span className="text-[10px] opacity-70 print:text-slate-500">Tasa Alta</span>
              </div>
            </th>
            
            <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center w-16 print:hidden">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50 print:divide-slate-300">
          {analysisData.map((item) => (
            <tr key={item.bond.id} className="hover:bg-slate-800/30 transition-colors group print:hover:bg-transparent">
              <td className="p-4 print:py-2">
                <div className="font-bold text-white font-mono text-lg print:text-black">{item.bond.ticker}</div>
              </td>
              <td className="p-4 text-center print:py-2">
                <div className="text-sm text-slate-300 print:text-black">{formatDateLocal(item.bond.maturityDate)}</div>
                <div className="text-xs text-slate-500 font-mono mt-0.5 print:text-slate-600">{item.daysToMaturity} días</div>
              </td>
              <td className="p-4 text-right print:py-2">
                <div className="font-mono text-slate-300 font-medium text-lg print:text-black">
                  ${item.bond.redemptionValue.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </td>

              {/* Helper for Price Cell */}
              {['optimistic', 'normal', 'pessimistic'].map((key) => {
                const scenario = item.scenarios[key as keyof typeof item.scenarios];
                const baseColor = key === 'optimistic' ? 'text-emerald-300' : key === 'normal' ? 'text-blue-300' : 'text-rose-300';
                const subColor = key === 'optimistic' ? 'text-emerald-500/60' : key === 'normal' ? 'text-blue-500/60' : 'text-rose-500/60';
                const borderColor = key === 'optimistic' ? 'border-emerald-500/10' : key === 'normal' ? 'border-blue-500/10' : 'border-rose-500/10';
                const bgClass = key === 'optimistic' ? 'bg-emerald-900/5' : key === 'normal' ? 'bg-blue-900/5' : 'bg-rose-900/5';
                
                return (
                  <td key={key} className={`p-4 text-right font-mono ${baseColor} ${bgClass} border-l ${borderColor} ${key === 'normal' ? 'border-r' : ''} print:bg-white print:text-black print:border-slate-300`}>
                    <div className="flex flex-col gap-1.5">
                        {/* CI Section (Primary - Now Top & Large) */}
                        <div className="flex justify-between items-baseline">
                             <span className="text-[9px] font-bold uppercase tracking-wider opacity-60 print:text-slate-500">CI</span>
                             <span className="font-bold text-base print:text-black">
                                ${scenario.priceCI.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                             </span>
                        </div>
                        
                        {/* 24hs Section (Secondary - Now Bottom & Small) */}
                        <div className={`flex justify-between items-baseline pt-1.5 border-t ${borderColor} print:border-slate-200`}>
                            <span className={`text-[9px] font-bold uppercase tracking-wider ${subColor} print:text-slate-500`}>24hs</span>
                            <span className={`text-xs ${subColor} print:text-slate-700`}>
                                ${scenario.price24h.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                    
                    {/* TNA Footer */}
                    <div className={`text-[9px] opacity-40 mt-1.5 text-right w-full print:text-slate-400`}>
                        {(scenario.tna * 100).toFixed(1)}% TNA
                    </div>
                  </td>
                );
              })}

              <td className="p-4 text-center print:hidden">
                <button 
                  onClick={() => onRemove(item.bond.id)}
                  className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-all"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};