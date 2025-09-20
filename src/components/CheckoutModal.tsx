import React, { useState, useEffect } from 'react';
import { X, MapPin, User, Phone, Home, CreditCard, DollarSign, Send, Calculator, Truck, ExternalLink } from 'lucide-react';
import { useCart } from '../context/CartContext';

export interface CustomerInfo {
  fullName: string;
  phone: string;
  address: string;
}

export interface OrderData {
  orderId: string;
  customerInfo: CustomerInfo;
  deliveryZone: string;
  deliveryCost: number;
  items: any[];
  subtotal: number;
  transferFee: number;
  total: number;
  cashTotal?: number;
  transferTotal?: number;
  pickupLocation?: boolean;
  showLocationMap?: boolean;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: (orderData: OrderData) => void;
  items: Array<{
    id: number;
    title: string;
    price: number;
    quantity: number;
  }>;
  total: number;
}

// Validador de números de teléfono cubanos
const validateCubanPhone = (phone: string): boolean => {
  // Remover espacios, guiones y paréntesis
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  
  // Patrones válidos para números cubanos
  const patterns = [
    /^(\+53|53)?[5-9]\d{7}$/, // Móviles: 5xxxxxxx, 6xxxxxxx, 7xxxxxxx, 8xxxxxxx, 9xxxxxxx
    /^(\+53|53)?[2-4]\d{6,7}$/, // Fijos: 2xxxxxxx, 3xxxxxxx, 4xxxxxxx (7-8 dígitos)
    /^(\+53|53)?7[0-9]\d{6}$/, // Números especiales que empiezan con 7
  ];
  
  return patterns.some(pattern => pattern.test(cleanPhone));
};

