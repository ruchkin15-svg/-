
import React from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  winProbability: number;
  setWinProbability: (val: number) => void;
  avgDiscountLimit: number;
  setAvgDiscountLimit: (val: number) => void;
  currentAverage: number;
  historyCount: number;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  winProbability, 
  setWinProbability,
  avgDiscountLimit,
  setAvgDiscountLimit,
  currentAverage,
  historyCount
}) => {
  if (!isOpen) return null;

  // Рассчитываем цвет индикатора нагрузки
  const getLoadColor = () => {
    const ratio = currentAverage / avgDiscountLimit;
    if (ratio < 0.7) return 'text-green-400';
    if (ratio < 0.9) return 'text-yellow-400';
    return 'text-red-500';
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-emerald-900 border-2 border-yellow-600/50 rounded-3xl p-8 max-w-sm w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-yellow-500 uppercase tracking-wider">Параметры системы</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="space-y-8">
          {/* Шанс выигрыша */}
          <div>
            <label className="block text-xs font-bold text-emerald-100 mb-4 uppercase tracking-widest flex justify-between">
              Вероятность победы <span>{winProbability}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={winProbability}
              onChange={(e) => setWinProbability(parseInt(e.target.value))}
              className="w-full h-1.5 bg-emerald-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
          </div>

          {/* Лимит средней скидки */}
          <div>
            <label className="block text-xs font-bold text-emerald-100 mb-4 uppercase tracking-widest flex justify-between">
              Лимит средней скидки <span>{avgDiscountLimit}%</span>
            </label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={avgDiscountLimit}
              onChange={(e) => setAvgDiscountLimit(parseInt(e.target.value))}
              className="w-full h-1.5 bg-emerald-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <p className="mt-2 text-[10px] text-emerald-500 leading-tight">
              За каждые 100 запусков система не выдаст суммарно более этого значения в среднем.
            </p>
          </div>

          {/* Статистика */}
          <div className="p-4 bg-emerald-950/80 rounded-2xl border border-emerald-800/50">
            <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3">Текущая аналитика</h3>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] text-emerald-600 uppercase">Среднее (last {historyCount})</p>
                <p className={`text-2xl font-black ${getLoadColor()}`}>{currentAverage}%</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-emerald-600 uppercase">Статус</p>
                <p className={`text-xs font-bold uppercase ${currentAverage >= avgDiscountLimit ? 'text-red-500' : 'text-emerald-400'}`}>
                  {currentAverage >= avgDiscountLimit ? 'Бюджет исчерпан' : 'В норме'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 py-4 bg-gradient-to-b from-yellow-500 to-yellow-700 hover:from-yellow-400 text-emerald-950 font-black rounded-xl transition-all uppercase tracking-widest text-xs shadow-lg active:scale-95"
        >
          Сохранить конфигурацию
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
