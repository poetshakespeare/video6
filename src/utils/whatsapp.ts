import { CartItem } from '../types/movie';

export function sendToWhatsApp(items: CartItem[], totalPrice: number): void {
  const itemsList = items
    .map(item => `• ${item.title} - $${item.price}`)
    .join('\n');
  
  const message = `Hi! I'd like to purchase these items:\n\n${itemsList}\n\nTotal: $${totalPrice.toFixed(2)}`;
  
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
}