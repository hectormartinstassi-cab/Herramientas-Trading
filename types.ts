
export interface Bond {
  id: string;
  ticker: string;
  maturityDate: string; // YYYY-MM-DD
  redemptionValue: number; // Valor Técnico al Vencimiento (VF)
}

export enum CalculationMethod {
  SIMPLE = 'Simple (Lineal)',
  COMPOUND = 'Compuesto (Exponencial)',
}

export interface ScenarioParams {
  targetTNA: number; // Tasa Nominal Anual Objetivo (%)
  pessimisticSpread: number; // Spread TNA para escenario pesimista (puntos porcentuales)
  optimisticSpread: number; // Spread TNA para escenario optimista (puntos porcentuales)
  method: CalculationMethod;
}

export interface BondAnalysis {
  bond: Bond;
  daysToMaturity: number;
  theoreticalPrice: number; // Precio Base (Normal) - Deprecated reference, prefer scenario values
  scenarios: {
    pessimistic: ScenarioResult;
    normal: ScenarioResult;
    optimistic: ScenarioResult;
  };
}

export interface ScenarioResult {
  tna: number;
  price24h: number;
  priceCI: number;
  label: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: keyof Bond | 'daysToMaturity';
  direction: SortDirection;
}
