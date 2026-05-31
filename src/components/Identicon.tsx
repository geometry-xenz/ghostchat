/**
 * GhostChat — Identicon Generator (Pro)
 */

import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';

/** Professional, muted color palette */
const PALETTE = [
  '#007aff', '#30d158', '#ff3b30', '#5856d6', '#ff9500',
  '#ffcc00', '#af52de', '#5ac8fa', '#0040dd', '#1d1d1f',
  '#3a3a3c', '#48484a', '#636366', '#8e8e93', '#aeaeb2',
];

interface IdenticonProps {
  peerId: string;
  size?: number;
  className?: string;
}

export function Identicon({ peerId, size = 40, className = '' }: IdenticonProps) {
  const hash = bytesToHex(sha256(new TextEncoder().encode(peerId)));
  const colors = getColors(hash);
  const pattern = getPattern(hash);
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      className={`rounded-full flex-shrink-0 shadow-apple ${className}`}
    >
      {/* Background */}
      <rect width="10" height="10" fill={colors.bg} />
      
      {/* Symmetric 5x5 pattern */}
      {pattern.map((row, y) =>
        row.map((active, x) =>
          active ? (
            <rect
              key={`${x}-${y}`}
              x={x * 2}
              y={y * 2}
              width="2"
              height="2"
              fill={colors.fg}
              opacity={0.9}
            />
          ) : null
        )
      )}
    </svg>
  );
}

function getColors(hash: string): { bg: string; fg: string } {
  const bgIdx = parseInt(hash.slice(0, 2), 16) % PALETTE.length;
  let fgIdx = (parseInt(hash.slice(2, 4), 16) % (PALETTE.length - 1) + bgIdx + 1) % PALETTE.length;
  
  // Ensure background isn't too dark or too light for the foreground
  return {
    bg: PALETTE[bgIdx] + '20', // 12% opacity background
    fg: PALETTE[fgIdx],
  };
}

function getPattern(hash: string): boolean[][] {
  const grid: boolean[][] = [];
  
  for (let y = 0; y < 5; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < 5; x++) {
      const mirrorX = x <= 2 ? x : 4 - x;
      const idx = y * 3 + mirrorX;
      const charIdx = (idx * 2 + 4) % hash.length;
      row.push(parseInt(hash[charIdx], 16) > 8);
    }
    grid.push(row);
  }
  
  return grid;
}
