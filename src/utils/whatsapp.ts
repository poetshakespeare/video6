import { OrderData, CustomerInfo } from '../components/CheckoutModal';

// Detectar dispositivo y sistema operativo para WhatsApp
const getDeviceAndOSInfo = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const screenWidth = window.screen.width;

  // Detectar sistema operativo con mayor precisión
  let os = 'unknown';
  let osVersion = '';
  
  if (userAgent.includes('android')) {
    os = 'android';
    const match = userAgent.match(/android\s([0-9\.]*)/);
    osVersion = match ? match[1] : '';
  } else if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ipod')) {
    os = 'ios';
    const match = userAgent.match(/os\s([0-9_]*)/);
    osVersion = match ? match[1].replace(/_/g, '.') : '';
  } else if (userAgent.includes('mac')) {
    os = 'macos';
    const match = userAgent.match(/mac\sos\sx\s([0-9_]*)/);
    osVersion = match ? match[1].replace(/_/g, '.') : '';
  } else if (userAgent.includes('win')) {
    os = 'windows';
    if (userAgent.includes('windows nt 10.0')) osVersion = '10/11';
    else if (userAgent.includes('windows nt 6.3')) osVersion = '8.1';
    else if (userAgent.includes('windows nt 6.2')) osVersion = '8';
    else if (userAgent.includes('windows nt 6.1')) osVersion = '7';
  } else if (userAgent.includes('linux')) {
    os = 'linux';
    if (userAgent.includes('ubuntu')) osVersion = 'Ubuntu';
    else if (userAgent.includes('debian')) osVersion = 'Debian';
    else if (userAgent.includes('fedora')) osVersion = 'Fedora';
    else if (userAgent.includes('centos')) osVersion = 'CentOS';
  } else if (userAgent.includes('cros')) {
    os = 'chromeos';
  }

  // Detectar tipo de dispositivo
  let deviceType = 'desktop';
  if ((screenWidth <= 768) && maxTouchPoints > 0) {
    deviceType = 'mobile';
  } else if ((screenWidth <= 1024 && screenWidth > 768) && maxTouchPoints > 0) {
    deviceType = 'tablet';
  }

  // Detectar navegador
  let browser = 'unknown';
  if (userAgent.includes('chrome') && !userAgent.includes('edg') && !userAgent.includes('opr')) {
    browser = 'chrome';
  } else if (userAgent.includes('firefox')) {
    browser = 'firefox';
  } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    browser = 'safari';
  } else if (userAgent.includes('edg')) {
    browser = 'edge';
  } else if (userAgent.includes('opr') || userAgent.includes('opera')) {
    browser = 'opera';
  } else if (userAgent.includes('samsung')) {
    browser = 'samsung';
  }

  return {
    os,
    osVersion,
    deviceType,
    browser,
    screenWidth,
    maxTouchPoints,
    isTouchDevice: maxTouchPoints > 0,
    userAgent: navigator.userAgent
  };
};

// Función mejorada para abrir WhatsApp en cualquier dispositivo y navegador
const openWhatsAppUniversal = (phoneNumber: string, message: string) => {
  const deviceInfo = getDeviceAndOSInfo();
  const encodedMessage = encodeURIComponent(message);
  
  // URLs de WhatsApp para diferentes plataformas
  const whatsappUrls = {
    // URL principal (funciona en la mayoría de casos)
    web: `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
    // URL alternativa para navegadores web
    webApi: `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`,
    // URL para aplicación móvil
    app: `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`,
    // URL para WhatsApp Business
    business: `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
  };

  // Función para intentar abrir WhatsApp con múltiples métodos
  const tryOpenWhatsApp = () => {
    let opened = false;

    // Método 1: Intentar abrir la aplicación nativa (móviles y tablets)
    if ((deviceInfo.deviceType === 'mobile' || deviceInfo.deviceType === 'tablet') && 
        (deviceInfo.os === 'android' || deviceInfo.os === 'ios')) {
      
      try {
        // Crear un enlace temporal para la aplicación
        const appLink = document.createElement('a');
        appLink.href = whatsappUrls.app;
        appLink.style.display = 'none';
        document.body.appendChild(appLink);
        appLink.click();
        document.body.removeChild(appLink);
        
        // Verificar si se abrió la app después de un breve delay
        setTimeout(() => {
          if (!document.hidden) {
            // Si la página sigue visible, la app no se abrió, usar web
            window.open(whatsappUrls.web, '_blank', 'noopener,noreferrer');
          }
        }, 1000);
        
        opened = true;
      } catch (error) {
        console.warn('No se pudo abrir la aplicación nativa de WhatsApp:', error);
      }
    }

    // Método 2: Abrir en navegador web (todos los dispositivos)
    if (!opened) {
      try {
        // Intentar abrir en nueva pestaña
        const newWindow = window.open(whatsappUrls.web, '_blank', 'noopener,noreferrer,width=800,height=600');
        
        // Verificar si se bloqueó el popup
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          // Fallback: redirigir en la misma pestaña
          window.location.href = whatsappUrls.web;
        } else {
          opened = true;
        }
      } catch (error) {
        console.warn('Error abriendo WhatsApp Web:', error);
        
        // Último recurso: intentar con la API alternativa
        try {
          window.location.href = whatsappUrls.webApi;
        } catch (finalError) {
          console.error('No se pudo abrir WhatsApp:', finalError);
          alert('No se pudo abrir WhatsApp automáticamente. Por favor, contacta manualmente al +53 5469 0878');
        }
      }
    }
  };

  // Ejecutar con un pequeño delay para mejor compatibilidad
  setTimeout(tryOpenWhatsApp, 100);
};

