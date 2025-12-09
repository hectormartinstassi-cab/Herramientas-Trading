
import React, { useState } from 'react';
import { BondAnalysis } from '../types';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ReferenceLine } from 'recharts';
import { Filter } from 'lucide-react';

interface ComparisonChartProps {
  analysisData: BondAnalysis[];
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ analysisData }) => {
  const [selectedTicker, setSelectedTicker] = useState<string>('ALL');

  // Transformation: Calculate "Parity %" (Price / RedemptionValue * 100)
  // We use price24h as the standard representation in the chart
  const allData = analysisData.map(item => ({
    ticker: item.bond.ticker,
    days: item.daysToMaturity,
    // Normal Scenario (Bar)
    parityNormal: (item.scenarios.normal.price24h / item.bond.redemptionValue) * 100,
    priceNormal: item.scenarios.normal.price24h,
    
    // Ranges for Lines (dots)
    parityOptimistic: (item.scenarios.optimistic.price24h / item.bond.redemptionValue) * 100,
    priceOptimistic: item.scenarios.optimistic.price24h,
    
    parityPessimistic: (item.scenarios.pessimistic.price24h / item.bond.redemptionValue) * 100,
    pricePessimistic: item.scenarios.pessimistic.price24h,
  }));

  const filteredData = selectedTicker === 'ALL' 
    ? allData 
    : allData.filter(d => d.ticker === selectedTicker);

  const uniqueTickers = Array.from(new Set(allData.map(d => d.ticker))).sort();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs z-50">
          <p className="font-bold text-white mb-2 text-sm">{label} <span className="text-slate-500 font-normal">({data.days}d)</span></p>
          
          <div className="space-y-1">
             <div className="flex justify-between gap-4 text-emerald-400">
              <span>Optimista (24h):</span>
              <span className="font-mono font-bold">${data.priceOptimistic.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4 text-blue-400">
              <span>Objetivo (24h):</span>
              <span className="font-mono font-bold">${data.priceNormal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4 text-rose-400">
              <span>Pesimista (24h):</span>
              <span className="font-mono font-bold">${data.pricePessimistic.toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-700 mt-2 pt-2 flex justify-between gap-4 text-slate-300">
              <span>Paridad Obj:</span>
              <span className="font-mono">{data.parityNormal.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px] flex flex-col">
      <div className="mb-4 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Análisis de Paridad Teórica (24hs)</h3>
            <p className="text-xs text-slate-500 mt-1">
                Precio de entrada (Liq. 24hs) como porcentaje del Valor Técnico.
            </p>
        </div>
        
        {/* Filter Control */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <Filter className="w-4 h-4 text-slate-500 ml-2" />
            <select 
                value={selectedTicker}
                onChange={(e) => setSelectedTicker(e.target.value)}
                className="bg-transparent text-slate-300 text-sm font-medium focus:outline-none p-1.5 rounded hover:bg-slate-900 cursor-pointer"
            >
                <option value="ALL">Mostrar Todos</option>
                <option disabled className="text-slate-700">──────────</option>
                {uniqueTickers.map(ticker => (
                    <option key={ticker} value={ticker}>{ticker}</option>
                ))}
            </select>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={filteredData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
                dataKey="ticker" 
                tick={{ fill: '#94a3b8', fontSize: 11 }} 
                axisLine={{ stroke: '#334155' }}
                tickLine={false}
            />
            <YAxis 
                unit="%" 
                tick={{ fill: '#64748b', fontSize: 11 }} 
                axisLine={false}
                tickLine={false}
                domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b', opacity: 0.4 }} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconSize={8} />
            
            {/* Main Bar: Normal Price Parity */}
            <Bar dataKey="parityNormal" name="Paridad Objetivo" barSize={selectedTicker === 'ALL' ? 30 : 60} fill="#3b82f6" radius={[4, 4, 0, 0]}>
                {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="url(#colorGradient)" />
                ))}
            </Bar>

            {/* Dots for Optimistic/Pessimistic ranges */}
            <Line 
                type="monotone" 
                dataKey="parityOptimistic" 
                name="Tope Optimista" 
                stroke="#10b981" 
                strokeWidth={0} 
                dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} 
                activeDot={{ r: 6 }} 
            />
            <Line 
                type="monotone" 
                dataKey="parityPessimistic" 
                name="Suelo Pesimista" 
                stroke="#e11d48" 
                strokeWidth={0} 
                dot={{ r: 4, fill: '#e11d48', strokeWidth: 0 }} 
                activeDot={{ r: 6 }} 
            />

            <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3}/>
                </linearGradient>
            </defs>
            </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
