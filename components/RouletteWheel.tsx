
import React from 'react';
import { FULL_ROULETTE } from '../constants';

interface RouletteWheelProps {
  rotation: number;
}

const RouletteWheel: React.FC<RouletteWheelProps> = ({ rotation }) => {
  const radius = 150;
  const center = 160;

  return (
    <div className="relative w-80 h-80 md:w-[450px] md:h-[450px] mx-auto transition-all duration-500">
      {/* Golden Outer Frame */}
      <div className="absolute inset-0 rounded-full border-[12px] border-yellow-700 bg-yellow-800 shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-0"></div>
      
      {/* Shadow layer for depth */}
      <div className="absolute inset-[12px] rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] z-10 pointer-events-none"></div>

      {/* The Spinning Wheel */}
      <svg
        viewBox="0 0 320 320"
        className="absolute inset-[12px] w-[calc(100%-24px)] h-[calc(100%-24px)] transition-transform duration-[5000ms] ease-[cubic-bezier(0.15,0,0.15,1)]"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <g transform={`translate(${center}, ${center})`}>
          {FULL_ROULETTE.map((item, i) => {
            // Центрируем 0-й индекс ровно вверху (угол -90 в SVG)
            const sectorAngle = 360 / 37;
            const startAngle = (i * sectorAngle) - 90 - (sectorAngle / 2);
            const endAngle = startAngle + sectorAngle;
            
            const x1 = radius * Math.cos((startAngle * Math.PI) / 180);
            const y1 = radius * Math.sin((startAngle * Math.PI) / 180);
            const x2 = radius * Math.cos((endAngle * Math.PI) / 180);
            const y2 = radius * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArcFlag = 0;
            const pathData = `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            const textAngle = startAngle + (sectorAngle / 2);
            const tx = (radius - 22) * Math.cos((textAngle * Math.PI) / 180);
            const ty = (radius - 22) * Math.sin((textAngle * Math.PI) / 180);

            return (
              <g key={`${item.number}-${i}`}>
                <path
                  d={pathData}
                  fill={item.color === 'red' ? '#c21111' : item.color === 'black' ? '#0a0a0a' : '#0e7d37'}
                  stroke="#854d0e"
                  strokeWidth="0.4"
                />
                <text
                  x={tx}
                  y={ty}
                  fill="white"
                  fontSize="7.5"
                  fontFamily="Montserrat"
                  fontWeight="900"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  transform={`rotate(${textAngle + 90}, ${tx}, ${ty})`}
                >
                  {item.number}
                </text>
              </g>
            );
          })}
        </g>
        
        {/* Hub Decoration */}
        <circle cx={center} cy={center} r="45" fill="url(#hubGradient)" stroke="#854d0e" strokeWidth="1" />
        <defs>
          <radialGradient id="hubGradient">
            <stop offset="0%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#854d0e" />
          </radialGradient>
        </defs>
      </svg>

      {/* Static Indicator (Pointer) */}
      <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-30 drop-shadow-lg">
        <svg width="40" height="50" viewBox="0 0 40 50">
          <path d="M 20 50 L 0 0 L 40 0 Z" fill="#fbbf24" stroke="#854d0e" strokeWidth="2" />
        </svg>
      </div>
      
      {/* Decorative center cap */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-700 border-2 border-yellow-800 shadow-xl z-20 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-yellow-100/30"></div>
      </div>
    </div>
  );
};

export default RouletteWheel;
