
import React, { useState, useCallback, useRef, useMemo } from 'react';
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
  const [avgDiscountLimit, setAvgDiscountLimit] = useState(20); // Лимит средней скидки
  const [spinHistory, setSpinHistory] = useState<number[]>([]); // История скидок (0 для проигрыша)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const currentRotationRef = useRef(0);

  // Расчет текущей средней скидки за последние 100 спинов
  const currentAverage = useMemo(() => {
    if (spinHistory.length === 0) return 0;
    const sum = spinHistory.reduce((a, b) => a + b, 0);
    return parseFloat((sum / spinHistory.length).toFixed(1));
  }, [spinHistory]);

  const checkIsWinningSector = (bet: BetType, sector: typeof FULL_ROULETTE[0]) => {
    if (bet === BetType.RED) return sector.color === 'red';
    if (bet === BetType.BLACK) return sector.color === 'black';
    if (bet === BetType.ZERO) return sector.color === 'green' && sector.number === 0;
    return false;
  };

  const handleSpin = useCallback(() => {
    if (isSpinning || !selectedBet) return;

    const currentBet = selectedBet;
    const currentProb = winProbability;
    const currentLimit = avgDiscountLimit;

    setIsSpinning(true);
    setSpinResult(null);

    // 1. Предварительный расчет "шанса на победу"
    const randomWinTrigger = (Math.random() * 100) < currentProb;
    
    // 2. ФИЛЬТРАЦИЯ ПО ЛИМИТУ СРЕДНЕЙ СКИДКИ
    // Мы должны найти такие сектора, которые не выведут среднее за пределы лимита
    const historySum = spinHistory.reduce((a, b) => a + b, 0);
    const historyCount = spinHistory.length;
    // Если история заполнена (100), убираем самый старый элемент для расчета будущего среднего
    const compensation = historyCount >= 100 ? spinHistory[0] : 0;

    const safeWinningSectors = FULL_ROULETTE.filter(sector => {
      const isMatch = checkIsWinningSector(currentBet, sector);
      if (!isMatch) return false;

      // Оцениваем "стоимость" сектора. Зеро считаем как 99% скидку для мат. модели
      const discountValue = (sector.number === 0 && sector.color === 'green') ? 99 : sector.number;
      
      const projectedSum = historySum + discountValue - compensation;
      const projectedAvg = projectedSum / Math.min(historyCount + 1, 100);
      
      return projectedAvg <= currentLimit;
    });

    // 3. Финальное решение о победе
    // Игрок выигрывает только если: 
    // а) Рандом разрешил 
    // б) Есть хотя бы один сектор, не нарушающий финансовый лимит
    const canActuallyWin = randomWinTrigger && safeWinningSectors.length > 0;
    
    const eligibleSectors = canActuallyWin 
      ? safeWinningSectors 
      : FULL_ROULETTE.filter(s => !checkIsWinningSector(currentBet, s));

    const winningItem = eligibleSectors[Math.floor(Math.random() * eligibleSectors.length)];
    
    // 4. Расчет физики вращения
    const baseRotation = Math.ceil(currentRotationRef.current / 360) * 360;
    const extraRevolutions = (MIN_REVOLUTIONS + Math.floor(Math.random() * 2)) * 360;
    const targetRotation = baseRotation + extraRevolutions + (360 - winningItem.angle);
    
    setRotation(targetRotation);
    currentRotationRef.current = targetRotation;

    // 5. Тики звука
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

    // 6. Завершение
    setTimeout(() => {
      setIsSpinning(false);
      const finalIsWin = checkIsWinningSector(currentBet, winningItem);
      
      // Добавляем результат в историю (лимит 100 записей)
      const discountForHistory = finalIsWin ? (winningItem.number === 0 ? 99 : winningItem.number) : 0;
      setSpinHistory(prev => {
        const next = [...prev, discountForHistory];
        return next.length > 100 ? next.slice(1) : next;
      });

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

  }, [isSpinning, selectedBet, winProbability, avgDiscountLimit, spinHistory]);

  const handleCloseModal = () => {
    setSpinResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden bg-[#064e3b]">
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
          Система верифицирована • Контроль бюджета активен<br/>
          Casino Interactive Studio • 2025
        </footer>
      </div>

      <ResultModal result={spinResult} onClose={handleCloseModal} />
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        winProbability={winProbability}
        setWinProbability={setWinProbability}
        avgDiscountLimit={avgDiscountLimit}
        setAvgDiscountLimit={setAvgDiscountLimit}
        currentAverage={currentAverage}
        historyCount={spinHistory.length}
      />
    </div>
  );
};

export default App;
