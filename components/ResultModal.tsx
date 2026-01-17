
import React from 'react';
import { SpinResult } from '../types';

interface ResultModalProps {
  result: SpinResult | null;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ result, onClose }) => {
  if (!result) return null;

  const getColorName = (color: string) => {
    switch (color) {
      case 'red': return 'красное';
      case 'black': return 'чёрное';
      case 'green': return 'зелёное (ЗЕРО)';
      default: return '';
    }
  };

  // Джекпот: Игрок ставил на Ноль и шарик остановился на 0
  const isZeroWin = result.isWin && result.number === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg transition-opacity duration-300">
      <div className={`bg-emerald-950 border-4 ${isZeroWin ? 'border-green-400 animate-pulse shadow-[0_0_100px_rgba(74,222,128,0.5)]' : result.isWin ? 'border-yellow-500 shadow-[0_0_80px_rgba(234,179,8,0.3)]' : 'border-red-900/50 shadow-2xl'} rounded-[2.5rem] p-8 max-w-sm w-full text-center animate-in fade-in zoom-in duration-300 relative overflow-hidden`}>
        
        {/* Декоративный блеск для выигрыша */}
        {result.isWin && (
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        )}

        <div className="mb-6 relative z-10">
          {result.isWin ? (
            <div className="text-7xl mb-4 animate-bounce">🎰</div>
          ) : (
            <div className="text-7xl mb-4 opacity-50">💔</div>
          )}
          <h2 className={`text-4xl font-black mb-2 uppercase tracking-tighter ${isZeroWin ? 'text-green-400' : result.isWin ? 'text-yellow-400' : 'text-emerald-100/40'}`}>
            {isZeroWin ? 'ДЖЕКПОТ!' : result.isWin ? 'ПОБЕДА!' : 'Мимо...'}
          </h2>
        </div>

        <div className="text-xl mb-8 leading-relaxed relative z-10">
          {isZeroWin ? (
            <div className="flex flex-col items-center">
              <div className="text-6xl font-black text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.8)] mb-4 leading-none">
                1 РУБЛЬ!
              </div>
              <p className="text-xl font-bold text-white mb-2 leading-tight">
                Вы угадали Ноль!
              </p>
              <p className="text-sm text-emerald-100/70 italic">
                Ваша покупка теперь стоит символический 1 рубль.
              </p>
            </div>
          ) : result.isWin ? (
            <div className="flex flex-col items-center">
              {/* Скидка всегда совпадает с числом сектора */}
              <div className="relative inline-block mb-4">
                <span className="text-9xl font-black text-yellow-500 leading-none">
                  {result.number}
                </span>
                <span className="text-4xl font-bold text-yellow-500 absolute -top-2 -right-10">%</span>
              </div>
              <p className="text-2xl font-bold text-white mb-2 leading-tight">
                Ваша персональная скидка!
              </p>
              <p className="text-xs text-emerald-100/50 uppercase tracking-widest">
                Сектор {result.number} ({getColorName(result.color)})
              </p>
            </div>
          ) : (
            <div>
              <p className="text-2xl font-bold text-emerald-100/80 mb-2">
                Повезёт в любви!
              </p>
              <p className="text-sm text-emerald-100/30">
                Выпало {result.number} ({getColorName(result.color)})
              </p>
              <p className="text-xs mt-4 text-yellow-500/50 italic">
                Попробуйте сменить стратегию!
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className={`w-full py-5 px-6 relative z-10 ${isZeroWin ? 'bg-green-500 hover:bg-green-400' : result.isWin ? 'bg-gradient-to-b from-yellow-400 to-yellow-600 hover:scale-[1.02]' : 'bg-white/5 hover:bg-white/10 text-emerald-100'} text-emerald-950 font-black rounded-2xl transition-all active:scale-95 uppercase tracking-widest shadow-xl`}
        >
          {result.isWin ? 'Забрать бонус' : 'Попробовать еще'}
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
