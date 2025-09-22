import React, { useState, useEffect } from 'react';
import { X, MapPin, User, Phone, Home, CreditCard, DollarSign, Send, Calculator, Truck, ExternalLink, Smartphone, Tablet, Monitor, Laptop, Globe, Wifi, Zap } from 'lucide-react';
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

// Detectar dispositivo, sistema operativo y navegador con máxima precisión
const getUniversalDeviceInfo = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const pixelRatio = window.devicePixelRatio || 1;
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

  // Detectar sistema operativo con versiones específicas
  let os = 'unknown';
  let osVersion = '';
  let osEmoji = '💻';
  
  if (userAgent.includes('android')) {
    os = 'android';
    osEmoji = '🤖';
    const match = userAgent.match(/android\s([0-9\.]*)/);
    osVersion = match ? match[1] : '';
  } else if (userAgent.includes('iphone')) {
    os = 'ios';
    osEmoji = '📱';
    const match = userAgent.match(/os\s([0-9_]*)/);
    osVersion = match ? match[1].replace(/_/g, '.') : '';
  } else if (userAgent.includes('ipad')) {
    os = 'ipados';
    osEmoji = '📱';
    const match = userAgent.match(/os\s([0-9_]*)/);
    osVersion = match ? match[1].replace(/_/g, '.') : '';
  } else if (userAgent.includes('mac')) {
    os = 'macos';
    osEmoji = '🍎';
    const match = userAgent.match(/mac\sos\sx\s([0-9_]*)/);
    osVersion = match ? match[1].replace(/_/g, '.') : '';
  } else if (userAgent.includes('win')) {
    os = 'windows';
    osEmoji = '🪟';
    if (userAgent.includes('windows nt 10.0')) osVersion = '10/11';
    else if (userAgent.includes('windows nt 6.3')) osVersion = '8.1';
    else if (userAgent.includes('windows nt 6.2')) osVersion = '8';
    else if (userAgent.includes('windows nt 6.1')) osVersion = '7';
  } else if (userAgent.includes('linux')) {
    os = 'linux';
    osEmoji = '🐧';
    if (userAgent.includes('ubuntu')) osVersion = 'Ubuntu';
    else if (userAgent.includes('debian')) osVersion = 'Debian';
    else if (userAgent.includes('fedora')) osVersion = 'Fedora';
    else if (userAgent.includes('centos')) osVersion = 'CentOS';
    else if (userAgent.includes('arch')) osVersion = 'Arch';
    else if (userAgent.includes('mint')) osVersion = 'Mint';
  } else if (userAgent.includes('cros')) {
    os = 'chromeos';
    osEmoji = '🌐';
  } else if (userAgent.includes('freebsd')) {
    os = 'freebsd';
    osEmoji = '🔥';
  } else if (userAgent.includes('openbsd')) {
    os = 'openbsd';
    osEmoji = '🐡';
  }

  // Detectar tipo de dispositivo con mayor precisión
  let deviceType = 'desktop';
  let deviceEmoji = '💻';
  
  // Móvil: pantalla pequeña Y táctil
  if ((screenWidth <= 768 || screenHeight <= 768) && maxTouchPoints > 0) {
    deviceType = 'mobile';
    deviceEmoji = '📱';
  }
  // Tablet: pantalla mediana Y táctil
  else if ((screenWidth <= 1024 && screenWidth > 768) && maxTouchPoints > 0) {
    deviceType = 'tablet';
    deviceEmoji = '📱';
  }
  // Laptop: pantalla mediana sin táctil o con táctil limitado
  else if (screenWidth <= 1366 && screenWidth > 1024) {
    deviceType = 'laptop';
    deviceEmoji = '💻';
  }
  // Desktop: pantalla grande
  else if (screenWidth > 1366) {
    deviceType = 'desktop';
    deviceEmoji = '🖥️';
  }

  // Detectar navegador con versiones
  let browser = 'unknown';
  let browserVersion = '';
  let browserEmoji = '🌐';
  
  if (userAgent.includes('edg')) {
    browser = 'edge';
    browserEmoji = '🔷';
    const match = userAgent.match(/edg\/([0-9\.]*)/);
    browserVersion = match ? match[1] : '';
  } else if (userAgent.includes('chrome') && !userAgent.includes('opr')) {
    browser = 'chrome';
    browserEmoji = '🟢';
    const match = userAgent.match(/chrome\/([0-9\.]*)/);
    browserVersion = match ? match[1] : '';
  } else if (userAgent.includes('firefox')) {
    browser = 'firefox';
    browserEmoji = '🦊';
    const match = userAgent.match(/firefox\/([0-9\.]*)/);
    browserVersion = match ? match[1] : '';
  } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    browser = 'safari';
    browserEmoji = '🧭';
    const match = userAgent.match(/version\/([0-9\.]*)/);
    browserVersion = match ? match[1] : '';
  } else if (userAgent.includes('opr') || userAgent.includes('opera')) {
    browser = 'opera';
    browserEmoji = '🎭';
    const match = userAgent.match(/opr\/([0-9\.]*)/);
    browserVersion = match ? match[1] : '';
  } else if (userAgent.includes('samsung')) {
    browser = 'samsung';
    browserEmoji = '📱';
  } else if (userAgent.includes('brave')) {
    browser = 'brave';
    browserEmoji = '🦁';
  } else if (userAgent.includes('vivaldi')) {
    browser = 'vivaldi';
    browserEmoji = '🎨';
  }

  // Detectar características especiales
  const isHighDPI = pixelRatio > 1;
  const isRetina = pixelRatio >= 2;
  const hasTouch = maxTouchPoints > 0;
  const connectionType = connection?.effectiveType || 'unknown';
  const isOnline = navigator.onLine;

  return {
    os,
    osVersion,
    osEmoji,
    deviceType,
    deviceEmoji,
    browser,
    browserVersion,
    browserEmoji,
    screenWidth,
    screenHeight,
    pixelRatio,
    maxTouchPoints,
    isTouchDevice: hasTouch,
    isHighDPI,
    isRetina,
    connectionType,
    isOnline,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    languages: navigator.languages,
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
    hardwareConcurrency: navigator.hardwareConcurrency || 1
  };
};

