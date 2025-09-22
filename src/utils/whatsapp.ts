import { OrderData, CustomerInfo } from '../components/CheckoutModal';

// Detectar dispositivo, sistema operativo y navegador con máxima precisión universal
const getUniversalDeviceAndOSInfo = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const pixelRatio = window.devicePixelRatio || 1;

  // Detectar sistema operativo con versiones específicas y nuevos sistemas
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
    else if (userAgent.includes('opensuse')) osVersion = 'openSUSE';
    else if (userAgent.includes('manjaro')) osVersion = 'Manjaro';
    else if (userAgent.includes('elementary')) osVersion = 'Elementary';
    else if (userAgent.includes('pop')) osVersion = 'Pop!_OS';
  } else if (userAgent.includes('cros')) {
    os = 'chromeos';
    osEmoji = '🌐';
  } else if (userAgent.includes('freebsd')) {
    os = 'freebsd';
    osEmoji = '🔥';
  } else if (userAgent.includes('openbsd')) {
    os = 'openbsd';
    osEmoji = '🐡';
  } else if (userAgent.includes('netbsd')) {
    os = 'netbsd';
    osEmoji = '🟠';
  } else if (userAgent.includes('solaris')) {
    os = 'solaris';
    osEmoji = '☀️';
  } else if (userAgent.includes('aix')) {
    os = 'aix';
    osEmoji = '🔵';
  }

  // Detectar tipo de dispositivo con mayor precisión
  let deviceType = 'desktop';
  let deviceEmoji = '💻';
  
  if ((screenWidth <= 768 || screenHeight <= 768) && maxTouchPoints > 0) {
    deviceType = 'mobile';
    deviceEmoji = '📱';
  } else if ((screenWidth <= 1024 && screenWidth > 768) && maxTouchPoints > 0) {
    deviceType = 'tablet';
    deviceEmoji = '📱';
  } else if (screenWidth <= 1366 && screenWidth > 1024) {
    deviceType = 'laptop';
    deviceEmoji = '💻';
  } else if (screenWidth > 1366) {
    deviceType = 'desktop';
    deviceEmoji = '🖥️';
  }

  // Detectar navegador con versiones y nuevos navegadores
  let browser = 'unknown';
  let browserVersion = '';
  let browserEmoji = '🌐';
  
  if (userAgent.includes('edg')) {
    browser = 'edge';
    browserEmoji = '🔷';
    const match = userAgent.match(/edg\/([0-9\.]*)/);
    browserVersion = match ? match[1] : '';
  } else if (userAgent.includes('chrome') && !userAgent.includes('opr') && !userAgent.includes('brave')) {
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
  } else if (userAgent.includes('brave')) {
    browser = 'brave';
    browserEmoji = '🦁';
  } else if (userAgent.includes('vivaldi')) {
    browser = 'vivaldi';
    browserEmoji = '🎨';
  } else if (userAgent.includes('samsung')) {
    browser = 'samsung';
    browserEmoji = '📱';
  } else if (userAgent.includes('yandex')) {
    browser = 'yandex';
    browserEmoji = '🔴';
  } else if (userAgent.includes('duckduckgo')) {
    browser = 'duckduckgo';
    browserEmoji = '🦆';
  } else if (userAgent.includes('tor')) {
    browser = 'tor';
    browserEmoji = '🧅';
  }

  // Detectar características especiales
  const isHighDPI = pixelRatio > 1;
  const isRetina = pixelRatio >= 2;
  const hasTouch = maxTouchPoints > 0;
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
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
    hardwareConcurrency: navigator.hardwareConcurrency || 1,
    memoryGB: (navigator as any).deviceMemory || 'unknown',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
};

