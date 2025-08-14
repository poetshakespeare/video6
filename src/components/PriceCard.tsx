import React from 'react';
import { DollarSign, Tv, Film, Star } from 'lucide-react';

interface PriceCardProps {
  type: 'movie' | 'tv';
  selectedSeasons?: number[];
  episodeCount?: number;
  isAnime?: boolean;
}

export function PriceCard({ type, selectedSeasons = [], episodeCount = 0, isAnime = false }: PriceCardProps) {
  const calculatePrice = () => {
    if (type === 'movie') {
      return isAnime ? 80 : 80; // Películas y animados: $80 CUP
    } else {
      // Series: $300 CUP por temporada, TV shows: $20 CUP por episodio
      if (isAnime) {
        return selectedSeasons.length * 300; // Anime por temporada
      } else {
        // Para series normales, usar precio por temporada
        return selectedSeasons.length * 300;
      }
    }
  };

  const price = calculatePrice();
  const getIcon = () => {
    if (type === 'movie') {
      return isAnime ? '🎌' : '🎬';
    }
    return isAnime ? '🎌' : '📺';
  };

  const getTypeLabel = () => {
    if (type === 'movie') {
      return isAnime ? 'Película Animada' : 'Película';
    }
    return isAnime ? 'Anime' : 'Serie';
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 shadow-lg transform hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="bg-green-100 p-2 rounded-lg mr-3 shadow-sm">
            <span className="text-lg">{getIcon()}</span>
          </div>
          <div>
            <h3 className="font-bold text-green-800 text-sm">{getTypeLabel()}</h3>
            <p className="text-green-600 text-xs">
              {type === 'tv' && selectedSeasons.length > 0 
                ? `${selectedSeasons.length} temporada${selectedSeasons.length > 1 ? 's' : ''}`
                : 'Contenido completo'
              }
            </p>
          </div>
        </div>
        <div className="bg-green-500 text-white p-2 rounded-full shadow-md">
          <DollarSign className="h-4 w-4" />
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-green-700 mb-1">
          ${price.toLocaleString()} CUP
        </div>
        {type === 'tv' && selectedSeasons.length > 0 && (
          <div className="text-xs text-green-600">
            ${(price / selectedSeasons.length).toLocaleString()} CUP por temporada
          </div>
        )}
      </div>
      
      <div className="mt-3 flex items-center justify-center">
        <div className="bg-green-100 px-3 py-1 rounded-full">
          <span className="text-green-700 text-xs font-medium flex items-center">
            <Star className="h-3 w-3 mr-1" />
            Precio especial
          </span>
        </div>
      </div>
    </div>
  );
}