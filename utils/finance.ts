import { CalculationMethod } from '../types';

export const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Parsea una fecha string "YYYY-MM-DD" directamente a una fecha local (00:00hs),
 * evitando la conversión a UTC que hacen los navegadores por defecto con new Date("YYYY-MM-DD").
 */
export const parseDateLocal = (dateString: string): Date => {
  if (!dateString) return new Date();
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Formatea la fecha para mostrar en UI usando el locale de Argentina
 */
export const formatDateLocal = (dateString: string): string => {
  if (!dateString) return '-';
  const date = parseDateLocal(dateString);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const calculateDaysToMaturity = (maturityDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const maturity = parseDateLocal(maturityDate);
  
  const diffTime = maturity.getTime() - today.getTime();
  const days = Math.ceil(diffTime / MILLISECONDS_PER_DAY);
  
  return Math.max(0, days);
};

export const calculateTheoreticalPrice = (
  redemptionValue: number,
  tnaPercent: number,
  days: number,
  method: CalculationMethod
): number => {
  const tna = tnaPercent / 100;
  const yearFraction = days / 365;

  if (days <= 0) return redemptionValue;

  if (method === CalculationMethod.SIMPLE) {
    // Descuento Racional Simple (común en Letras de muy corto plazo)
    // P = VF / (1 + i * n)
    return redemptionValue / (1 + (tna * yearFraction));
  } else {
    // Descuento Compuesto
    // P = VF / (1 + i)^n
    return redemptionValue / Math.pow(1 + tna, yearFraction);
  }
};

export const calculateImpliedTNA = (
  marketPrice: number,
  redemptionValue: number,
  days: number,
  method: CalculationMethod
): number => {
  if (days <= 0 || marketPrice <= 0) return 0;
  const yearFraction = days / 365;

  if (method === CalculationMethod.SIMPLE) {
    // i = ((VF / P) - 1) / n
    return ((redemptionValue / marketPrice) - 1) / yearFraction * 100;
  } else {
    // i = ((VF / P)^(1/n)) - 1
    return (Math.pow(redemptionValue / marketPrice, 1 / yearFraction) - 1) * 100;
  }
};