export function CheckoutModal({ isOpen, onClose, onCheckout, items, total }: CheckoutModalProps) {
  const { getCurrentPrices } = useCart();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    address: ''
  });
  const [selectedZone, setSelectedZone] = useState('');
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [pickupLocation, setPickupLocation] = useState(false);
  const [showLocationMap, setShowLocationMap] = useState(false);
  const [errors, setErrors] = useState<Partial<CustomerInfo & { zone: string }>>({});
  const [deliveryZones, setDeliveryZones] = useState<any[]>([]);

  // Load delivery zones from admin config
  useEffect(() => {
    const loadDeliveryZones = () => {
      try {
        const adminConfig = localStorage.getItem('system_config');
        if (adminConfig) {
          const config = JSON.parse(adminConfig);
          if (config.deliveryZones) {
            setDeliveryZones(config.deliveryZones);
          }
        }
      } catch (error) {
        console.error('Error loading delivery zones:', error);
      }
    };

    loadDeliveryZones();

    // Listen for admin updates
    const handleAdminStateChange = (event: CustomEvent) => {
      if (event.detail.type === 'delivery_zone_add' || 
          event.detail.type === 'delivery_zone_update' || 
          event.detail.type === 'delivery_zone_delete') {
        loadDeliveryZones();
      }
    };

    const handleAdminFullSync = (event: CustomEvent) => {
      if (event.detail.config?.deliveryZones) {
        setDeliveryZones(event.detail.config.deliveryZones);
      }
    };

    window.addEventListener('admin_state_change', handleAdminStateChange as EventListener);
    window.addEventListener('admin_full_sync', handleAdminFullSync as EventListener);

    return () => {
      window.removeEventListener('admin_state_change', handleAdminStateChange as EventListener);
      window.removeEventListener('admin_full_sync', handleAdminFullSync as EventListener);
    };
  }, []);

  // Agregar opción de recogida en el local
  const pickupOption = {
    id: 'pickup',
    name: 'Recogida en TV a la Carta',
    cost: 0
  };

  const allDeliveryOptions = [pickupOption, ...deliveryZones];

  useEffect(() => {
    if (selectedZone === 'pickup') {
      setDeliveryCost(0);
      setPickupLocation(true);
    } else if (selectedZone) {
      const zone = deliveryZones.find(z => z.name === selectedZone);
      setDeliveryCost(zone ? zone.cost : 0);
      setPickupLocation(false);
    }
  }, [selectedZone, deliveryZones]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo & { zone: string }> = {};

    if (!customerInfo.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!validateCubanPhone(customerInfo.phone)) {
      newErrors.phone = 'Número de teléfono cubano inválido (ej: +53 5469 0878, 54690878, 22345678)';
    }

    if (!pickupLocation && !customerInfo.address.trim()) {
      newErrors.address = 'La dirección es requerida para entrega a domicilio';
    }

    if (!selectedZone) {
      newErrors.zone = 'Debe seleccionar una opción de entrega';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const orderId = `TV-${Date.now()}`;
    const orderData: OrderData = {
      orderId,
      customerInfo,
      deliveryZone: selectedZone,
      deliveryCost,
      items,
      subtotal: total,
      transferFee: 0,
      total: total + deliveryCost,
      pickupLocation,
      showLocationMap
    };

    onCheckout(orderData);
  };

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleZoneChange = (value: string) => {
    setSelectedZone(value);
    if (errors.zone) {
      setErrors(prev => ({ ...prev, zone: undefined }));
    }
  };

  const openLocationMap = () => {
    const mapUrl = 'https://www.google.com/maps/place/20%C2%B002\'22.5%22N+75%C2%B050\'58.8%22W/@20.0394604,-75.8495414,180m/data=!3m1!1e3!4m4!3m3!8m2!3d20.039585!4d-75.849663?entry=ttu&g_ep=EgoyMDI1MDczMC4wIKXMDSoASAFQAw%3D%3D';
    window.open(mapUrl, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-xl mr-4">
                <Send className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Finalizar Pedido</h2>
                <p className="text-blue-100">Completa tus datos para proceder</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Customer Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Información Personal
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ingresa tu nombre completo"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+53 5469 0878 o 54690878"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    Formatos válidos: +53 5469 0878, 54690878, 22345678
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección Completa {!pickupLocation && '*'}
                  </label>
                  <textarea
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={pickupLocation ? "Dirección opcional para contacto" : "Calle, número, entre calles, referencias..."}
                    disabled={pickupLocation}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Options */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-green-600" />
                Opciones de Entrega *
              </h3>
              
              {errors.zone && (
                <p className="text-red-500 text-sm mb-4">{errors.zone}</p>
              )}
              
              <div className="space-y-3">
                {/* Pickup Option */}
                <div
                  className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                    selectedZone === 'pickup'
                      ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg'
                      : 'border-gray-300 hover:border-green-400 hover:shadow-md'
                  }`}
                >
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white">
                    <div className="flex items-center">
                      <div className="bg-white/20 p-2 rounded-lg mr-3">
                        <Home className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">🏪 Recogida en el Local</h4>
                        <p className="text-green-100 text-sm">Opción más económica</p>
                      </div>
                    </div>
                  </div>
                  
                  <label className="flex items-center justify-between p-4 cursor-pointer">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="deliveryOption"
                        value="pickup"
                        checked={selectedZone === 'pickup'}
                        onChange={(e) => handleZoneChange(e.target.value)}
                        className="mr-4 h-5 w-5 text-green-600 focus:ring-green-500"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">TV a la Carta</p>
                        <p className="text-sm text-gray-600 mb-2">📍 Reparto Nuevo Vista Alegre, Santiago de Cuba</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            ⏰ Horario flexible
                          </span>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                            🚗 Sin costo adicional
                          </span>
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                            📱 Confirmación inmediata
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                        GRATIS
                      </div>
                      <p className="text-xs text-green-600 mt-1 font-medium">Ahorro: hasta $1,000 CUP</p>
                    </div>
                  </label>
                </div>
                  </div>
                </label>

                {/* Home Delivery Option */}
                {deliveryZones.length > 0 && (
                  <div className="border-2 border-gray-300 rounded-xl overflow-hidden hover:border-blue-400 transition-all duration-300 hover:shadow-md">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-white/20 p-2 rounded-lg mr-3">
                            <Truck className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">🚚 Entrega a Domicilio</h4>
                            <p className="text-blue-100 text-sm">Comodidad en tu hogar</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="bg-white/20 px-3 py-1 rounded-full">
                            <span className="text-sm font-medium">{deliveryZones.length} zonas</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto bg-white">
                      {deliveryZones.map((zone) => (
                        <label
                          key={zone.id}
                          className={`flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 cursor-pointer transition-all duration-300 ${
                            selectedZone === zone.name
                              ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 shadow-inner'
                              : 'hover:bg-gradient-to-r hover:from-blue-25 hover:to-purple-25 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="deliveryOption"
                              value={zone.name}
                              checked={selectedZone === zone.name}
                              onChange={(e) => handleZoneChange(e.target.value)}
                              className="mr-4 h-5 w-5 text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                              <p className="font-semibold text-gray-900 text-base">{zone.name}</p>
                              <div className="flex items-center mt-1 text-xs text-gray-500">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>Zona de entrega disponible</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-2 rounded-lg font-bold shadow-sm">
                              ${zone.cost.toLocaleString()} CUP
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Costo de entrega</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Location Map Option */}
              {pickupLocation && (
                <div className="mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                    <div>
                      <h4 className="font-medium text-blue-900 text-sm sm:text-base">Ubicación del Local</h4>
                      <p className="text-xs sm:text-sm text-blue-700">Ver ubicación en Google Maps (opcional)</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <label className="flex items-center justify-center sm:justify-start w-full sm:w-auto">
                        <input
                          type="checkbox"
                          checked={showLocationMap}
                          onChange={(e) => setShowLocationMap(e.target.checked)}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                        />
                        <span className="text-xs sm:text-sm text-blue-700">Incluir ubicación</span>
                      </label>
                      <button
                        type="button"
                        onClick={openLocationMap}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center w-full sm:w-auto"
                      >
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Ver Mapa
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {deliveryZones.length === 0 && (
                <div className="text-center py-8">
                  <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Solo disponible recogida en el local
                  </h3>
                  <p className="text-gray-600">
                    Contacta con el administrador para configurar zonas de entrega adicionales.
                  </p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg mr-3">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                Resumen del Pedido
              </h3>
              
              <div className="space-y-4">
                {/* Desglose detallado por tipo de contenido */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="text-base mr-2">📊</span>
                    Desglose por Tipo de Contenido
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    {items.filter(item => item.type === 'movie').length > 0 && (
                      <div className="bg-white rounded-lg p-3 border border-blue-200 text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {items.filter(item => item.type === 'movie').length}
                        </div>
                        <div className="text-xs text-gray-600">Películas</div>
                        <div className="text-sm font-semibold text-blue-700 mt-1">
                          ${items.filter(item => item.type === 'movie').reduce((sum, item) => sum + item.price, 0).toLocaleString()} CUP
                        </div>
                      </div>
                    )}
                    
                    {items.filter(item => item.type === 'tv').length > 0 && (
                      <div className="bg-white rounded-lg p-3 border border-purple-200 text-center">
                        <div className="text-lg font-bold text-purple-600">
                          {items.filter(item => item.type === 'tv').length}
                        </div>
                        <div className="text-xs text-gray-600">Series</div>
                        <div className="text-sm font-semibold text-purple-700 mt-1">
                          ${items.filter(item => item.type === 'tv').reduce((sum, item) => sum + item.price, 0).toLocaleString()} CUP
                        </div>
                      </div>
                    )}
                    
                    {items.filter(item => item.type === 'novel').length > 0 && (
                      <div className="bg-white rounded-lg p-3 border border-pink-200 text-center">
                        <div className="text-lg font-bold text-pink-600">
                          {items.filter(item => item.type === 'novel').length}
                        </div>
                        <div className="text-xs text-gray-600">Novelas</div>
                        <div className="text-sm font-semibold text-pink-700 mt-1">
                          ${items.filter(item => item.type === 'novel').reduce((sum, item) => sum + item.price, 0).toLocaleString()} CUP
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Desglose por método de pago */}
                <div className="bg-gradient-to-r from-green-50 to-orange-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="text-base mr-2">💳</span>
                    Desglose por Método de Pago
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                          <span className="font-semibold text-green-700">Efectivo</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            ${items.filter(item => item.paymentType === 'cash').reduce((sum, item) => sum + item.price, 0).toLocaleString()} CUP
                          </div>
                          <div className="text-xs text-gray-500">
                            {items.filter(item => item.paymentType === 'cash').length} elementos
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-orange-600 mr-2" />
                          <span className="font-semibold text-orange-700">Transferencia</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-orange-600">
                            ${items.filter(item => item.paymentType === 'transfer').reduce((sum, item) => sum + item.price, 0).toLocaleString()} CUP
                          </div>
                          <div className="text-xs text-gray-500">
                            {items.filter(item => item.paymentType === 'transfer').length} elementos
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-gray-100 to-blue-100 rounded-xl p-4 border border-gray-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">Subtotal del contenido:</span>
                    <span className="font-bold text-gray-900 text-lg">${total.toLocaleString()} CUP</span>
                  </div>
                  <div className="text-xs text-gray-600 text-center">
                    {items.length} elemento{items.length !== 1 ? 's' : ''} seleccionado{items.length !== 1 ? 's' : ''}
                  </div>
                </div>
                
                {selectedZone && (
                  <div className={`rounded-xl p-4 border-2 ${
                    pickupLocation 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' 
                      : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {pickupLocation ? (
                          <Home className="h-5 w-5 text-green-600 mr-2" />
                        ) : (
                          <Truck className="h-5 w-5 text-blue-600 mr-2" />
                        )}
                        <span className="font-medium text-gray-700">
                          {pickupLocation ? 'Recogida en local' : `Entrega: ${selectedZone}`}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold text-lg ${
                          deliveryCost === 0 ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {deliveryCost === 0 ? 'GRATIS' : `$${deliveryCost.toLocaleString()} CUP`}
                        </span>
                        {!pickupLocation && (
                          <div className="text-xs text-gray-500 mt-1">Costo de entrega</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-4 border-2 border-green-300 shadow-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900 flex items-center">
                      <span className="text-2xl mr-2">🎯</span>
                      TOTAL FINAL
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      ${(total + deliveryCost).toLocaleString()} CUP
                    </span>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-300">
                      Contenido: ${total.toLocaleString()} + Entrega: ${deliveryCost.toLocaleString()} CUP
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center"
            >
              <Send className="h-5 w-5 mr-2" />
              Enviar Pedido por WhatsApp
            </button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Al enviar el pedido serás redirigido a WhatsApp para completar la transacción
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}