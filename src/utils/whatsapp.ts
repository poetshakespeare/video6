import { OrderData } from '../components/CheckoutModal';

export function sendOrderToWhatsApp(orderData: OrderData): void {
  const { 
    orderId, 
    customerInfo, 
    paymentMethod, 
    deliveryZone, 
    deliveryCost, 
    items, 
    subtotal, 
    transferFee, 
    total 
  } = orderData;

  // Formatear lista de productos
  const itemsList = items
    .map(item => {
      const seasonInfo = item.selectedSeasons && item.selectedSeasons.length > 0 
        ? ` (Temporadas: ${item.selectedSeasons.sort((a, b) => a - b).join(', ')})` 
        : '';
      const itemType = item.type === 'movie' ? 'Película' : 'Serie';
      const itemPrice = item.type === 'movie' ? 80 : (item.selectedSeasons?.length || 1) * 300;
      return `• ${item.title}${seasonInfo}\n  Tipo: ${itemType}\n  Precio: $${itemPrice} CUP`;
    })
    .join('\n\n');

  // Construir mensaje completo
  let message = `🎬 *NUEVO PEDIDO - TV A LA CARTA*\n\n`;
  message += `📋 *ID de Orden:* ${orderId}\n\n`;
  
  message += `👤 *DATOS DEL CLIENTE:*\n`;
  message += `• Nombre: ${customerInfo.fullName}\n`;
  if (customerInfo.idCard) {
    message += `• CI: ${customerInfo.idCard}\n`;
  }
  message += `• Teléfono: ${customerInfo.phone}\n`;
  message += `• Dirección: ${customerInfo.address}\n\n`;
  
  message += `🎯 *PRODUCTOS SOLICITADOS:*\n${itemsList}\n\n`;
  
  message += `💰 *RESUMEN DE COSTOS:*\n`;
  message += `• Subtotal: $${subtotal} CUP\n`;
  
  if (transferFee > 0) {
    message += `• Recargo transferencia (10%): +$${transferFee} CUP\n`;
  }
  
  message += `• Entrega (${deliveryZone}): +$${deliveryCost} CUP\n`;
  message += `• *TOTAL: $${total} CUP*\n\n`;
  
  message += `💳 *Forma de Pago:* ${paymentMethod === 'transfer' ? 'Transferencia Bancaria' : 'Efectivo'}\n`;
  message += `📍 *Zona de Entrega:* ${deliveryZone}\n\n`;
  
  message += `📱 *Enviado desde:* TV a la Carta App\n`;
  message += `⏰ *Fecha:* ${new Date().toLocaleString('es-ES')}`;
  
  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = '5354690878'; // Número de WhatsApp
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}