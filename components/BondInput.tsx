
import React, { useState } from 'react';
import { Bond } from '../types';
import { PlusCircle, Calendar, Tag, FileInput } from 'lucide-react';

interface BondInputProps {
  onAddBond: (bond: Bond) => void;
}

export const BondInput: React.FC<BondInputProps> = ({ onAddBond }) => {
  const [ticker, setTicker] = useState('');
  const [maturityDate, setMaturityDate] = useState('');
  const [redemptionValue, setRedemptionValue] = useState('100');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker || !maturityDate) return;

    onAddBond({
      id: crypto.randomUUID(),
      ticker: ticker.toUpperCase(),
      maturityDate,
      redemptionValue: Number(redemptionValue),
    });

    setTicker('');
    // Keep date and redemption as they might be similar for next entry
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden print:hidden">
        {/* Background accent */}
        <div className="absolute top-0 left-0 w-1 h-full bg-slate-700"></div>

      <div className="flex flex-col mb-4 pl-3">
        <h3 className="text-white font-medium flex items-center gap-2">
            <FileInput className="w-4 h-4 text-slate-400" />
            Agregar Título a la Cartera
        </h3>
        <p className="text-xs text-slate-500 mt-1">Ingresa el Valor Técnico para calcular su precio hoy según las tasas definidas arriba.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end w-full pl-3">
        <div className="w-full md:w-1/3">
          <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
            <Tag className="w-3 h-3" /> Ticker
          </label>
          <input
            type="text"
            placeholder="EJ: S31M4"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-slate-500 outline-none placeholder:text-slate-700 uppercase"
          />
        </div>

        <div className="w-full md:w-1/3">
          <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Vencimiento
          </label>
          <input
            type="date"
            value={maturityDate}
            onChange={(e) => setMaturityDate(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-slate-500 outline-none [color-scheme:dark]"
          />
        </div>

        <div className="w-full md:w-1/3">
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Valor Técnico al Vencimiento (VF)
          </label>
          <input
            type="number"
            step="0.01"
            value={redemptionValue}
            onChange={(e) => setRedemptionValue(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-slate-500 outline-none text-right font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={!ticker || !maturityDate}
          className="w-full md:w-auto px-6 py-2 bg-slate-100 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 min-w-[120px]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Agregar</span>
        </button>
      </div>
    </form>
  );
};