// Validador universal de números de teléfono cubanos
const validateUniversalCubanPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[\s\-()\.+]/g, '');
  
  const patterns = [
    /^(53)?[5-9]\d{7}$/, // Móviles (con o sin código de país)
    /^(53)?[2-4]\d{6,7}$/, // Fijos (con o sin código de país)
    /^(53)?7[0-9]\d{6}$/, // Números especiales
    /^\+53[5-9]\d{7}$/, // Formato internacional móviles
    /^\+53[2-4]\d{6,7}$/, // Formato internacional fijos
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
  const [deviceInfo, setDeviceInfo] = useState(getUniversalDeviceInfo());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Actualizar información del dispositivo en tiempo real
  useEffect(() => {
    const updateDeviceInfo = () => {
      setDeviceInfo(getUniversalDeviceInfo());
    };

    // Eventos para detectar cambios en el dispositivo
    const events = ['resize', 'orientationchange', 'online', 'offline'];
    events.forEach(event => {
      window.addEventListener(event, updateDeviceInfo);
    });
    
    // Detectar cambios en la conexión
    if ('connection' in navigator) {
      (navigator as any).connection.addEventListener('change', updateDeviceInfo);
    }
    
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateDeviceInfo);
      });
      if ('connection' in navigator) {
        (navigator as any).connection.removeEventListener('change', updateDeviceInfo);
      }
    };
  }, []);

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
    } else if (!validateUniversalCubanPhone(customerInfo.phone)) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
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

      await onCheckout(orderData);
    } catch (error) {
      console.error('Error processing order:', error);
    } finally {
      setIsSubmitting(false);
    }
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
    
    // Método universal para abrir mapas compatible con todos los dispositivos
    const openMapUniversal = () => {
      try {
        // Método 1: Intentar abrir en nueva pestaña
        const newWindow = window.open(mapUrl, '_blank', 'noopener,noreferrer,width=800,height=600,scrollbars=yes,resizable=yes');
        
        // Verificar si se bloqueó el popup
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          // Método 2: Crear enlace temporal y hacer clic
          const tempLink = document.createElement('a');
          tempLink.href = mapUrl;
          tempLink.target = '_blank';
          tempLink.rel = 'noopener noreferrer';
          tempLink.style.display = 'none';
          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);
        }
      } catch (error) {
        console.warn('Error opening map, trying fallback method:', error);
        // Método 3: Redirigir en la misma pestaña como último recurso
        window.location.href = mapUrl;
      }
    };

    openMapUniversal();
  };

  // Obtener configuración adaptativa según el dispositivo
  const getAdaptiveConfig = () => {
    const { deviceType, os, browser, screenWidth, isTouchDevice } = deviceInfo;
    
    // Configuración de espaciado y tamaños
    const spacing = {
      mobile: { padding: 'p-3', margin: 'm-2', text: 'text-sm', button: 'py-4 px-4' },
      tablet: { padding: 'p-4', margin: 'm-3', text: 'text-base', button: 'py-4 px-6' },
      laptop: { padding: 'p-5', margin: 'm-4', text: 'text-base', button: 'py-3 px-6' },
      desktop: { padding: 'p-6', margin: 'm-4', text: 'text-lg', button: 'py-3 px-8' }
    };

    // Configuración de modal
    const modalConfig = {
      mobile: { maxWidth: 'max-w-full', padding: 'p-2', maxHeight: 'max-h-[98vh]' },
      tablet: { maxWidth: 'max-w-3xl', padding: 'p-4', maxHeight: 'max-h-[95vh]' },
      laptop: { maxWidth: 'max-w-4xl', padding: 'p-6', maxHeight: 'max-h-[90vh]' },
      desktop: { maxWidth: 'max-w-5xl', padding: 'p-8', maxHeight: 'max-h-[85vh]' }
    };

    // Iconos específicos por dispositivo
    const deviceIcons = {
      mobile: <Smartphone className="h-5 w-5" />,
      tablet: <Tablet className="h-5 w-5" />,
      laptop: <Laptop className="h-5 w-5" />,
      desktop: <Monitor className="h-5 w-5" />
    };

    // Etiquetas específicas por dispositivo
    const deviceLabels = {
      mobile: 'Móvil',
      tablet: 'Tablet',
      laptop: 'Laptop',
      desktop: 'PC'
    };

    return {
      spacing: spacing[deviceType as keyof typeof spacing] || spacing.desktop,
      modal: modalConfig[deviceType as keyof typeof modalConfig] || modalConfig.desktop,
      deviceIcon: deviceIcons[deviceType as keyof typeof deviceIcons] || deviceIcons.desktop,
      deviceLabel: deviceLabels[deviceType as keyof typeof deviceLabels] || deviceLabels.desktop,
      isTouch: isTouchDevice,
      needsLargerButtons: deviceType === 'mobile' || deviceType === 'tablet',
      needsCompactLayout: deviceType === 'mobile',
      supportsHover: !isTouchDevice
    };
  };

  const adaptiveConfig = getAdaptiveConfig();

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${adaptiveConfig.modal.padding}`}>
      <div className={`bg-white rounded-2xl w-full shadow-2xl overflow-hidden ${adaptiveConfig.modal.maxWidth} ${adaptiveConfig.modal.maxHeight}`}>
        {/* Header adaptativo universal */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className={adaptiveConfig.spacing.padding}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white/20 p-3 rounded-xl mr-3 sm:mr-4 shadow-lg">
                  <Send className="h-6 w-6" />
                </div>
                <div>
                  <h2 className={`font-bold ${adaptiveConfig.needsCompactLayout ? 'text-lg' : 'text-2xl'}`}>
                    Finalizar Pedido
                  </h2>
                  <div className={`flex items-center text-blue-100 ${adaptiveConfig.needsCompactLayout ? 'text-xs' : 'text-sm'}`}>
                    <div className="flex items-center mr-4">
                      {adaptiveConfig.deviceIcon}
                      <span className="ml-1">{adaptiveConfig.deviceLabel}</span>
                    </div>
                    <div className="flex items-center mr-4">
                      <span className="mr-1">{deviceInfo.osEmoji}</span>
                      <span>{deviceInfo.os.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1">{deviceInfo.browserEmoji}</span>
                      <span className="hidden sm:inline">{deviceInfo.browser}</span>
                    </div>
                    {!deviceInfo.isOnline && (
                      <div className="flex items-center ml-4 text-red-200">
                        <Wifi className="h-4 w-4 mr-1" />
                        <span>Sin conexión</span>
                      </div>
                    )}
                  </div>
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
        </div>

        <div className={`overflow-y-auto ${adaptiveConfig.modal.maxHeight.replace('max-h-', 'max-h-[calc(')})-120px)]`}>
          <form onSubmit={handleSubmit} className={`space-y-6 ${adaptiveConfig.spacing.padding}`}>
            {/* Customer Information - Adaptativo universal */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200 shadow-sm">
              <div className={adaptiveConfig.spacing.padding}>
                <h3 className={`font-semibold text-gray-900 mb-4 flex items-center ${adaptiveConfig.spacing.text}`}>
                  <div className="bg-blue-500 p-2 rounded-lg mr-3 shadow-sm">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  Información Personal
                  <div className="ml-auto flex items-center text-xs text-gray-500">
                    {adaptiveConfig.deviceIcon}
                    <span className="ml-1 hidden sm:inline">{adaptiveConfig.deviceLabel}</span>
                  </div>
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
                      className={`w-full px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                        adaptiveConfig.needsLargerButtons ? 'py-4 text-base' : 'py-3 text-sm'
                      } ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'}`}
                      placeholder="Ingresa tu nombre completo"
                      autoComplete="name"
                      style={{ fontSize: adaptiveConfig.needsLargerButtons ? '16px' : '14px' }}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono * 
                      <span className="text-xs text-gray-500 ml-2">
                        ({deviceInfo.os === 'ios' ? 'iPhone/iPad' : deviceInfo.os === 'android' ? 'Android' : deviceInfo.os.toUpperCase()})
                      </span>
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                        adaptiveConfig.needsLargerButtons ? 'py-4 text-base' : 'py-3 text-sm'
                      } ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'}`}
                      placeholder="+53 5469 0878 o 54690878"
                      autoComplete="tel"
                      style={{ fontSize: adaptiveConfig.needsLargerButtons ? '16px' : '14px' }}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.phone}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs mt-1 flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      Formatos válidos: +53 5469 0878, 54690878, 22345678
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección Completa {!pickupLocation && '*'}
                      {pickupLocation && (
                        <span className="text-green-600 text-xs ml-2">(Opcional para recogida)</span>
                      )}
                    </label>
                    <textarea
                      value={customerInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={adaptiveConfig.needsCompactLayout ? 2 : 3}
                      className={`w-full px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all duration-300 ${
                        adaptiveConfig.needsLargerButtons ? 'py-4 text-base' : 'py-3 text-sm'
                      } ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'} ${
                        pickupLocation ? 'bg-gray-100 text-gray-600' : ''
                      }`}
                      placeholder={pickupLocation ? "Dirección opcional para contacto" : "Calle, número, entre calles, referencias..."}
                      disabled={pickupLocation}
                      autoComplete="street-address"
                      style={{ fontSize: adaptiveConfig.needsLargerButtons ? '16px' : '14px' }}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Options - Completamente adaptativo */}
            <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl border border-gray-200 shadow-sm">
              <div className={adaptiveConfig.spacing.padding}>
                <h3 className={`font-semibold text-gray-900 mb-4 flex items-center justify-between ${adaptiveConfig.spacing.text}`}>
                  <div className="flex items-center">
                    <div className="bg-green-500 p-2 rounded-lg mr-3 shadow-sm">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    Opciones de Entrega *
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    {deviceInfo.isOnline ? (
                      <div className="flex items-center text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                        <span>En línea</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                        <span>Sin conexión</span>
                      </div>
                    )}
                  </div>
                </h3>
                
                {errors.zone && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600 text-sm flex items-center">
                      <span className="mr-2">⚠️</span>
                      {errors.zone}
                    </p>
                  </div>
                )}
                
                <div className="space-y-4">
                  {/* Pickup Option - Adaptativo universal */}
                  <label
                    className={`group flex items-center justify-between border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                      adaptiveConfig.supportsHover ? 'hover:scale-[1.02]' : ''
                    } ${adaptiveConfig.spacing.padding} ${
                      selectedZone === 'pickup'
                        ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg scale-[1.02]'
                        : 'border-gray-300 hover:border-green-400 hover:bg-green-50/50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center flex-1">
                      <div className={`mr-3 sm:mr-4 p-3 rounded-full transition-all duration-300 ${
                        selectedZone === 'pickup'
                          ? 'bg-green-500 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-600 group-hover:bg-green-100 group-hover:text-green-600'
                      }`}>
                        <Home className="h-5 w-5" />
                      </div>
                      <input
                        type="radio"
                        name="deliveryOption"
                        value="pickup"
                        checked={selectedZone === 'pickup'}
                        onChange={(e) => handleZoneChange(e.target.value)}
                        className={`mr-3 sm:mr-4 text-green-600 focus:ring-green-500 focus:ring-2 ${
                          adaptiveConfig.needsLargerButtons ? 'h-6 w-6' : 'h-5 w-5'
                        }`}
                      />
                      <div className="flex-1">
                        <p className={`font-bold transition-colors ${adaptiveConfig.spacing.text} ${
                          selectedZone === 'pickup' ? 'text-green-800' : 'text-gray-900 group-hover:text-green-700'
                        }`}>
                          🏪 Recogida en TV a la Carta
                        </p>
                        <p className={`transition-colors ${
                          adaptiveConfig.needsCompactLayout ? 'text-xs' : 'text-sm'
                        } ${
                          selectedZone === 'pickup' ? 'text-green-700' : 'text-gray-600 group-hover:text-green-600'
                        }`}>
                          📍 Reparto Nuevo Vista Alegre, Santiago de Cuba
                        </p>
                        <p className={`mt-1 transition-colors ${
                          adaptiveConfig.needsCompactLayout ? 'text-xs' : 'text-xs'
                        } ${
                          selectedZone === 'pickup' ? 'text-green-600' : 'text-gray-500 group-hover:text-green-500'
                        }`}>
                          ⏰ Disponible de 9:00 AM a 8:00 PM
                        </p>
                        
                        {/* Información específica del dispositivo */}
                        <div className="mt-2 flex items-center text-xs text-green-600">
                          {adaptiveConfig.deviceIcon}
                          <span className="ml-1">Optimizado para {adaptiveConfig.deviceLabel}</span>
                          {deviceInfo.isTouchDevice && (
                            <>
                              <span className="mx-1">•</span>
                              <span>Táctil</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <div className={`px-4 py-2 rounded-full font-bold transition-all duration-300 ${
                        adaptiveConfig.needsCompactLayout ? 'text-base' : 'text-lg'
                      } ${
                        selectedZone === 'pickup'
                          ? 'bg-green-500 text-white shadow-lg'
                          : 'bg-green-100 text-green-700 group-hover:bg-green-200'
                      }`}>
                        ✨ GRATIS
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Sin costo adicional</p>
                    </div>
                  </label>

                  {/* Home Delivery Options - Adaptativo universal */}
                  {deliveryZones.length > 0 && (
                    <div className="border-2 border-gray-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-300">
                        <div className={adaptiveConfig.spacing.padding}>
                          <h4 className={`font-bold text-blue-900 flex items-center justify-between ${adaptiveConfig.spacing.text}`}>
                            <div className="flex items-center">
                              <div className="bg-blue-500 p-2 rounded-lg mr-3 shadow-sm">
                                <Truck className="h-5 w-5 text-white" />
                              </div>
                              Entrega a Domicilio
                            </div>
                            <div className="flex items-center text-xs">
                              {adaptiveConfig.deviceIcon}
                              <span className="ml-1 hidden sm:inline">{adaptiveConfig.deviceLabel}</span>
                            </div>
                          </h4>
                          <p className={`text-blue-700 ml-12 mt-1 ${
                            adaptiveConfig.needsCompactLayout ? 'text-xs' : 'text-sm'
                          }`}>
                            Selecciona tu zona de entrega
                          </p>
                        </div>
                      </div>
                      <div className={`bg-white ${
                        adaptiveConfig.needsCompactLayout ? 'max-h-48' : adaptiveConfig.deviceType === 'tablet' ? 'max-h-56' : 'max-h-64'
                      } overflow-y-auto`}>
                        {deliveryZones.map((zone) => (
                          <label
                            key={zone.id}
                            className={`group flex items-center justify-between border-b border-gray-100 last:border-b-0 cursor-pointer transition-all duration-300 ${
                              adaptiveConfig.supportsHover ? 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50' : ''
                            } ${adaptiveConfig.spacing.padding} ${
                              selectedZone === zone.name
                                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-inner'
                                : ''
                            }`}
                          >
                            <div className="flex items-center flex-1">
                              <div className={`mr-3 sm:mr-4 p-2 rounded-full transition-all duration-300 ${
                                selectedZone === zone.name
                                  ? 'bg-blue-500 text-white shadow-lg'
                                  : 'bg-gray-200 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                              }`}>
                                <MapPin className="h-4 w-4" />
                              </div>
                              <input
                                type="radio"
                                name="deliveryOption"
                                value={zone.name}
                                checked={selectedZone === zone.name}
                                onChange={(e) => handleZoneChange(e.target.value)}
                                className={`mr-3 sm:mr-4 text-blue-600 focus:ring-blue-500 focus:ring-2 ${
                                  adaptiveConfig.needsLargerButtons ? 'h-6 w-6' : 'h-5 w-5'
                                }`}
                              />
                              <div className="flex-1">
                                <p className={`font-bold transition-colors ${
                                  adaptiveConfig.needsCompactLayout ? 'text-sm' : 'text-base'
                                } ${
                                  selectedZone === zone.name ? 'text-blue-800' : 'text-gray-900 group-hover:text-blue-700'
                                }`}>
                                  🚚 {zone.name}
                                </p>
                                <p className={`mt-1 transition-colors ${
                                  adaptiveConfig.needsCompactLayout ? 'text-xs' : 'text-xs'
                                } ${
                                  selectedZone === zone.name ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500'
                                }`}>
                                  ⏰ Entrega en 24-48 horas
                                </p>
                              </div>
                            </div>
                            <div className="text-right flex flex-col items-end">
                              <div className={`px-3 sm:px-4 py-2 rounded-full font-bold transition-all duration-300 ${
                                adaptiveConfig.needsCompactLayout ? 'text-sm' : 'text-base'
                              } ${
                                selectedZone === zone.name
                                  ? 'bg-blue-500 text-white shadow-lg'
                                  : 'bg-blue-100 text-blue-700 group-hover:bg-blue-200'
                              }`}>
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

                {/* Location Map Option - Adaptativo universal */}
                {pickupLocation && (
                  <div className={`mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 shadow-lg ${adaptiveConfig.spacing.padding}`}>
                    <div className={`flex items-center justify-between ${
                      adaptiveConfig.needsCompactLayout ? 'flex-col space-y-3' : 'flex-row'
                    }`}>
                      <div className={adaptiveConfig.needsCompactLayout ? 'text-center' : ''}>
                        <h4 className={`font-bold text-blue-900 flex items-center ${
                          adaptiveConfig.needsCompactLayout ? 'text-sm justify-center' : 'text-base sm:text-lg'
                        }`}>
                          <div className="bg-blue-500 p-2 rounded-lg mr-3 shadow-sm">
                            <MapPin className="h-4 w-4 text-white" />
                          </div>
                          📍 Ubicación del Local
                        </h4>
                        <p className={`text-blue-700 ${
                          adaptiveConfig.needsCompactLayout ? 'text-xs mt-1' : 'text-sm ml-11'
                        }`}>
                          Ver ubicación exacta en Google Maps (opcional)
                        </p>
                      </div>
                      <div className={`flex items-center ${
                        adaptiveConfig.needsCompactLayout ? 'flex-col space-y-2 w-full' : 'flex-row space-x-3'
                      }`}>
                        <label className={`flex items-center ${
                          adaptiveConfig.needsCompactLayout ? 'justify-center w-full' : 'justify-start'
                        }`}>
                          <input
                            type="checkbox"
                            checked={showLocationMap}
                            onChange={(e) => setShowLocationMap(e.target.checked)}
                            className={`mr-2 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0 ${
                              adaptiveConfig.needsLargerButtons ? 'h-6 w-6' : 'h-5 w-5'
                            }`}
                          />
                          <span className="text-sm font-medium text-blue-700">📍 Incluir ubicación</span>
                        </label>
                        <button
                          type="button"
                          onClick={openLocationMap}
                          className={`bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center ${
                            adaptiveConfig.needsCompactLayout 
                              ? 'px-4 py-3 text-sm w-full' 
                              : adaptiveConfig.needsLargerButtons
                                ? 'px-6 py-3 text-base'
                                : 'px-4 py-3 text-sm'
                          }`}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          🗺️ Ver Mapa
                          <span className="ml-2 text-xs opacity-80">
                            ({deviceInfo.browser})
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {deliveryZones.length === 0 && (
                  <div className={`text-center bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200 ${
                    adaptiveConfig.needsCompactLayout ? 'py-6 px-4' : 'py-8 sm:py-12'
                  }`}>
                    <div className="bg-yellow-100 p-4 rounded-full w-fit mx-auto mb-4 sm:mb-6">
                      <Truck className={`text-yellow-600 ${adaptiveConfig.needsCompactLayout ? 'h-8 w-8' : 'h-12 w-12'}`} />
                    </div>
                    <h3 className={`font-bold text-yellow-800 mb-3 ${
                      adaptiveConfig.needsCompactLayout ? 'text-base' : 'text-lg sm:text-xl'
                    }`}>
                      Solo disponible recogida en el local
                    </h3>
                    <p className={`text-yellow-700 max-w-md mx-auto ${
                      adaptiveConfig.needsCompactLayout ? 'text-sm' : 'text-base'
                    }`}>
                      Contacta con el administrador para configurar zonas de entrega adicionales.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary - Completamente adaptativo */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border-2 border-blue-200 shadow-xl">
              <div className={adaptiveConfig.spacing.padding}>
                <h3 className={`font-semibold text-gray-900 mb-4 flex items-center justify-between ${adaptiveConfig.spacing.text}`}>
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl mr-3 shadow-lg">
                      <Calculator className="h-5 w-5 text-white" />
                    </div>
                    Resumen del Pedido
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Globe className="h-4 w-4 mr-1" />
                    <span>{deviceInfo.language}</span>
                  </div>
                </h3>
                
                {/* Items breakdown - Adaptativo universal */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4">
                  <div className={adaptiveConfig.spacing.padding}>
                    <h4 className={`font-bold text-gray-900 mb-3 flex items-center justify-between ${
                      adaptiveConfig.needsCompactLayout ? 'text-sm' : 'text-base'
                    }`}>
                      <div className="flex items-center">
                        <span className="text-base mr-2">📦</span>
                        Elementos del Pedido ({items.length})
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        {deviceInfo.osEmoji}
                        <span className="ml-1">{deviceInfo.os.toUpperCase()}</span>
                      </div>
                    </h4>
                    <div className={`space-y-2 overflow-y-auto ${
                      adaptiveConfig.needsCompactLayout ? 'max-h-24' : adaptiveConfig.deviceType === 'tablet' ? 'max-h-32' : 'max-h-40'
                    }`}>
                      {items.map((item, index) => (
                        <div key={index} className={`flex justify-between items-center bg-gray-50 rounded-lg transition-all duration-300 hover:bg-gray-100 ${
                          adaptiveConfig.needsCompactLayout ? 'py-2 px-2' : 'py-3 px-3'
                        }`}>
                          <div className="flex-1">
                            <p className={`font-medium text-gray-900 line-clamp-1 ${
                              adaptiveConfig.needsCompactLayout ? 'text-xs' : 'text-sm'
                            }`}>
                              {item.title}
                            </p>
                            <div className={`flex items-center space-x-1 sm:space-x-2 text-gray-600 mt-1 ${
                              adaptiveConfig.needsCompactLayout ? 'text-xs' : 'text-xs'
                            }`}>
                              <span className={`px-2 py-1 rounded-full font-medium ${
                                item.type === 'movie' ? 'bg-blue-100 text-blue-700' :
                                item.type === 'tv' ? 'bg-purple-100 text-purple-700' :
                                'bg-pink-100 text-pink-700'
                              }`}>
                                {item.type === 'movie' ? '🎬' : item.type === 'tv' ? '📺' : '📚'}
                                {!adaptiveConfig.needsCompactLayout && (
                                  <span className="ml-1">
                                    {item.type === 'movie' ? 'Película' : 
                                     item.type === 'tv' ? 'Serie' : 
                                     'Novela'}
                                  </span>
                                )}
                              </span>
                              {item.selectedSeasons && item.selectedSeasons.length > 0 && (
                                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full font-medium">
                                  {item.selectedSeasons.length} temp.
                                </span>
                              )}
                              {item.chapters && (
                                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full font-medium">
                                  {item.chapters} cap.
                                </span>
                              )}
                              <span className={`px-2 py-1 rounded-full font-medium ${
                                item.paymentType === 'cash' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-orange-100 text-orange-700'
                              }`}>
                                {item.paymentType === 'cash' ? '💵' : '💳'}
                                {!adaptiveConfig.needsCompactLayout && (
                                  <span className="ml-1">
                                    {item.paymentType === 'cash' ? 'Efectivo' : 'Transfer.'}
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="text-right ml-2 sm:ml-3">
                            <p className={`font-bold ${
                              item.paymentType === 'cash' ? 'text-green-600' : 'text-orange-600'
                            } ${adaptiveConfig.needsCompactLayout ? 'text-sm' : 'text-base'}`}>
                              ${item.price.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">CUP</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Payment method breakdown - Adaptativo universal */}
                <div className={`grid gap-4 mb-4 ${
                  adaptiveConfig.needsCompactLayout ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
                }`}>
                  {/* Cash payments */}
                  {items.filter(item => item.paymentType === 'cash').length > 0 && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-sm">
                      <div className={adaptiveConfig.spacing.padding}>
                        <div className="flex items-center mb-2">
                          <div className="bg-green-500 p-2 rounded-lg mr-3 shadow-sm">
                            <DollarSign className="h-4 w-4 text-white" />
                          </div>
                          <h5 className={`font-bold text-green-800 ${
                            adaptiveConfig.needsCompactLayout ? 'text-sm' : 'text-base'
                          }`}>
                            Pago en Efectivo
                          </h5>
                        </div>
                        <div className="ml-11">
                          <p className={`text-green-700 mb-1 ${
                            adaptiveConfig.needsCompactLayout ? 'text-xs' : 'text-sm'
                          }`}>
                            {items.filter(item => item.paymentType === 'cash').length} elementos
                          </p>
                          <p className={`font-bold text-green-800 ${
                            adaptiveConfig.needsCompactLayout ? 'text-lg' : 'text-xl'
                          }`}>
                            ${items.filter(item => item.paymentType === 'cash')
                              .reduce((sum, item) => sum + item.price, 0).toLocaleString()} CUP
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Transfer payments */}
                  {items.filter(item => item.paymentType === 'transfer').length > 0 && (
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-2 border-orange-200 shadow-sm">
                      <div className={adaptiveConfig.spacing.padding}>
                        <div className="flex items-center mb-2">
                          <div className="bg-orange-500 p-2 rounded-lg mr-3 shadow-sm">
                            <CreditCard className="h-4 w-4 text-white" />
                          </div>
                          <h5 className={`font-bold text-orange-800 ${
                            adaptiveConfig.needsCompactLayout ? 'text-sm' : 'text-base'
                          }`}>
                            Transferencia Bancaria
                          </h5>
                        </div>
                        <div className="ml-11">
                          <p className={`text-orange-700 mb-1 ${
                            adaptiveConfig.needsCompactLayout ? 'text-xs' : 'text-sm'
                          }`}>
                            {items.filter(item => item.paymentType === 'transfer').length} elementos (+10%)
                          </p>
                          <p className={`font-bold text-orange-800 ${
                            adaptiveConfig.needsCompactLayout ? 'text-lg' : 'text-xl'
                          }`}>
                            ${items.filter(item => item.paymentType === 'transfer')
                              .reduce((sum, item) => sum + item.price, 0).toLocaleString()} CUP
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Totals breakdown - Adaptativo universal */}
                <div className="space-y-3">
                  <div className={`flex justify-between items-center bg-white rounded-lg border border-gray-200 shadow-sm ${
                    adaptiveConfig.needsCompactLayout ? 'py-2 px-3' : 'py-3 px-4'
                  }`}>
                    <span className={`text-gray-700 font-medium flex items-center ${
                      adaptiveConfig.needsCompactLayout ? 'text-sm' : 'text-base'
                    }`}>
                      <span className="mr-2">🛒</span>
                      Subtotal ({items.length})
                    </span>
                    <span className={`font-bold text-gray-900 ${
                      adaptiveConfig.needsCompactLayout ? 'text-sm' : 'text-base'
                    }`}>
                      ${total.toLocaleString()} CUP
                    </span>
                  </div>
                  
                  {selectedZone && (
                    <div className={`flex justify-between items-center bg-white rounded-lg border border-gray-200 shadow-sm ${
                      adaptiveConfig.needsCompactLayout ? 'py-2 px-3' : 'py-3 px-4'
                    }`}>
                      <span className={`text-gray-700 font-medium flex items-center ${
                        adaptiveConfig.needsCompactLayout ? 'text-sm' : 'text-base'
                      }`}>
                        <span className="mr-2">{pickupLocation ? '🏪' : '🚚'}</span>
                        {pickupLocation ? 'Recogida en local' : `Entrega a domicilio`}
                      </span>
                      <span className={`font-bold ${deliveryCost === 0 ? 'text-green-600' : 'text-blue-600'} ${
                        adaptiveConfig.needsCompactLayout ? 'text-sm' : 'text-base'
                      }`}>
                        {deliveryCost === 0 ? '✨ GRATIS' : `$${deliveryCost.toLocaleString()} CUP`}
                      </span>
                    </div>
                  )}
                  
                  <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl border-2 border-green-300 shadow-lg">
                    <div className={adaptiveConfig.spacing.padding}>
                      <div className={`flex justify-between items-center ${
                        adaptiveConfig.needsCompactLayout ? 'flex-col space-y-2' : 'flex-row'
                      }`}>
                        <span className={`font-bold text-gray-900 flex items-center ${
                          adaptiveConfig.needsCompactLayout ? 'text-lg' : 'text-xl'
                        }`}>
                          <span className="mr-2">💰</span>
                          TOTAL A PAGAR
                        </span>
                        <span className={`font-bold text-green-600 ${
                          adaptiveConfig.needsCompactLayout ? 'text-xl' : 'text-2xl'
                        }`}>
                          ${(total + deliveryCost).toLocaleString()} CUP
                        </span>
                      </div>
                      {deliveryCost > 0 && (
                        <div className={`mt-2 text-gray-600 text-center ${
                          adaptiveConfig.needsCompactLayout ? 'text-xs' : 'text-sm'
                        }`}>
                          Incluye ${deliveryCost.toLocaleString()} CUP de entrega
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Device and connection info */}
                <div className="mt-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 p-3">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        {deviceInfo.deviceEmoji}
                        <span className="ml-1">{adaptiveConfig.deviceLabel}</span>
                      </div>
                      <div className="flex items-center">
                        {deviceInfo.osEmoji}
                        <span className="ml-1">{deviceInfo.os.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center">
                        {deviceInfo.browserEmoji}
                        <span className="ml-1 hidden sm:inline">{deviceInfo.browser}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {deviceInfo.isOnline ? (
                        <div className="flex items-center text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                          <span>En línea</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                          <span>Sin conexión</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button - Adaptativo universal */}
            <button
              type="submit"
              disabled={isSubmitting || !deviceInfo.isOnline}
              className={`w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center ${
                adaptiveConfig.needsLargerButtons ? 'px-4 py-5 text-base' : 'px-6 py-4 text-lg'
              } ${isSubmitting ? 'animate-pulse' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  <span>Procesando...</span>
                </>
              ) : !deviceInfo.isOnline ? (
                <>
                  <Wifi className="h-5 w-5 mr-3" />
                  <span>Sin conexión a internet</span>
                </>
              ) : (
                <>
                  <div className="bg-white/20 p-2 rounded-lg mr-3">
                    <Send className="h-5 w-5" />
                  </div>
                  <span>📱 Enviar Pedido por WhatsApp</span>
                  <div className="ml-3 flex items-center text-sm opacity-80">
                    {deviceInfo.osEmoji}
                    <span className="ml-1 hidden sm:inline">{deviceInfo.os.toUpperCase()}</span>
                  </div>
                </>
              )}
            </button>
            
            <div className={`text-center mt-4 bg-green-50 rounded-xl border border-green-200 ${adaptiveConfig.spacing.padding}`}>
              <p className={`text-green-700 font-medium flex items-center justify-center ${
                adaptiveConfig.needsCompactLayout ? 'text-xs' : 'text-sm'
              }`}>
                <span className="mr-2">ℹ️</span>
                Al enviar el pedido serás redirigido a WhatsApp
              </p>
              <div className={`mt-2 flex items-center justify-center text-green-600 ${
                adaptiveConfig.needsCompactLayout ? 'text-xs' : 'text-xs'
              }`}>
                <div className="flex items-center space-x-2">
                  <span>{deviceInfo.osEmoji}</span>
                  <span>Compatible con {deviceInfo.os.toUpperCase()}</span>
                  <span>•</span>
                  <span>{deviceInfo.browserEmoji}</span>
                  <span className="hidden sm:inline">{deviceInfo.browser}</span>
                  <span>•</span>
                  <span>{adaptiveConfig.deviceLabel}</span>
                </div>
              </div>
              {deviceInfo.connectionType !== 'unknown' && (
                <div className="mt-1 text-xs text-gray-500">
                  Conexión: {deviceInfo.connectionType.toUpperCase()}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}