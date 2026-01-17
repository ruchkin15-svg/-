
import React from 'react';
import { BetType } from '../types';

interface ControlsProps {
  onSpin: () => void;
  disabled: boolean;
  selectedBet: BetType | null;
  onBetSelect: (bet: BetType) => void;
}

const Controls: React.FC<ControlsProps> = ({ onSpin, disabled, selectedBet, onBetSelect }) => {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mt-8">
      <div className="text-xl font-bold mb-2 text-yellow-400 uppercase tracking-widest">Выберите ставку</div>
      
      <div className="flex gap-4 w-full">
        <button
          onClick={() => !disabled && onBetSelect(BetType.RED)}
          disabled={disabled}
          className={`flex-1 py-4 rounded-xl border-4 transition-all duration-200 shadow-lg ${
            selectedBet === BetType.RED 
              ? 'bg-red-600 border-yellow-400 scale-105 shadow-red-500/50' 
              : 'bg-red-800 border-transparent hover:bg-red-700 opacity-80 hover:opacity-100'
          } ${disabled ? 'cursor-not-allowed grayscale-[0.5]' : 'cursor-pointer'}`}
        >
          <span className="font-bold text-lg">Красное</span>
        </button>

        <button
          onClick={() => !disabled && onBetSelect(BetType.ZERO)}
          disabled={disabled}
          className={`flex-1 py-4 rounded-xl border-4 transition-all duration-200 shadow-lg ${
            selectedBet === BetType.ZERO 
              ? 'bg-green-600 border-yellow-400 scale-105 shadow-green-500/50' 
              : 'bg-green-800 border-transparent hover:bg-green-700 opacity-80 hover:opacity-100'
          } ${disabled ? 'cursor-not-allowed grayscale-[0.5]' : 'cursor-pointer'}`}
        >
          <span className="font-bold text-lg">Ноль</span>
        </button>

        <button
          onClick={() => !disabled && onBetSelect(BetType.BLACK)}
          disabled={disabled}
          className={`flex-1 py-4 rounded-xl border-4 transition-all duration-200 shadow-lg ${
            selectedBet === BetType.BLACK 
              ? 'bg-zinc-900 border-yellow-400 scale-105 shadow-zinc-500/50' 
              : 'bg-zinc-800 border-transparent hover:bg-zinc-700 opacity-80 hover:opacity-100'
          } ${disabled ? 'cursor-not-allowed grayscale-[0.5]' : 'cursor-pointer'}`}
        >
          <span className="font-bold text-lg">Чёрное</span>
        </button>
      </div>

      <button
        onClick={onSpin}
        disabled={disabled || !selectedBet}
        className={`w-full py-5 px-8 rounded-full font-bold text-2xl uppercase tracking-widest transition-all shadow-xl ${
          disabled || !selectedBet
            ? 'bg-gray-600 cursor-not-allowed opacity-50'
            : 'bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-emerald-900 transform active:scale-95'
        }`}
      >
        {disabled ? 'Вращение...' : 'Старт'}
      </button>
    </div>
  );
};

export default Controls;
