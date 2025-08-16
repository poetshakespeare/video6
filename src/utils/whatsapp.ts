import { OrderData, CustomerInfo } from '../components/CheckoutModal';

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
    transferTotal = 0
  } = orderData;

  // Formatear lista de productos
  const itemsList = items
    .map(item => {
      const seasonInfo = item.selectedSeasons && item.selectedSeasons.length > 0 
        ? `\n  📺 Temporadas: ${item.selectedSeasons.sort((a, b) => a - b).join(', ')}` 
        : '';
      const itemType = item.type === 'movie' ? 'Película' : 'Serie';
      const basePrice = item.type === 'movie' ? 80 : (item.selectedSeasons?.length || 1) * 300;
      const finalPrice = item.paymentType === 'transfer' ? Math.round(basePrice * 1.1) : basePrice;
      const paymentTypeText = item.paymentType === 'transfer' ? 'Transferencia (+10%)' : 'Efectivo';
      const emoji = item.type === 'movie' ? '🎬' : '📺';
      return `${emoji} *${item.title}*${seasonInfo}\n  📋 Tipo: ${itemType}\n  💳 Pago: ${paymentTypeText}\n  💰 Precio: $${finalPrice.toLocaleString()} CUP`;
    })
    .join('\n\n');

  // Construir mensaje completo
  let message = `🎬 *NUEVO PEDIDO - TV A LA CARTA*\n\n`;
  message += `📋 *ID de Orden:* ${orderId}\n\n`;
  
  message += `👤 *DATOS DEL CLIENTE:*\n`;
  message += `• Nombre: ${customerInfo.fullName}\n`;
  message += `• Teléfono: ${customerInfo.phone}\n`;
  message += `• Dirección: ${customerInfo.address}\n\n`;
  
  message += `🎯 *PRODUCTOS SOLICITADOS:*\n${itemsList}\n\n`;
  
  message += `💰 *RESUMEN DE COSTOS:*\n`;
  
  // Desglosar por tipo de pago
  const cashItems = items.filter(item => item.paymentType === 'cash');
  const transferItems = items.filter(item => item.paymentType === 'transfer');
  
  // Mostrar desglose detallado por tipo de pago
  message += `\n📊 *DESGLOSE POR TIPO DE PAGO:*\n`;
  
  if (cashItems.length > 0) {
    message += `💵 *EFECTIVO:*\n`;
    cashItems.forEach(item => {
      const basePrice = item.type === 'movie' ? 80 : (item.selectedSeasons?.length || 1) * 300;
      const emoji = item.type === 'movie' ? '🎬' : '📺';
      message += `  ${emoji} ${item.title}: $${basePrice.toLocaleString()} CUP\n`;
    });
    message += `  💰 *Subtotal Efectivo: $${cashTotal.toLocaleString()} CUP*\n\n`;
  }
  
  if (transferItems.length > 0) {
    message += `🏦 *TRANSFERENCIA (+10%):*\n`;
    transferItems.forEach(item => {
      const basePrice = item.type === 'movie' ? 80 : (item.selectedSeasons?.length || 1) * 300;
      const finalPrice = Math.round(basePrice * 1.1);
      const emoji = item.type === 'movie' ? '🎬' : '📺';
      message += `  ${emoji} ${item.title}: $${basePrice.toLocaleString()} → $${finalPrice.toLocaleString()} CUP\n`;
    });
    message += `  💰 *Subtotal Transferencia: $${transferTotal.toLocaleString()} CUP*\n\n`;
  }
  
  message += `📋 *RESUMEN FINAL:*\n`;
  if (cashTotal > 0) {
    message += `• Efectivo: $${cashTotal.toLocaleString()} CUP (${cashItems.length} elementos)\n`;
  }
  if (transferTotal > 0) {
    message += `• Transferencia: $${transferTotal.toLocaleString()} CUP (${transferItems.length} elementos)\n`;
  }
  message += `• *Subtotal Contenido: $${subtotal.toLocaleString()} CUP*\n`;
  
  if (transferFee > 0) {
    message += `• Recargo transferencia (10%): +$${transferFee.toLocaleString()} CUP\n`;
  }
  
  message += `🚚 Entrega (${deliveryZone.split(' > ')[2]}): +$${deliveryCost.toLocaleString()} CUP\n`;
  message += `\n🎯 *TOTAL FINAL: $${total.toLocaleString()} CUP*\n\n`;
  
  message += `📍 *ZONA DE ENTREGA:*\n`;
  message += `${deliveryZone.replace(' > ', ' → ')}\n`;
  message += `💰 Costo de entrega: $${deliveryCost.toLocaleString()} CUP\n\n`;
  
  message += `📊 *ESTADÍSTICAS DEL PEDIDO:*\n`;
  message += `• Total de elementos: ${items.length}\n`;
  message += `• Películas: ${items.filter(item => item.type === 'movie').length}\n`;
  message += `• Series: ${items.filter(item => item.type === 'tv').length}\n`;
  if (cashItems.length > 0) {
    message += `• Pago en efectivo: ${cashItems.length} elementos\n`;
  }
  if (transferItems.length > 0) {
    message += `• Pago por transferencia: ${transferItems.length} elementos\n`;
  }
  message += `\n`;
  
  message += `📱 *Enviado desde:* TV a la Carta App\n`;
  message += `⏰ *Fecha y hora:* ${new Date().toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })}\n`;
  message += `🌟 *¡Gracias por elegir TV a la Carta!*`;
  
  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = '5354690878'; // Número de WhatsApp
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}