import React, { useEffect, useState } from 'react';
import { ShoppingCart, Check, Plus, Sparkles } from 'lucide-react';

interface CartAnimationProps {
  show: boolean;
  onComplete: () => void;
}

export function CartAnimation({ show, onComplete }: CartAnimationProps) {
  const [stage, setStage] = useState<'hidden' | 'flying' | 'sparkle' | 'success' | 'complete'>('hidden');

  useEffect(() => {
    if (show) {
      setStage('flying');
      
      const timer1 = setTimeout(() => {
        setStage('sparkle');
      }, 800);

      const timer2 = setTimeout(() => {
        setStage('success');
      }, 1200);

      const timer3 = setTimeout(() => {
        setStage('complete');
        onComplete();
      }, 2000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      setStage('hidden');
    }
  }, [show, onComplete]);

  if (stage === 'hidden' || stage === 'complete') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
      {stage === 'flying' && (
        <div className="relative">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-full shadow-2xl animate-bounce transform scale-110">
            <ShoppingCart className="h-10 w-10 animate-pulse" />
          </div>
          <div className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full animate-ping">
            <Plus className="h-4 w-4" />
          </div>
          {/* Floating particles */}
          <div className="absolute inset-0 animate-spin">
            <div className="absolute -top-4 left-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="absolute top-1/2 -right-4 w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100"></div>
            <div className="absolute -bottom-4 left-1/2 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
            <div className="absolute top-1/2 -left-4 w-2 h-2 bg-green-400 rounded-full animate-bounce delay-300"></div>
          </div>
        </div>
      )}
      
      {stage === 'sparkle' && (
        <div className="relative">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 rounded-full shadow-2xl animate-pulse transform scale-125">
            <Sparkles className="h-12 w-12 animate-spin" />
          </div>
          {/* Sparkle effects */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 bg-yellow-300 rounded-full animate-ping`}
              style={{
                top: `${20 + Math.sin(i * Math.PI / 4) * 60}px`,
                left: `${20 + Math.cos(i * Math.PI / 4) * 60}px`,
                animationDelay: `${i * 100}ms`
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-pink-200 rounded-full animate-ping opacity-30"></div>
        </div>
      )}
      
      {stage === 'success' && (
        <div className="relative">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-8 rounded-full shadow-2xl animate-bounce transform scale-150">
            <Check className="h-12 w-12" />
          </div>
          {/* Success ripples */}
          <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-40"></div>
          <div className="absolute inset-0 bg-green-300 rounded-full animate-ping opacity-20 animation-delay-200"></div>
          <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-10 animation-delay-400"></div>
          
          {/* Confetti effect */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-4 animate-bounce`}
              style={{
                backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'][i % 6],
                top: `${-20 + Math.random() * 40}px`,
                left: `${-20 + Math.random() * 40}px`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animationDelay: `${i * 50}ms`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      )}
      
      {/* Background overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
    </div>
  );
}