export function sendOrderToWhatsApp(orderData: OrderData): void {
  const { 
    orderId, 
    customerInfo, 
    deliveryZone, 
    deliveryCost, 
    items, 
    subtotal, 
    transferFee, 
    total,
    cashTotal = 0,
    transferTotal = 0,
    pickupLocation = false,
    showLocationMap = false
  } = orderData;

  const deviceInfo = getDeviceAndOSInfo();

  // Obtener configuración actual
  const getTransferFeePercentage = () => {
    try {
      const adminState = localStorage.getItem('admin_system_state');
      if (adminState) {
        const state = JSON.parse(adminState);
        return state.prices?.transferFeePercentage || 10;
      }
    } catch (error) {
      console.warn('No se pudo obtener el porcentaje de transferencia del admin:', error);
    }
    return 10;
  };

  const getCurrentPrices = () => {
    try {
      const adminState = localStorage.getItem('admin_system_state');
      if (adminState) {
        const state = JSON.parse(adminState);
        return {
          moviePrice: state.prices?.moviePrice || 80,
          seriesPrice: state.prices?.seriesPrice || 300,
          novelPricePerChapter: state.prices?.novelPricePerChapter || 5,
          transferFeePercentage: state.prices?.transferFeePercentage || 10
        };
      }
    } catch (error) {
      console.warn('No se pudieron obtener los precios del admin:', error);
    }
    return {
      moviePrice: 80,
      seriesPrice: 300,
      novelPricePerChapter: 5,
      transferFeePercentage: 10
    };
  };

  const currentPrices = getCurrentPrices();
  const transferFeePercentage = currentPrices.transferFeePercentage;
  
  // Formatear lista de productos
  const itemsList = items
    .map(item => {
      const seasonInfo = item.type === 'tv' && item.selectedSeasons && item.selectedSeasons.length > 0 
        ? `\n  📺 Temporadas: ${item.selectedSeasons.sort((a, b) => a - b).join(', ')}` 
        : '';
      
      const extendedSeriesInfo = item.type === 'tv' && item.episodeCount && item.episodeCount > 50
        ? `\n  📊 Serie extensa: ${item.episodeCount} episodios totales`
        : '';
      
      const novelInfo = item.type === 'novel' 
        ? `\n  📚 Capítulos: ${item.chapters}\n  📖 Género: ${item.genre}` 
        : '';
      
      const itemType = item.type === 'movie' ? 'Película' : item.type === 'tv' ? 'Serie' : 'Novela';
      
      let basePrice: number;
      if (item.type === 'novel') {
        basePrice = item.chapters * currentPrices.novelPricePerChapter;
      } else if (item.type === 'movie') {
        basePrice = currentPrices.moviePrice;
      } else {
        basePrice = (item.selectedSeasons?.length || 1) * currentPrices.seriesPrice;
      }
      
      const finalPrice = item.paymentType === 'transfer' ? Math.round(basePrice * (1 + transferFeePercentage / 100)) : basePrice;
      const paymentTypeText = item.paymentType === 'transfer' ? `Transferencia (+${transferFeePercentage}%)` : 'Efectivo';
      const emoji = item.type === 'movie' ? '🎬' : item.type === 'tv' ? '📺' : '📚';
      
      let itemText = `${emoji} *${item.title}*${seasonInfo}${extendedSeriesInfo}${novelInfo}\n`;
      itemText += `  📋 Tipo: ${itemType}\n`;
      
      if (item.type === 'tv' && item.episodeCount && item.episodeCount > 50) {
        itemText += `  📊 Serie extensa: ${item.episodeCount} episodios (precio estándar $${currentPrices.seriesPrice} CUP/temporada)\n`;
      }
      
      itemText += `  💳 Método de pago: ${paymentTypeText}\n`;
      
      if (item.paymentType === 'transfer') {
        const recargo = finalPrice - basePrice;
        itemText += `  💰 Precio base: $${basePrice.toLocaleString()} CUP\n`;
        itemText += `  💳 Recargo transferencia (${transferFeePercentage}%): +$${recargo.toLocaleString()} CUP\n`;
        itemText += `  💰 Precio final: $${finalPrice.toLocaleString()} CUP`;
      } else {
        itemText += `  💰 Precio: $${finalPrice.toLocaleString()} CUP`;
      }
      
      return itemText;
    })
    .join('\n\n');

  // Construir mensaje completo con información del dispositivo
  let message = `🎬 *NUEVO PEDIDO - TV A LA CARTA*\n\n`;
  message += `📋 *ID de Orden:* ${orderId}\n\n`;
  
  message += `👤 *DATOS DEL CLIENTE:*\n`;
  message += `• Nombre: ${customerInfo.fullName}\n`;
  message += `• Teléfono: ${customerInfo.phone}\n`;
  if (!pickupLocation && customerInfo.address) {
    message += `• Dirección: ${customerInfo.address}\n`;
  }
  message += `\n`;
  
  message += `🎯 *PRODUCTOS SOLICITADOS:*\n${itemsList}\n\n`;
  
  // Desglosar por tipo de pago
  const cashItems = items.filter(item => item.paymentType === 'cash');
  const transferItems = items.filter(item => item.paymentType === 'transfer');
  
  message += `📊 *DESGLOSE DETALLADO POR MÉTODO DE PAGO:*\n`;
  
  if (cashItems.length > 0) {
    message += `💵 *PAGO EN EFECTIVO:*\n`;
    cashItems.forEach(item => {
      let basePrice: number;
      if (item.type === 'novel') {
        basePrice = item.chapters * currentPrices.novelPricePerChapter;
      } else if (item.type === 'movie') {
        basePrice = currentPrices.moviePrice;
      } else {
        basePrice = (item.selectedSeasons?.length || 1) * currentPrices.seriesPrice;
      }
      const emoji = item.type === 'movie' ? '🎬' : item.type === 'tv' ? '📺' : '📚';
      message += `  ${emoji} ${item.title}: $${basePrice.toLocaleString()} CUP\n`;
    });
    message += `  💰 *Subtotal Efectivo: $${cashTotal.toLocaleString()} CUP*\n\n`;
  }
  
  if (transferItems.length > 0) {
    message += `🏦 *PAGO POR TRANSFERENCIA BANCARIA (+${transferFeePercentage}%):*\n`;
    transferItems.forEach(item => {
      let basePrice: number;
      if (item.type === 'novel') {
        basePrice = item.chapters * currentPrices.novelPricePerChapter;
      } else if (item.type === 'movie') {
        basePrice = currentPrices.moviePrice;
      } else {
        basePrice = (item.selectedSeasons?.length || 1) * currentPrices.seriesPrice;
      }
      const finalPrice = Math.round(basePrice * (1 + transferFeePercentage / 100));
      const recargo = finalPrice - basePrice;
      const emoji = item.type === 'movie' ? '🎬' : item.type === 'tv' ? '📺' : '📚';
      message += `  ${emoji} ${item.title}:\n`;
      message += `    💰 Base: $${basePrice.toLocaleString()} CUP\n`;
      message += `    💳 Recargo (${transferFeePercentage}%): +$${recargo.toLocaleString()} CUP\n`;
      message += `    💰 Total: $${finalPrice.toLocaleString()} CUP\n`;
    });
    message += `  💰 *Subtotal Transferencia: $${transferTotal.toLocaleString()} CUP*\n\n`;
  }
  
  message += `📋 *RESUMEN FINAL DE PAGOS:*\n`;
  if (cashTotal > 0) {
    message += `• Efectivo: $${cashTotal.toLocaleString()} CUP (${cashItems.length} elementos)\n`;
  }
  if (transferTotal > 0) {
    message += `• Transferencia: $${transferTotal.toLocaleString()} CUP (${transferItems.length} elementos)\n`;
  }
  message += `• *Subtotal Contenido: $${subtotal.toLocaleString()} CUP*\n`;
  
  if (transferFee > 0) {
    message += `• Recargo transferencia (${transferFeePercentage}%): +$${transferFee.toLocaleString()} CUP\n`;
  }
  
  // Información de entrega
  message += `\n📍 *INFORMACIÓN DE ENTREGA:*\n`;
  if (pickupLocation) {
    message += `🏪 *RECOGIDA EN EL LOCAL:*\n`;
    message += `• Ubicación: TV a la Carta\n`;
    message += `• Dirección: Reparto Nuevo Vista Alegre, Santiago de Cuba\n`;
    message += `• Costo: GRATIS\n`;
    
    if (showLocationMap) {
      message += `• 📍 Coordenadas GPS: 20.039585, -75.849663\n`;
      message += `• 🗺️ Google Maps: https://www.google.com/maps/place/20%C2%B002'22.5%22N+75%C2%B050'58.8%22W/@20.0394604,-75.8495414,180m/data=!3m1!1e3!4m4!3m3!8m2!3d20.039585!4d-75.849663?entry=ttu&g_ep=EgoyMDI1MDczMC4wIKXMDSoASAFQAw%3D%3D\n`;
    }
  } else {
    message += `🚚 *ENTREGA A DOMICILIO:*\n`;
    message += `• Zona: ${deliveryZone.replace(' > ', ' → ')}\n`;
    if (customerInfo.address) {
      message += `• Dirección: ${customerInfo.address}\n`;
    }
    message += `• Costo de entrega: $${deliveryCost.toLocaleString()} CUP\n`;
  }
  
  message += `\n🎯 *TOTAL FINAL: $${total.toLocaleString()} CUP*\n\n`;
  
  message += `📊 *ESTADÍSTICAS DEL PEDIDO:*\n`;
  message += `• Total de elementos: ${items.length}\n`;
  message += `• Películas: ${items.filter(item => item.type === 'movie').length}\n`;
  message += `• Series: ${items.filter(item => item.type === 'tv').length}\n`;
  message += `• Novelas: ${items.filter(item => item.type === 'novel').length}\n`;
  if (cashItems.length > 0) {
    message += `• Pago en efectivo: ${cashItems.length} elementos\n`;
  }
  if (transferItems.length > 0) {
    message += `• Pago por transferencia: ${transferItems.length} elementos\n`;
  }
  message += `• Tipo de entrega: ${pickupLocation ? 'Recogida en local' : 'Entrega a domicilio'}\n\n`;
  
  message += `💼 *CONFIGURACIÓN DE PRECIOS APLICADA:*\n`;
  message += `• Películas: $${currentPrices.moviePrice.toLocaleString()} CUP\n`;
  message += `• Series: $${currentPrices.seriesPrice.toLocaleString()} CUP por temporada\n`;
  message += `• Novelas: $${currentPrices.novelPricePerChapter.toLocaleString()} CUP por capítulo\n`;
  message += `• Recargo transferencia: ${transferFeePercentage}%\n\n`;
  
  // Información del dispositivo y sistema
  message += `📱 *INFORMACIÓN DEL DISPOSITIVO:*\n`;
  message += `• Dispositivo: ${deviceInfo.deviceType === 'mobile' ? '📱 Móvil' : deviceInfo.deviceType === 'tablet' ? '📱 Tablet' : '💻 PC/Laptop'}\n`;
  message += `• Sistema operativo: ${deviceInfo.os.toUpperCase()}${deviceInfo.osVersion ? ` ${deviceInfo.osVersion}` : ''}\n`;
  message += `• Navegador: ${deviceInfo.browser.charAt(0).toUpperCase() + deviceInfo.browser.slice(1)}\n`;
  message += `• Pantalla: ${deviceInfo.screenWidth}px${deviceInfo.isTouchDevice ? ' (Táctil)' : ''}\n`;
  
  message += `\n📱 *Enviado desde:* TV a la Carta App\n`;
  message += `⏰ *Fecha y hora:* ${new Date().toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'America/Havana'
  })}\n`;
  message += `🌟 *¡Gracias por elegir TV a la Carta!*`;
  
  // Usar la función universal para abrir WhatsApp
  const phoneNumber = '5354690878';
  openWhatsAppUniversal(phoneNumber, message);
}