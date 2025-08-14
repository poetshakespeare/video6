import React, { useState, useEffect } from 'react';
import { X, MapPin, CreditCard, DollarSign, FileText, User, IdCard, Phone, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (orderData: OrderData) => void;
}

export interface OrderData {
  orderId: string;
  customerInfo: {
    fullName: string;
    idCard: string;
    phone: string;
    address: string;
  };
  paymentMethod: 'transfer' | 'cash';
  deliveryZone: string;
  deliveryCost: number;
  items: any[];
  subtotal: number;
  transferFee: number;
  total: number;
}

const DELIVERY_ZONES = {
  'Centro Histórico': 50,
  'Reparto Sueño': 80,
  'Vista Alegre': 100,
  'Reparto Terrazas': 120,
  'Los Olmos': 90,
  'Reparto Flores': 110,
  'San Pedrito': 70,
  'Altamira': 130,
  'Reparto Versalles': 85,
  'Micro 9': 95,
  'Micro 10': 95,
  'Micro 11': 100,
  'Micro 12': 105,
  'Ciudamar': 140,
  'Reparto Jiménez': 75,
  'Abel Santamaría': 60,
  'José Martí': 65,
  'Frank País': 90,
  'Antonio Maceo': 85,
  'Mariano Corona': 110,
  'Otros barrios': 150
};

export function CheckoutModal({ isOpen, onClose, onConfirm }: CheckoutModalProps) {
  const { state, calculateItemPrice } = useCart();
  const [formData, setFormData] = useState({
    fullName: '',
    idCard: '',
    phone: '',
    address: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'cash' | ''>('');
  const [deliveryZone, setDeliveryZone] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Generar ID de orden único
  const generateOrderId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `ORD-${timestamp}-${random}`.toUpperCase();
  };

  // Calcular costos
  const calculateCosts = () => {
    const subtotal = state.items.reduce((total, item) => {
      return total + calculateItemPrice(item);
    }, 0);

    const transferFee = paymentMethod === 'transfer' ? Math.round(subtotal * 0.1) : 0;
    const deliveryCost = deliveryZone ? DELIVERY_ZONES[deliveryZone as keyof typeof DELIVERY_ZONES] || 0 : 0;
    const total = subtotal + transferFee + deliveryCost;

    return { subtotal, transferFee, deliveryCost, total };
  };

  // Validar formulario
  useEffect(() => {
    const isValid = 
      formData.fullName.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.address.trim() !== '' &&
      paymentMethod !== '' &&
      deliveryZone !== '';
    
    setIsFormValid(isValid);
  }, [formData, paymentMethod, deliveryZone]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    const costs = calculateCosts();
    const orderId = generateOrderId();

    const orderData: OrderData = {
      orderId,
      customerInfo: formData,
      paymentMethod: paymentMethod as 'transfer' | 'cash',
      deliveryZone,
      deliveryCost: costs.deliveryCost,
      items: state.items,
      subtotal: costs.subtotal,
      transferFee: costs.transferFee,
      total: costs.total
    };

    onConfirm(orderData);
  };

  const handleClose = () => {
    setFormData({ fullName: '', idCard: '', phone: '', address: '' });
    setPaymentMethod('');
    setDeliveryZone('');
    onClose();
  };

  if (!isOpen) return null;

  const costs = calculateCosts();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl transform transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white/20 p-3 rounded-xl mr-4">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Finalizar Pedido</h2>
                  <p className="text-blue-100">Complete los datos para procesar su orden</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Formulario */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Datos del Cliente
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ej: Juan Carlos Pérez González"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Carnet de Identidad (Opcional)
                      </label>
                      <div className="relative">
                        <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.idCard}
                          onChange={(e) => handleInputChange('idCard', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ej: 12345678901"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ej: +53 5123 4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección Completa *
                      </label>
                      <div className="relative">
                        <Home className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <textarea
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          rows={3}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          placeholder="Ej: Calle 5ta #123 entre A y B, Reparto Vista Alegre"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Zona de Entrega */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-green-600" />
                    Zona de Entrega
                  </h3>
                  
                  <select
                    value={deliveryZone}
                    onChange={(e) => setDeliveryZone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Seleccione su barrio</option>
                    {Object.entries(DELIVERY_ZONES).map(([zone, cost]) => (
                      <option key={zone} value={zone}>
                        {zone} - ${cost} CUP
                      </option>
                    ))}
                  </select>
                </div>

                {/* Forma de Pago */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-yellow-600" />
                    Forma de Pago
                  </h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="transfer"
                        checked={paymentMethod === 'transfer'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'transfer')}
                        className="mr-3 h-4 w-4 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Transferencia Bancaria</div>
                        <div className="text-sm text-gray-600">Recargo del 10% sobre el subtotal</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'cash')}
                        className="mr-3 h-4 w-4 text-green-600"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Efectivo</div>
                        <div className="text-sm text-gray-600">Pago contra entrega</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Resumen del Pedido */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <DollarSign className="h-6 w-6 mr-2 text-green-600" />
                    Resumen del Pedido
                  </h3>

                  {/* Items */}
                  <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                    {state.items.map((item) => {
                      const itemPrice = calculateItemPrice(item);
                      return (
                        <div key={`${item.type}-${item.id}`} className="flex justify-between items-start p-3 bg-white rounded-lg border border-gray-100">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                            <p className="text-xs text-gray-600">
                              {item.type === 'movie' ? 'Película' : 'Serie'}
                              {item.selectedSeasons && item.selectedSeasons.length > 0 && 
                                ` • ${item.selectedSeasons.length} temporada${item.selectedSeasons.length > 1 ? 's' : ''}`
                              }
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600 text-sm">${itemPrice} CUP</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Cálculos */}
                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold">${costs.subtotal} CUP</span>
                    </div>
                    
                    {paymentMethod === 'transfer' && (
                      <div className="flex justify-between items-center text-orange-600">
                        <span>Recargo transferencia (10%):</span>
                        <span className="font-semibold">+${costs.transferFee} CUP</span>
                      </div>
                    )}
                    
                    {deliveryZone && (
                      <div className="flex justify-between items-center text-blue-600">
                        <span>Entrega ({deliveryZone}):</span>
                        <span className="font-semibold">+${costs.deliveryCost} CUP</span>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-300 pt-3">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-green-600">${costs.total} CUP</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información de la Orden */}
                {isFormValid && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-2">ID de Orden Generado:</h4>
                    <p className="font-mono text-lg font-bold text-purple-700 bg-white px-3 py-2 rounded-lg border">
                      {generateOrderId()}
                    </p>
                    <p className="text-sm text-purple-600 mt-2">
                      Guarde este ID para hacer seguimiento de su pedido
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button
                onClick={handleClose}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
              >
                Cancelar
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center ${
                  isFormValid
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transform hover:scale-105 shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FileText className="h-5 w-5 mr-2" />
                Enviar Pedido por WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}