import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Star, Calendar, MessageCircle, ArrowLeft, Edit3, Tv, DollarSign, CreditCard, Calculator, Settings } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import { PriceCard } from '../components/PriceCard';
import { CheckoutModal, OrderData, CustomerInfo } from '../components/CheckoutModal';
import { AdminLogin } from '../components/AdminLogin';
import { AdminPanel } from '../components/AdminPanel';
import { sendOrderToWhatsApp } from '../utils/whatsapp';
import { IMAGE_BASE_URL, POSTER_SIZE } from '../config/api';

export function Cart() {
  const { state: cartState, removeItem, clearCart, updatePaymentType, calculateItemPrice, calculateTotalPrice, calculateTotalByPaymentType } = useCart();
  const { state: adminState } = useAdmin();
  const [showCheckoutModal, setShowCheckoutModal] = React.useState(false);
  const [showAdminLogin, setShowAdminLogin] = React.useState(false);
  const [showAdminPanel, setShowAdminPanel] = React.useState(false);

  const handleCheckout = (orderData: OrderData) => {
    // Calculate totals
    const totalsByPaymentType = calculateTotalByPaymentType();
    const subtotal = totalsByPaymentType.cash + totalsByPaymentType.transfer;
    const transferFee = 0;
    const total = subtotal + orderData.deliveryCost;
    
    // Complete the order data with cart information
    const completeOrderData: OrderData = {
      ...orderData,
      items: cartState.items,
      subtotal,
      transferFee,
      total,
      cashTotal: totalsByPaymentType.cash,
      transferTotal: totalsByPaymentType.transfer
    };
    
    sendOrderToWhatsApp(completeOrderData);
    setShowCheckoutModal(false);
  };

  const handleAdminLoginSuccess = () => {
    setShowAdminLogin(false);
    setShowAdminPanel(true);
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
  const movieCount = cartState.items.filter(item => item.type === 'movie').length;
  const seriesCount = cartState.items.filter(item => item.type === 'tv').length;
  const animeCount = cartState.items.filter(item => isAnime(item)).length;

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-8">
            Explora nuestro catálogo y agrega películas, series o anime a tu carrito.
          </p>
          <div className="flex flex-col space-y-3">
            <Link
              to="/movies"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
            >
              Explorar Películas
            </Link>
            <Link
              to="/tv"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
            >
              Ver Series
            </Link>
            <Link
              to="/anime"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
            >
              Descubrir Anime
            </Link>
            <button
              onClick={() => setShowAdminLogin(true)}
              className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center flex items-center justify-center"
            >
              <Settings className="h-5 w-5 mr-2" />
              Panel de Control
            </button>
          </div>
        </div>
        
        {/* Admin Login Modal */}
        <AdminLogin
          isOpen={showAdminLogin}
          onClose={() => setShowAdminLogin(false)}
          onSuccess={handleAdminLoginSuccess}
        />
        
        {/* Admin Panel */}
        {adminState.isAuthenticated && (
          <AdminPanel
            isOpen={showAdminPanel}
            onClose={() => setShowAdminPanel(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center justify-center sm:justify-start">
            <ShoppingCart className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mi Carrito ({cartState.total})</h1>
          </div>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 flex items-center justify-center sm:justify-start font-medium text-sm sm:text-base"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Seguir explorando
          </Link>
        </div>

        {/* Cart Items */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4 sm:mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 text-center sm:text-left">
                Elementos ({cartState.total})
              </h2>
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors text-center"
              >
                Vaciar carrito
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {cartState.items.map((item) => (
              <div key={`${item.type}-${item.id}`} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                  {/* Poster */}
                  <Link to={getItemUrl(item)} className="flex-shrink-0 mx-auto sm:mx-0">
                    <img
                      src={getPosterUrl(item.poster_path)}
                      alt={item.title}
                      className="w-20 h-28 sm:w-16 sm:h-24 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    />
                  </Link>

                  {/* Content */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    {/* Payment Type Selection */}
                    <div className="mb-3 sm:mb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                        <span className="text-sm font-medium text-gray-700 text-center sm:text-left">Tipo de pago:</span>
                        <div className="flex justify-center sm:justify-start space-x-2">
                          <button
                            onClick={() => updatePaymentType(item.id, 'cash')}
                            className={`px-3 py-2 rounded-full text-xs font-medium transition-colors ${
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
                            className={`px-3 py-2 rounded-full text-xs font-medium transition-colors ${
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
                      className="block hover:text-blue-600 transition-colors mb-2"
                    >
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                        {item.title}
                      </h3>
                    </Link>
                    
                    {item.type === 'tv' && item.selectedSeasons && item.selectedSeasons.length > 0 && (
                      <div className="mb-2">
                        <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                          Temporadas: {item.selectedSeasons.sort((a, b) => a - b).join(', ')}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 mt-2 text-sm text-gray-600">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                        {item.type === 'movie' ? 'Película' : 'Serie'}
                      </span>
                      {item.type === 'tv' && item.selectedSeasons && item.selectedSeasons.length > 0 && (
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium inline-flex items-center">
                          <Tv className="h-3 w-3 mr-1" />
                          {item.selectedSeasons.length} temp.
                        </span>
                      )}
                      <div className="inline-flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{getItemYear(item)}</span>
                      </div>
                      <div className="inline-flex items-center">
                        <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                        <span>{item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex-shrink-0 w-full sm:w-auto sm:ml-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border-2 border-green-200 shadow-sm sm:min-w-[140px]">
                      <div className="text-center">
                        <div className="text-xs font-medium text-green-700 mb-1">
                          {item.paymentType === 'cash' ? 'Efectivo' : 'Transferencia'}
                        </div>
                        <div className="text-base sm:text-lg font-bold text-green-800">
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
                  <div className="flex-shrink-0 flex items-center justify-center sm:justify-start space-x-2 mt-2 sm:mt-0">
                    {item.type === 'tv' && (
                      <Link
                        to={getItemUrl(item)}
                        className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-full transition-colors touch-manipulation"
                        title="Editar temporadas"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Link>
                    )}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors touch-manipulation"
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
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
              <h3 className="text-xl sm:text-2xl font-bold flex items-center justify-center sm:justify-start">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                Resumen del Pedido
              </h3>
              <div className="text-center sm:text-right">
                <div className="text-2xl sm:text-3xl font-bold">${totalPrice.toLocaleString()} CUP</div>
                <div className="text-sm opacity-90">{cartState.total} elementos</div>
              </div>
            </div>
          </div>
          
          <div className="p-4 sm:p-6">
            {/* Desglose por tipo de pago */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-100">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center justify-center sm:justify-start">
                <Calculator className="mr-2 h-5 w-5 text-blue-600" />
                Desglose por Tipo de Pago
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-lg font-bold text-green-700">Efectivo</span>
                    </div>
                    <div className="text-2xl font-bold text-green-800 mb-2">
                      ${totalsByPaymentType.cash.toLocaleString()} CUP
                    </div>
                    <div className="text-sm text-green-600">
                      {cartState.items.filter(item => item.paymentType === 'cash').length} elementos
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <CreditCard className="h-5 w-5 text-orange-600 mr-2" />
                      <span className="text-lg font-bold text-orange-700">Transferencia</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-800 mb-2">
                      ${totalsByPaymentType.transfer.toLocaleString()} CUP
                    </div>
                    <div className="text-sm text-orange-600">
                      {cartState.items.filter(item => item.paymentType === 'transfer').length} elementos (+10%)
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-100 to-orange-100 rounded-lg p-4 border-2 border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total General:</span>
                  <span className="text-2xl font-bold text-blue-600">${totalPrice.toLocaleString()} CUP</span>
                </div>
              </div>
            </div>

            {/* Desglose detallado de precios */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-100">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center justify-center sm:justify-start">
                <span className="text-lg mr-2">💰</span>
                Detalle de Elementos
              </h4>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cartState.items.map((item) => {
                  const itemPrice = calculateItemPrice(item);
                  const basePrice = item.type === 'movie' ? 80 : (item.selectedSeasons?.length || 1) * 300;
                  return (
                    <div key={`${item.type}-${item.id}`} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm mb-1 break-words">{item.title}</p>
                        <p className="text-xs text-gray-600">
                          {item.type === 'movie' ? 'Película' : 'Serie'}
                          {item.selectedSeasons && item.selectedSeasons.length > 0 && 
                            ` • Temporadas: ${item.selectedSeasons.sort((a, b) => a - b).join(', ')}`
                          }
                          {isAnime(item) && ' • Anime'}
                        </p>
                        <div className="mt-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            item.paymentType === 'cash' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {item.paymentType === 'cash' ? 'Efectivo' : 'Transferencia'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
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
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-green-600">${totalPrice.toLocaleString()} CUP</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-center sm:text-left">
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-1">Películas</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {movieCount}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg mx-auto sm:mx-0 mt-2 sm:mt-0 w-fit">
                    <span className="text-2xl">🎬</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-center sm:text-left">
                  <div>
                    <p className="text-sm font-medium text-purple-600 mb-1">Series/Anime</p>
                    <p className="text-2xl font-bold text-purple-800">
                      {seriesCount}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg mx-auto sm:mx-0 mt-2 sm:mt-0 w-fit">
                    <span className="text-2xl">📺</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-center sm:text-left">
                  <div>
                    <p className="text-sm font-medium text-pink-600 mb-1">Anime</p>
                    <p className="text-2xl font-bold text-pink-800">{animeCount}</p>
                  </div>
                  <div className="bg-pink-100 p-3 rounded-lg mx-auto sm:mx-0 mt-2 sm:mt-0 w-fit">
                    <span className="text-2xl">🎌</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-center sm:text-left">Estadísticas del Pedido</h4>
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-1 sm:space-y-0">
                  <span className="text-gray-600">Promedio de calificación:</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">
                      {cartState.items.length > 0 
                        ? (cartState.items.reduce((acc, item) => acc + item.vote_average, 0) / cartState.items.length).toFixed(1)
                        : '0.0'
                      }
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-1 sm:space-y-0">
                  <span className="text-gray-600">Contenido más reciente:</span>
                  <span className="font-medium">
                    {cartState.items.length > 0 
                      ? Math.max(...cartState.items.map(item => {
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
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center transform hover:scale-105 hover:shadow-lg touch-manipulation"
            >
              <MessageCircle className="mr-3 h-6 w-6" />
              Proceder al Checkout
            </button>
            
            <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100">
              <p className="text-sm text-green-700 text-center flex items-center justify-center">
                <span className="mr-2">📱</span>
                Complete sus datos para finalizar el pedido
              </p>
            </div>
          </div>
        </div>
        
        {/* Checkout Modal */}
        <CheckoutModal
          isOpen={showCheckoutModal}
          onClose={() => setShowCheckoutModal(false)}
          onCheckout={handleCheckout}
          items={cartState.items.map(item => ({
            id: item.id,
            title: item.title,
            price: calculateItemPrice(item),
            quantity: 1
          }))}
          total={totalPrice}
        />
        
        {/* Admin Login Modal */}
        <AdminLogin
          isOpen={showAdminLogin}
          onClose={() => setShowAdminLogin(false)}
          onSuccess={handleAdminLoginSuccess}
        />
        
        {/* Admin Panel */}
        {adminState.isAuthenticated && (
          <AdminPanel
            isOpen={showAdminPanel}
            onClose={() => setShowAdminPanel(false)}
          />
        )}
      </div>
    </div>
  );
}