import React from 'react';
import { CalculationMethod, ScenarioParams } from '../types';
import { X, Calculator } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  params: ScenarioParams;
  setParams: React.Dispatch<React.SetStateAction<ScenarioParams>>;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, params, setParams }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Calculator className="w-4 h-4 text-slate-400" />
            Configuración Avanzada
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Method */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-3">
              Fórmula de Valoración (Descuento)
            </label>
            <div className="grid grid-cols-1 gap-2">
              {Object.values(CalculationMethod).map((method) => (
                <button
                  key={method}
                  onClick={() => setParams(prev => ({ ...prev, method }))}
                  className={`px-4 py-3 rounded-lg text-sm font-medium text-left transition-all border flex items-center justify-between group ${
                    params.method === method
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600 hover:bg-slate-800/50'
                  }`}
                >
                  <span>{method}</span>
                  {params.method === method && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              El descuento compuesto es estándar para bonos. El simple se suele usar para Letras de muy corto plazo.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-800/30">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};