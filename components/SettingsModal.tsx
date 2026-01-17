
import React from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  winProbability: number;
  setWinProbability: (val: number) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, winProbability, setWinProbability }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-emerald-900 border-2 border-yellow-600/50 rounded-3xl p-8 max-w-sm w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-yellow-500 uppercase tracking-wider">Параметры системы</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-emerald-100 mb-4 uppercase tracking-tighter">
              Шанс выигрыша: <span className="text-yellow-400 text-lg">{winProbability}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={winProbability}
              onChange={(e) => setWinProbability(parseInt(e.target.value))}
              className="w-full h-2 bg-emerald-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
            <div className="flex justify-between mt-2 text-[10px] text-emerald-500 uppercase">
              <span>Честный 0%</span>
              <span>Гарантия 100%</span>
            </div>
          </div>

          <div className="p-4 bg-emerald-950/50 rounded-xl border border-emerald-800">
            <p className="text-xs text-emerald-400 leading-relaxed italic">
              * Данный параметр принудительно устанавливает вероятность того, что шарик остановится на секторе, соответствующем выбранной ставке.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 py-3 bg-yellow-600 hover:bg-yellow-500 text-emerald-950 font-bold rounded-xl transition-colors uppercase tracking-widest text-sm"
        >
          Применить настройки
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
