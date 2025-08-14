import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Star, Calendar, MessageCircle, ArrowLeft, Edit3, Tv, DollarSign, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PriceCard } from '../components/PriceCard';
import { CheckoutModal, OrderData } from '../components/CheckoutModal';
import { sendOrderToWhatsApp } from '../utils/whatsapp';
import { IMAGE_BASE_URL, POSTER_SIZE } from '../config/api';

export function Cart() {
  const { state, removeItem, clearCart, updatePaymentType, calculateItemPrice, calculateTotalPrice, calculateTotalByPaymentType } = useCart();
  const [showCheckoutModal, setShowCheckoutModal] = React.useState(false);

  const handleCheckoutConfirm = (orderData: OrderData) => {
    sendOrderToWhatsApp(orderData);
    setShowCheckoutModal(false);
  };

  const getItemUrl = (item: any) => {
    return `/${item.type}/${item.id}`;
  };

  const getItemYear = (item: any) => {
    const date = item.release_date || item.first_air_date;
    return date ? new Date(date).getFullYear() : 'N/A';
  };

  const getPosterUrl = (posterPath: string | null) => {
    return posterPath
      ? `${IMAGE_BASE_URL}/${POSTER_SIZE}${posterPath}`
      : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&h=750&fit=crop&crop=center';
  };

  const isAnime = (item: any) => {
    return item.original_language === 'ja' || 
           (item.genre_ids && item.genre_ids.includes(16)) ||
           item.title?.toLowerCase().includes('anime');
  };

  const totalPrice = calculateTotalPrice();
  const totalsByPaymentType = calculateTotalByPaymentType();
  const movieCount = state.items.filter(item => item.type === 'movie').length;
  const seriesCount = state.items.filter(item => item.type === 'tv').length;
  const animeCount = state.items.filter(item => isAnime(item)).length;

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-8">
            Explora nuestro catálogo y agrega películas, series o anime a tu carrito.
          </p>
          <div className="space-y-3">
            <Link
              to="/movies"
              className="block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Explorar Películas
            </Link>
            <Link
              to="/tv"
              className="block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Ver Series
            </Link>
            <Link
              to="/anime"
              className="block bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Descubrir Anime
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <ShoppingCart className="mr-3 h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Mi Carrito</h1>
          </div>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 flex items-center font-medium"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Seguir explorando
          </Link>
        </div>

        {/* Cart Items */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Elementos ({state.total})
              </h2>
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
              >
                Vaciar carrito
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {state.items.map((item) => (
              <div key={`${item.type}-${item.id}`} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  {/* Poster */}
                  <Link to={getItemUrl(item)} className="flex-shrink-0">
                    <img
                      src={getPosterUrl(item.poster_path)}
                      alt={item.title}
                      className="w-16 h-24 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    />
                  </Link>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Payment Type Selection */}
                    <div className="mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Tipo de pago:</span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => updatePaymentType(item.id, 'cash')}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              item.paymentType === 'cash'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-green-100'
                            }`}
                          >
                            <DollarSign className="h-3 w-3 inline mr-1" />
                            Efectivo
                          </button>
                          <button
                            onClick={() => updatePaymentType(item.id, 'transfer')}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              item.paymentType === 'transfer'
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-orange-100'
                            }`}
                          >
                            <CreditCard className="h-3 w-3 inline mr-1" />
                            Transferencia (+10%)
                          </button>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={getItemUrl(item)}
                      className="block hover:text-blue-600 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {item.title}
                        {item.type === 'tv' && item.selectedSeasons && item.selectedSeasons.length > 0 && (
                          <span className="text-sm font-normal text-purple-600 ml-2">
                            (Temporadas: {item.selectedSeasons.sort((a, b) => a - b).join(', ')})
                          </span>
                        )}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span className="capitalize bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                        {item.type === 'movie' ? 'Película' : 'Serie'}
                      </span>
                      {item.type === 'tv' && item.selectedSeasons && item.selectedSeasons.length > 0 && (
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium flex items-center">
                          <Tv className="h-3 w-3 mr-1" />
                          {item.selectedSeasons.length} temp.
                        </span>
                      )}
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{getItemYear(item)}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                        <span>{item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex-shrink-0 mb-4 ml-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border-2 border-green-200 shadow-sm min-w-[140px]">
                      <div className="text-center">
                        <div className="text-xs font-medium text-green-700 mb-1">
                          {item.paymentType === 'cash' ? 'Efectivo' : 'Transferencia'}
                        </div>
                        <div className="text-lg font-bold text-green-800">
                          ${calculateItemPrice(item).toLocaleString()} CUP
                        </div>
                        {item.paymentType === 'transfer' && (
                          <div className="text-xs text-orange-600 mt-1">
                            +10% incluido
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex-shrink-0 flex items-center space-x-2">
                    {item.type === 'tv' && (
                      <Link
                        to={getItemUrl(item)}
                        className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-full transition-colors"
                        title="Editar temporadas"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Link>
                    )}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                      title="Eliminar del carrito"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold flex items-center">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                Resumen del Pedido
              </h3>
              <div className="text-right">
                <div className="text-3xl font-bold">${totalPrice.toLocaleString()} CUP</div>
                <div className="text-sm opacity-90">elementos</div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {/* Desglose detallado de precios */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-100">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-lg mr-2">💰</span>
                Desglose de Precios
              </h4>
              
              {/* Desglose por tipo de pago */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium text-green-700">Efectivo</span>
                    </div>
                    <span className="font-bold text-green-800">${totalsByPaymentType.cash.toLocaleString()} CUP</span>
                  </div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 text-orange-600 mr-1" />
                      <span className="text-sm font-medium text-orange-700">Transferencia</span>
                    </div>
                    <span className="font-bold text-orange-800">${totalsByPaymentType.transfer.toLocaleString()} CUP</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {state.items.map((item) => {
                  const itemPrice = calculateItemPrice(item);
                  const basePrice = item.type === 'movie' ? 80 : (item.selectedSeasons?.length || 1) * 300;
                  return (
                    <div key={`${item.type}-${item.id}`} className="flex justify-between items-center bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                        <p className="text-xs text-gray-600">
                          {item.type === 'movie' ? 'Película' : 'Serie'}
                          {item.selectedSeasons && item.selectedSeasons.length > 0 && 
                            ` • ${item.selectedSeasons.length} temporada${item.selectedSeasons.length > 1 ? 's' : ''}`
                          }
                          {isAnime(item) && ' • Anime'}
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.paymentType === 'cash' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {item.paymentType === 'cash' ? 'Efectivo' : 'Transferencia'}
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${item.paymentType === 'cash' ? 'text-green-600' : 'text-orange-600'}`}>
                          ${itemPrice.toLocaleString()} CUP
                        </p>
                        {item.paymentType === 'transfer' && (
                          <p className="text-xs text-gray-500">
                            Base: ${basePrice.toLocaleString()} CUP
                          </p>
                        )}
                        {item.type === 'tv' && item.selectedSeasons && item.selectedSeasons.length > 0 && (
                          <p className="text-xs text-gray-500">
                            ${Math.round(itemPrice / item.selectedSeasons.length).toLocaleString()} CUP/temp.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-green-600">${totalPrice.toLocaleString()} CUP</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-1">Películas</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {movieCount}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <span className="text-2xl">🎬</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 mb-1">Series/Anime</p>
                    <p className="text-2xl font-bold text-purple-800">
                      {seriesCount}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <span className="text-2xl">📺</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-pink-600 mb-1">Anime</p>
                    <p className="text-2xl font-bold text-pink-800">{animeCount}</p>
                  </div>
                  <div className="bg-pink-100 p-3 rounded-lg">
                    <span className="text-2xl">🎌</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Estadísticas del Pedido</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Promedio de calificación:</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">
                      {state.items.length > 0 
                        ? (state.items.reduce((acc, item) => acc + item.vote_average, 0) / state.items.length).toFixed(1)
                        : '0.0'
                      }
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Contenido más reciente:</span>
                  <span className="font-medium">
                    {state.items.length > 0 
                      ? Math.max(...state.items.map(item => {
                          const date = item.release_date || item.first_air_date;
                          return date ? new Date(date).getFullYear() : 0;
                        }))
                      : 'N/A'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* WhatsApp Button */}
            <button
              onClick={() => setShowCheckoutModal(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center transform hover:scale-105 hover:shadow-lg"
            >
              <MessageCircle className="mr-3 h-6 w-6" />
              Proceder al Checkout
            </button>
            
            <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100">
              <p className="text-sm text-green-700 text-center flex items-center justify-center">
                <span className="mr-2">📱</span>
                Complete el formulario para finalizar su pedido
              </p>
            </div>
          </div>
        </div>
        
        {/* Checkout Modal */}
        <CheckoutModal
          isOpen={showCheckoutModal}
          onClose={() => setShowCheckoutModal(false)}
          onConfirm={handleCheckoutConfirm}
          preselectedPaymentTypes={state.items.reduce((acc, item) => {
            acc[item.id] = item.paymentType || 'cash';
            return acc;
          }, {} as Record<number, 'cash' | 'transfer'>)}
        />
      </div>
    </div>
  );
}