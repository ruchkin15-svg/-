
import React, { useState, useCallback, useRef } from 'react';
import RouletteWheel from './components/RouletteWheel';
import Controls from './components/Controls';
import ResultModal from './components/ResultModal';
import SettingsModal from './components/SettingsModal';
import { BetType, SpinResult } from './types';
import { FULL_ROULETTE, MIN_REVOLUTIONS, SPIN_DURATION } from './constants';
import { audioManager } from './utils/audio';

const App: React.FC = () => {
  const [selectedBet, setSelectedBet] = useState<BetType | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [winProbability, setWinProbability] = useState(33); 
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const currentRotationRef = useRef(0);

  /**
   * Функция проверки выигрыша сектора относительно ставки.
   */
  const checkIsWinningSector = (bet: BetType, sector: typeof FULL_ROULETTE[0]) => {
    if (bet === BetType.RED) return sector.color === 'red';
    if (bet === BetType.BLACK) return sector.color === 'black';
    if (bet === BetType.ZERO) return sector.color === 'green' && sector.number === 0;
    return false;
  };

  const handleSpin = useCallback(() => {
    if (isSpinning || !selectedBet) return;

    // Фиксируем текущие настройки в локальных переменных, чтобы они не изменились во время анимации
    const currentBet = selectedBet;
    const currentProb = winProbability;

    setIsSpinning(true);
    setSpinResult(null);

    // 1. Решаем исход: победа или поражение
    const shouldWin = (Math.random() * 100) < currentProb;
    
    // 2. Отбираем сектора, которые подходят под решение
    const eligibleSectors = FULL_ROULETTE.filter(sector => {
      const isMatch = checkIsWinningSector(currentBet, sector);
      return shouldWin ? isMatch : !isMatch;
    });

    // 3. Выбираем конкретный сектор из списка разрешенных
    const winningItem = eligibleSectors[Math.floor(Math.random() * eligibleSectors.length)];
    const winningIndex = FULL_ROULETTE.findIndex(item => item.number === winningItem.number);

    // 4. Расчет угла вращения
    const baseRotation = Math.ceil(currentRotationRef.current / 360) * 360;
    const extraRevolutions = (MIN_REVOLUTIONS + Math.floor(Math.random() * 3)) * 360;
    const targetRotation = baseRotation + extraRevolutions + (360 - winningItem.angle);
    
    setRotation(targetRotation);
    currentRotationRef.current = targetRotation;

    // 5. Звук (тики)
    let tickCount = 0;
    const totalSectors = (targetRotation - (currentRotationRef.current - extraRevolutions - (360 - winningItem.angle))) / (360 / 37);
    const startTime = Date.now();

    const playTicks = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / SPIN_DURATION;
      if (progress < 1) {
        const currentTick = Math.floor(totalSectors * (1 - Math.pow(1 - progress, 3)));
        if (currentTick > tickCount) {
          audioManager.playTick();
          tickCount = currentTick;
        }
        requestAnimationFrame(playTicks);
      }
    };
    playTicks();

    // 6. Завершение анимации
    setTimeout(() => {
      setIsSpinning(false);
      
      // Итоговая сверка
      const finalIsWin = checkIsWinningSector(currentBet, winningItem);

      setSpinResult({
        number: winningItem.number,
        color: winningItem.color,
        isWin: finalIsWin
      });

      if (finalIsWin) {
        audioManager.playWin();
      } else {
        audioManager.playLoss();
      }
    }, SPIN_DURATION);

  }, [isSpinning, selectedBet, winProbability]);

  const handleCloseModal = () => {
    setSpinResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden bg-[#064e3b]">
      {/* Кнопка настроек */}
      <button 
        onClick={() => !isSpinning && setIsSettingsOpen(true)}
        disabled={isSpinning}
        className={`absolute top-6 right-6 p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors z-20 group border border-white/5 ${isSpinning ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500/30 group-hover:text-yellow-500 transition-colors">
          <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </button>

      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-400 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-600 rounded-full blur-[140px]"></div>
      </div>

      <div className="z-10 w-full max-w-4xl flex flex-col items-center">
        <header className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-yellow-500 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] mb-2 tracking-tighter uppercase">
            Рулетка Скидок
          </h1>
          {/* Надпись удалена по запросу пользователя */}
        </header>

        <main className="w-full flex flex-col items-center gap-8">
          <RouletteWheel rotation={rotation} />
          
          <Controls 
            onSpin={handleSpin} 
            disabled={isSpinning} 
            selectedBet={selectedBet} 
            onBetSelect={setSelectedBet}
          />
        </main>

        <footer className="mt-12 text-emerald-400/30 text-[9px] uppercase tracking-[0.4em] font-bold text-center">
          Система верифицирована • Точность 100%<br/>
          Casino Interactive Studio • 2025
        </footer>
      </div>

      <ResultModal result={spinResult} onClose={handleCloseModal} />
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        winProbability={winProbability}
        setWinProbability={setWinProbability}
      />
    </div>
  );
};

export default App;
