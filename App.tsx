
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { SettingsPanel } from './components/SettingsPanel';
import { BondInput } from './components/BondInput';
import { BondTable } from './components/BondTable';
import { ComparisonChart } from './components/ComparisonChart';
import { ScenarioControls } from './components/ScenarioControls';
import { Bond, ScenarioParams, CalculationMethod, BondAnalysis, SortConfig } from './types';
import { calculateDaysToMaturity, calculateTheoreticalPrice } from './utils/finance';
import { AlertCircle, LayoutDashboard, Download, Upload, Printer } from 'lucide-react';

const DEFAULT_PARAMS: ScenarioParams = {
  targetTNA: 45.0,
  pessimisticSpread: 5.0,
  optimisticSpread: 5.0,
  method: CalculationMethod.COMPOUND
};

export default function App() {
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [params, setParams] = useState<ScenarioParams>(DEFAULT_PARAMS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Sorting State
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'maturityDate', 
    direction: 'asc'
  });

  // --- Persistence Logic ---
  useEffect(() => {
    const savedPortfolio = localStorage.getItem('argBondPortfolio');
    if (savedPortfolio) {
      try {
        setBonds(JSON.parse(savedPortfolio));
      } catch (e) {
        console.error("Error parsing saved portfolio", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('argBondPortfolio', JSON.stringify(bonds));
  }, [bonds]);

  // --- Handlers ---
  const handleAddBond = (newBond: Bond) => {
    setBonds(prev => [...prev, newBond]);
  };

  const handleRemoveBond = (id: string) => {
    setBonds(prev => prev.filter(b => b.id !== id));
  };

  const handleSort = (key: SortConfig['key']) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleExportPortfolio = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bonds));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "cartera_bonos.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = e.target?.result;
        if (typeof json === 'string') {
          const parsedBonds = JSON.parse(json);
          if (Array.isArray(parsedBonds)) {
             // Basic validation could be improved
            setBonds(parsedBonds);
          }
        }
      } catch (error) {
        console.error("Error reading file", error);
        alert("Error al leer el archivo. Asegúrate que sea un JSON válido.");
      }
    };
    reader.readAsText(fileObj);
    // Reset input
    event.target.value = '';
  };

  const handlePrint = () => {
    window.print();
  };

  // --- Calculation Engine ---
  const analysisResults: BondAnalysis[] = useMemo(() => {
    const sortedBonds = [...bonds].sort((a, b) => {
      let comparison = 0;
      switch (sortConfig.key) {
        case 'ticker':
          comparison = a.ticker.localeCompare(b.ticker);
          break;
        case 'maturityDate':
        case 'daysToMaturity':
          comparison = new Date(a.maturityDate).getTime() - new Date(b.maturityDate).getTime();
          break;
        case 'redemptionValue':
          comparison = a.redemptionValue - b.redemptionValue;
          break;
        default:
          comparison = 0;
      }
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return sortedBonds.map(bond => {
      const days = calculateDaysToMaturity(bond.maturityDate);
      
      // Settlement Logic
      const daysCI = days; // T+0
      const days24h = Math.max(0, days - 1); // T+1 (approx)
      
      const calcScenario = (targetTna: number, label: string) => {
        return {
          tna: targetTna / 100,
          price24h: calculateTheoreticalPrice(bond.redemptionValue, targetTna, days24h, params.method),
          priceCI: calculateTheoreticalPrice(bond.redemptionValue, targetTna, daysCI, params.method),
          label
        };
      };

      const normal = calcScenario(params.targetTNA, 'Normal (Objetivo)');
      const pessimistic = calcScenario(params.targetTNA + params.pessimisticSpread, 'Pesimista (+Tasa)');
      const optimistic = calcScenario(params.targetTNA - params.optimisticSpread, 'Optimista (-Tasa)');
      
      return {
        bond,
        daysToMaturity: days,
        theoreticalPrice: normal.price24h,
        scenarios: {
          pessimistic,
          normal,
          optimistic
        }
      };
    });
  }, [bonds, params, sortConfig]);

  return (
    <div className="min-h-screen pb-20 bg-slate-950 print:bg-white print:text-black print:pb-0">
      <div className="print:hidden">
        <DashboardHeader onOpenSettings={() => setIsSettingsOpen(true)} />
      </div>
      
      <main className="max-w-7xl mx-auto px-4 py-8 print:p-0 print:max-w-none">
        
        {/* Global Controls Section */}
        <section className="mb-8 print:hidden">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 px-1">
              Definición de Escenarios de Rendimiento
            </h2>
            <ScenarioControls params={params} setParams={setParams} />
        </section>

        {/* Input Section */}
        <div className="print:hidden">
            <BondInput onAddBond={handleAddBond} />
        </div>

        {/* Results Section */}
        <div className="space-y-6 mt-8 print:mt-0 print:space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:border-b-2 print:border-black print:pb-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 print:text-black">
              <LayoutDashboard className="w-5 h-5 text-emerald-400 print:hidden" />
              Tablero de Precios Sugeridos
              <span className="hidden print:inline text-sm font-normal ml-2">- Generado el {new Date().toLocaleDateString()}</span>
            </h2>
            
            {/* Action Toolbar */}
            <div className="flex items-center gap-2 print:hidden">
               <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".json" 
                  className="hidden" 
                />
               <button 
                onClick={handleImportClick}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
                title="Cargar Cartera desde archivo"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Importar</span>
              </button>

              <button 
                onClick={handleExportPortfolio}
                disabled={bonds.length === 0}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700 disabled:opacity-50"
                title="Guardar Cartera actual"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Guardar</span>
              </button>
              
              <div className="h-4 w-px bg-slate-800 mx-1"></div>

              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors font-semibold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir</span>
              </button>
            </div>
            <div className="hidden print:block text-sm text-black">
                {bonds.length} instrumentos
            </div>
          </div>

          {bonds.length === 0 ? (
            <div className="text-center py-24 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 print:border-slate-300">
              <div className="inline-flex p-4 bg-slate-800 rounded-full mb-4 ring-1 ring-slate-700 print:hidden">
                <AlertCircle className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-xl font-medium text-slate-300 print:text-black">Cartera Vacía</h3>
              <p className="text-slate-500 max-w-md mx-auto mt-2 text-sm leading-relaxed print:text-slate-600">
                Agrega instrumentos usando el panel superior para generar la tabla de precios.
              </p>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 print:space-y-0 print:block">
              {/* Chart Section - Hidden on Print */}
              <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl overflow-hidden relative print:hidden">
                <ComparisonChart analysisData={analysisResults} />
              </section>

              {/* Table Section */}
              <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl print:shadow-none print:border-none print:bg-white print:rounded-none">
                <BondTable 
                  analysisData={analysisResults} 
                  onRemove={handleRemoveBond}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
              </section>
            </div>
          )}
        </div>
      </main>

      <div className="print:hidden">
        <SettingsPanel 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)} 
            params={params}
            setParams={setParams}
        />
      </div>
    </div>
  );
}
