import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  delay: number;
}

interface ConfettiProps {
  isActive: boolean;
  onComplete?: () => void;
}

const COLORS = [
  'hsl(217, 91%, 60%)',  // Blue
  'hsl(262, 83%, 58%)',  // Purple
  'hsl(142, 71%, 45%)',  // Green
  'hsl(45, 93%, 47%)',   // Yellow
  'hsl(340, 82%, 52%)',  // Pink
];

export function Confetti({ isActive, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isActive) {
      const newPieces: ConfettiPiece[] = [];
      for (let i = 0; i < 50; i++) {
        newPieces.push({
          id: i,
          x: Math.random() * 200 - 100,
          y: -(Math.random() * 200 + 100),
          rotation: Math.random() * 720 - 360,
          scale: Math.random() * 0.5 + 0.5,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          delay: Math.random() * 0.3,
        });
      }
      setPieces(newPieces);

      const timer = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute bottom-20 right-20">
        <AnimatePresence>
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute h-3 w-3 rounded-sm"
              style={{ backgroundColor: piece.color }}
              initial={{
                x: 0,
                y: 0,
                rotate: 0,
                scale: piece.scale,
                opacity: 1,
              }}
              animate={{
                x: piece.x,
                y: piece.y,
                rotate: piece.rotation,
                opacity: 0,
              }}
              transition={{
                duration: 2,
                delay: piece.delay,
                ease: [0.23, 1, 0.32, 1],
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
