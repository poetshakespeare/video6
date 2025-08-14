import React, { useEffect, useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';

interface CartAnimationProps {
  show: boolean;
  onComplete: () => void;
}

export function CartAnimation({ show, onComplete }: CartAnimationProps) {
  const [stage, setStage] = useState<'hidden' | 'flying' | 'success' | 'complete'>('hidden');

  useEffect(() => {
    if (show) {
      setStage('flying');
      
      const timer1 = setTimeout(() => {
        setStage('success');
      }, 800);

      const timer2 = setTimeout(() => {
        setStage('complete');
        onComplete();
      }, 1500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setStage('hidden');
    }
  }, [show, onComplete]);

  if (stage === 'hidden' || stage === 'complete') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {stage === 'flying' && (
        <div className="animate-bounce">
          <div className="bg-blue-600 text-white p-4 rounded-full shadow-2xl animate-pulse">
            <ShoppingCart className="h-8 w-8" />
          </div>
        </div>
      )}
      
      {stage === 'success' && (
        <div className="animate-ping">
          <div className="bg-green-600 text-white p-6 rounded-full shadow-2xl">
            <Check className="h-10 w-10" />
          </div>
        </div>
      )}
    </div>
  );
}