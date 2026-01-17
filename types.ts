
export enum BetType {
  RED = 'RED',
  BLACK = 'BLACK',
  ZERO = 'ZERO'
}

export interface RouletteNumber {
  number: number;
  color: 'red' | 'black' | 'green';
  angle: number;
}

export interface SpinResult {
  number: number;
  color: 'red' | 'black' | 'green';
  isWin: boolean;
}
