
import { RouletteNumber } from './types';

/**
 * Последовательность чисел на колесе европейской рулетки (по часовой стрелке)
 */
export const ROULETTE_NUMBERS_ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

/**
 * Определение цвета числа по правилам классической рулетки
 * 1-10 и 19-28: Нечетные - красные, Четные - черные
 * 11-18 и 29-36: Нечетные - черные, Четные - красные
 */
export const getNumberColor = (num: number): 'red' | 'black' | 'green' => {
  if (num === 0) return 'green';
  
  const redNumbers = [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36
  ];
  
  return redNumbers.includes(num) ? 'red' : 'black';
};

export const FULL_ROULETTE: RouletteNumber[] = ROULETTE_NUMBERS_ORDER.map((num, index) => ({
  number: num,
  color: getNumberColor(num),
  angle: (index * 360) / 37
}));

export const SPIN_DURATION = 5000; 
export const MIN_REVOLUTIONS = 5;
