import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, Plus, Check } from 'lucide-react';
import { IMAGE_BASE_URL, POSTER_SIZE } from '../config/api';
import { useCart } from '../context/CartContext';
import { CartAnimation } from './CartAnimation';
import type { Movie, TVShow, CartItem } from '../types/movie';

interface MovieCardProps {
  item: Movie | TVShow;
  type: 'movie' | 'tv';
}

export function MovieCard({ item, type }: MovieCardProps) {
  const { addItem, removeItem, isInCart } = useCart();
  const [showAnimation, setShowAnimation] = React.useState(false);
  
  const title = 'title' in item ? item.title : item.name;
  const releaseDate = 'release_date' in item ? item.release_date : item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const posterUrl = item.poster_path 
    ? `${IMAGE_BASE_URL}/${POSTER_SIZE}${item.poster_path}`
    : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&h=750&fit=crop&crop=center';

  const inCart = isInCart(item.id);

  const handleCartAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const cartItem: CartItem = {
      id: item.id,
      title,
      poster_path: item.poster_path,
      type,
      release_date: 'release_date' in item ? item.release_date : undefined,
      first_air_date: 'first_air_date' in item ? item.first_air_date : undefined,
      vote_average: item.vote_average,
      selectedSeasons: type === 'tv' ? [1] : undefined,
    };

    if (inCart) {
      removeItem(item.id);
    } else {
      addItem(cartItem);
      setShowAnimation(true);
    }
  };

  return (
    <>
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <Link to={`/${type}/${item.id}`}>
        <div className="relative overflow-hidden">
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-sm flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{year}</span>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {item.overview || 'Sin descripción disponible'}
          </p>
        </div>
      </Link>
      
      <div className="absolute bottom-4 right-4">
        <button
          onClick={handleCartAction}
          className={`p-2 rounded-full shadow-lg transition-all duration-200 ${
            inCart
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {inCart ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </button>
      </div>
      
      <CartAnimation 
        show={showAnimation} 
        onComplete={() => setShowAnimation(false)} 
      />
    </div>
    </>
  );
}