// Función universal para abrir WhatsApp en cualquier dispositivo, SO y navegador
const openWhatsAppUniversal = async (phoneNumber: string, message: string) => {
  const deviceInfo = getUniversalDeviceAndOSInfo();
  const encodedMessage = encodeURIComponent(message);
  
  // URLs de WhatsApp para diferentes plataformas y métodos
  const whatsappUrls = {
    // URL principal universal (funciona en la mayoría de casos)
    web: `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
    // URL alternativa para navegadores web
    webApi: `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`,
    // URL para aplicación móvil nativa
    app: `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`,
    // URL para WhatsApp Business
    business: `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
    // URL para WhatsApp Web específica
    webSpecific: `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`,
    // URL para dispositivos con esquemas personalizados
    intent: `intent://send?phone=${phoneNumber}&text=${encodedMessage}#Intent;scheme=whatsapp;package=com.whatsapp;end`,
  };

  // Función para detectar si WhatsApp está instalado (solo móviles)
  const detectWhatsAppInstalled = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (deviceInfo.deviceType !== 'mobile' && deviceInfo.deviceType !== 'tablet') {
        resolve(false);
        return;
      }

      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = whatsappUrls.app;
      
      let timeout: NodeJS.Timeout;
      let resolved = false;

      const cleanup = () => {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
        if (timeout) {
          clearTimeout(timeout);
        }
      };

      const handleLoad = () => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve(true);
        }
      };

      const handleError = () => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve(false);
        }
      };

      iframe.onload = handleLoad;
      iframe.onerror = handleError;

      timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve(false);
        }
      }, 2000);

      document.body.appendChild(iframe);
    });
  };

  // Función principal para abrir WhatsApp con múltiples métodos de fallback
  const tryOpenWhatsApp = async () => {
    let opened = false;
    let attempts = 0;
    const maxAttempts = 5;

    // Método 1: Aplicación nativa (solo móviles y tablets con Android/iOS)
    if ((deviceInfo.deviceType === 'mobile' || deviceInfo.deviceType === 'tablet') && 
        (deviceInfo.os === 'android' || deviceInfo.os === 'ios' || deviceInfo.os === 'ipados')) {
      
      try {
        attempts++;
        console.log(`Intento ${attempts}: Abriendo aplicación nativa de WhatsApp...`);
        
        // Detectar si WhatsApp está instalado
        const isInstalled = await detectWhatsAppInstalled();
        
        if (isInstalled) {
          // Crear enlace temporal para la aplicación
          const appLink = document.createElement('a');
          appLink.href = whatsappUrls.app;
          appLink.style.display = 'none';
          document.body.appendChild(appLink);
          appLink.click();
          document.body.removeChild(appLink);
          
          // Verificar si se abrió la app
          const startTime = Date.now();
          const checkInterval = setInterval(() => {
            if (document.hidden || Date.now() - startTime > 3000) {
              clearInterval(checkInterval);
              if (!document.hidden) {
                // La app no se abrió, continuar con métodos web
                console.log('App nativa no disponible, usando métodos web...');
                tryWebMethods();
              } else {
                opened = true;
              }
            }
          }, 500);
          
          return;
        }
      } catch (error) {
        console.warn('Error con aplicación nativa de WhatsApp:', error);
      }
    }

    // Función para métodos web
    const tryWebMethods = async () => {
      const webMethods = [
        { name: 'WhatsApp Web Principal', url: whatsappUrls.web },
        { name: 'WhatsApp API', url: whatsappUrls.webApi },
        { name: 'WhatsApp Web Específico', url: whatsappUrls.webSpecific },
        { name: 'WhatsApp Business', url: whatsappUrls.business }
      ];

      for (const method of webMethods) {
        if (opened || attempts >= maxAttempts) break;
        
        try {
          attempts++;
          console.log(`Intento ${attempts}: ${method.name}...`);
          
          // Método A: Intentar abrir en nueva pestaña/ventana
          const windowFeatures = getOptimalWindowFeatures();
          const newWindow = window.open(method.url, '_blank', windowFeatures);
          
          if (newWindow && !newWindow.closed && typeof newWindow.closed !== 'undefined') {
            // Ventana abierta exitosamente
            opened = true;
            console.log(`✅ ${method.name} abierto exitosamente`);
            
            // Verificar si la ventana sigue abierta después de un tiempo
            setTimeout(() => {
              try {
                if (newWindow.closed) {
                  console.log('✅ Usuario interactuó con WhatsApp');
                } else {
                  console.log('ℹ️ WhatsApp Web abierto en nueva pestaña');
                }
              } catch (e) {
                // Error de CORS es normal, significa que WhatsApp se cargó
                console.log('✅ WhatsApp cargado (CORS esperado)');
              }
            }, 2000);
            
            break;
          } else {
            // Popup bloqueado, intentar método alternativo
            console.log(`⚠️ Popup bloqueado para ${method.name}, intentando método alternativo...`);
            
            // Método B: Crear enlace temporal y hacer clic
            const tempLink = document.createElement('a');
            tempLink.href = method.url;
            tempLink.target = '_blank';
            tempLink.rel = 'noopener noreferrer';
            tempLink.style.display = 'none';
            document.body.appendChild(tempLink);
            
            // Simular clic del usuario
            const clickEvent = new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window
            });
            
            tempLink.dispatchEvent(clickEvent);
            document.body.removeChild(tempLink);
            
            // Esperar un momento para verificar
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (document.hidden) {
              opened = true;
              console.log(`✅ ${method.name} abierto con enlace temporal`);
              break;
            }
          }
        } catch (error) {
          console.warn(`Error con ${method.name}:`, error);
        }
      }

      // Método final: Redirigir en la misma pestaña
      if (!opened && attempts < maxAttempts) {
        try {
          attempts++;
          console.log(`Intento ${attempts}: Redirigiendo en la misma pestaña...`);
          
          // Guardar el estado actual
          sessionStorage.setItem('whatsapp_redirect', 'true');
          sessionStorage.setItem('return_url', window.location.href);
          
          // Redirigir
          window.location.href = whatsappUrls.web;
          opened = true;
        } catch (error) {
          console.error('Error en redirección final:', error);
        }
      }

      // Si nada funcionó, mostrar instrucciones manuales
      if (!opened) {
        showManualInstructions(phoneNumber, message);
      }
    };

    // Iniciar con métodos web
    await tryWebMethods();
  };

  // Obtener características óptimas de ventana según el dispositivo
  const getOptimalWindowFeatures = (): string => {
    const { deviceType, screenWidth, screenHeight, os } = deviceInfo;
    
    let width = 800;
    let height = 600;
    
    // Ajustar tamaño según el dispositivo
    if (deviceType === 'mobile') {
      width = Math.min(screenWidth * 0.95, 400);
      height = Math.min(screenHeight * 0.9, 600);
    } else if (deviceType === 'tablet') {
      width = Math.min(screenWidth * 0.8, 600);
      height = Math.min(screenHeight * 0.8, 700);
    } else if (deviceType === 'laptop') {
      width = Math.min(screenWidth * 0.7, 900);
      height = Math.min(screenHeight * 0.8, 700);
    } else {
      width = Math.min(screenWidth * 0.6, 1000);
      height = Math.min(screenHeight * 0.8, 800);
    }

    const left = Math.max(0, (screenWidth - width) / 2);
    const top = Math.max(0, (screenHeight - height) / 2);

    const features = [
      'noopener=yes',
      'noreferrer=yes',
      `width=${width}`,
      `height=${height}`,
      `left=${left}`,
      `top=${top}`,
      'scrollbars=yes',
      'resizable=yes',
      'status=no',
      'toolbar=no',
      'menubar=no',
      'location=no'
    ];

    // Características específicas por SO
    if (os === 'ios' || os === 'ipados') {
      features.push('fullscreen=no');
    } else if (os === 'android') {
      features.push('fullscreen=yes');
    }

    return features.join(',');
  };

  // Mostrar instrucciones manuales como último recurso
  const showManualInstructions = (phoneNumber: string, message: string) => {
    const instructions = `
No se pudo abrir WhatsApp automáticamente.

Por favor, sigue estos pasos:

1. Abre WhatsApp manualmente en tu dispositivo
2. Busca el contacto: +${phoneNumber}
3. Copia y pega este mensaje:

${message}

O visita directamente: https://wa.me/${phoneNumber}
    `;
    
    // Crear modal de instrucciones
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 20px;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
      background: white;
      padding: 30px;
      border-radius: 15px;
      max-width: 500px;
      width: 100%;
      max-height: 80vh;
      overflow-y: auto;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    `;
    
    content.innerHTML = `
      <h3 style="color: #25D366; font-size: 24px; margin-bottom: 20px;">📱 WhatsApp Manual</h3>
      <pre style="background: #f5f5f5; padding: 15px; border-radius: 10px; white-space: pre-wrap; text-align: left; font-size: 12px; margin: 20px 0;">${instructions}</pre>
      <div style="margin-top: 20px;">
        <button onclick="navigator.clipboard.writeText('${message.replace(/'/g, "\\'")}').then(() => alert('Mensaje copiado al portapapeles'))" style="background: #25D366; color: white; border: none; padding: 10px 20px; border-radius: 10px; margin-right: 10px; cursor: pointer;">📋 Copiar Mensaje</button>
        <button onclick="window.open('https://wa.me/${phoneNumber}', '_blank')" style="background: #128C7E; color: white; border: none; padding: 10px 20px; border-radius: 10px; margin-right: 10px; cursor: pointer;">🌐 Abrir WhatsApp Web</button>
        <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer;">❌ Cerrar</button>
      </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Auto-cerrar después de 30 segundos
    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    }, 30000);
  };

  // Ejecutar con delay para mejor compatibilidad
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

  const deviceInfo = getUniversalDeviceAndOSInfo();

  // Obtener configuración actual del sistema
  const getCurrentSystemConfig = () => {
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

  const currentPrices = getCurrentSystemConfig();
  const transferFeePercentage = currentPrices.transferFeePercentage;
  
  // Formatear lista de productos con información detallada
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

  // Construir mensaje completo con información detallada del dispositivo y sistema
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
  
  // Información de entrega detallada
  message += `\n📍 *INFORMACIÓN DE ENTREGA:*\n`;
  if (pickupLocation) {
    message += `🏪 *RECOGIDA EN EL LOCAL:*\n`;
    message += `• Ubicación: TV a la Carta\n`;
    message += `• Dirección: Reparto Nuevo Vista Alegre, Santiago de Cuba\n`;
    message += `• Costo: GRATIS\n`;
    message += `• Horario: 9:00 AM - 8:00 PM\n`;
    
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
    message += `• Tiempo estimado: 24-48 horas\n`;
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
  
  // Información completa del dispositivo y sistema
  message += `📱 *INFORMACIÓN TÉCNICA DEL DISPOSITIVO:*\n`;
  message += `• Dispositivo: ${deviceInfo.deviceEmoji} ${deviceInfo.deviceType.charAt(0).toUpperCase() + deviceInfo.deviceType.slice(1)}\n`;
  message += `• Sistema operativo: ${deviceInfo.osEmoji} ${deviceInfo.os.toUpperCase()}${deviceInfo.osVersion ? ` ${deviceInfo.osVersion}` : ''}\n`;
  message += `• Navegador: ${deviceInfo.browserEmoji} ${deviceInfo.browser.charAt(0).toUpperCase() + deviceInfo.browser.slice(1)}${deviceInfo.browserVersion ? ` ${deviceInfo.browserVersion}` : ''}\n`;
  message += `• Pantalla: ${deviceInfo.screenWidth}x${deviceInfo.screenHeight}px${deviceInfo.isTouchDevice ? ' (Táctil)' : ''}${deviceInfo.isRetina ? ' (Retina)' : ''}\n`;
  message += `• Idioma: ${deviceInfo.language} (${deviceInfo.languages?.join(', ') || 'N/A'})\n`;
  message += `• Zona horaria: ${deviceInfo.timezone}\n`;
  message += `• Conexión: ${deviceInfo.connectionType.toUpperCase()} ${deviceInfo.isOnline ? '🟢 En línea' : '🔴 Sin conexión'}\n`;
  message += `• Procesador: ${deviceInfo.hardwareConcurrency} núcleos\n`;
  if (deviceInfo.memoryGB !== 'unknown') {
    message += `• Memoria RAM: ${deviceInfo.memoryGB}GB\n`;
  }
  message += `• Cookies habilitadas: ${deviceInfo.cookieEnabled ? 'Sí' : 'No'}\n`;
  message += `• Do Not Track: ${deviceInfo.doNotTrack || 'No especificado'}\n`;
  
  message += `\n📱 *Enviado desde:* TV a la Carta App Universal\n`;
  message += `⏰ *Fecha y hora:* ${new Date().toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'America/Havana'
  })} (Cuba)\n`;
  message += `🌍 *Hora local del cliente:* ${new Date().toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: deviceInfo.timezone
  })}\n`;
  message += `🌟 *¡Gracias por elegir TV a la Carta!*\n`;
  message += `🔧 *Compatibilidad universal garantizada para todos los dispositivos y sistemas operativos*`;
  
  // Usar la función universal para abrir WhatsApp
  const phoneNumber = '5354690878';
  openWhatsAppUniversal(phoneNumber, message);
}