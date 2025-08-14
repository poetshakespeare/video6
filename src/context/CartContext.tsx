import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Toast } from '../components/Toast';
import type { CartItem } from '../types/movie';

interface SeriesCartItem extends CartItem {
  selectedSeasons?: number[];
}

interface CartState {
  items: SeriesCartItem[];
  total: number;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: SeriesCartItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_SEASONS'; payload: { id: number; seasons: number[] } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: SeriesCartItem[] };

interface CartContextType {
  state: CartState;
  addItem: (item: SeriesCartItem) => void;
  removeItem: (id: number) => void;
  updateSeasons: (id: number, seasons: number[]) => void;
  clearCart: () => void;
  isInCart: (id: number) => boolean;
  getItemSeasons: (id: number) => number[];
  calculateItemPrice: (item: SeriesCartItem) => number;
  calculateTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      if (state.items.some(item => item.id === action.payload.id && item.type === action.payload.type)) {
        return state;
      }
      return {
        ...state,
        items: [...state.items, action.payload],
        total: state.total + 1
      };
    case 'UPDATE_SEASONS':
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.payload.id 
            ? { ...item, selectedSeasons: action.payload.seasons }
            : item
        )
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - 1
      };
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0
      };
    case 'LOAD_CART':
      return {
        items: action.payload,
        total: action.payload.length
      };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
  const [toast, setToast] = React.useState<{
    message: string;
    type: 'success' | 'error';
    isVisible: boolean;
  }>({ message: '', type: 'success', isVisible: false });

  useEffect(() => {
    const savedCart = localStorage.getItem('movieCart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: items });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('movieCart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (item: SeriesCartItem) => {
    const price = calculateItemPrice(item);
    const itemWithPrice = { ...item, price, totalPrice: price };
    dispatch({ type: 'ADD_ITEM', payload: item });
    
    // Mostrar notificación
    setToast({
      message: `"${item.title}" agregado al carrito`,
      type: 'success',
      isVisible: true
    });
  };

  const removeItem = (id: number) => {
    const item = state.items.find(item => item.id === id);
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    
    // Mostrar notificación
    if (item) {
      setToast({
        message: `"${item.title}" retirado del carrito`,
        type: 'error',
        isVisible: true
      });
    }
  };

  const updateSeasons = (id: number, seasons: number[]) => {
    const item = state.items.find(item => item.id === id);
    if (item) {
      const updatedItem = { ...item, selectedSeasons: seasons };
      const newPrice = calculateItemPrice(updatedItem);
      updatedItem.price = newPrice;
      updatedItem.totalPrice = newPrice;
    }
    dispatch({ type: 'UPDATE_SEASONS', payload: { id, seasons } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const isInCart = (id: number) => {
    return state.items.some(item => item.id === id);
  };

  const getItemSeasons = (id: number): number[] => {
    const item = state.items.find(item => item.id === id);
    return item?.selectedSeasons || [];
  };

  const calculateItemPrice = (item: SeriesCartItem): number => {
    const isAnime = item.original_language === 'ja' || 
                   (item.genre_ids && item.genre_ids.includes(16)) ||
                   item.title?.toLowerCase().includes('anime');
    
    if (item.type === 'movie') {
      return isAnime ? 80 : 80; // Películas y animados: $80 CUP
    } else {
      // Series: $300 CUP por temporada
      const seasons = item.selectedSeasons?.length || 1;
      return seasons * 300;
    }
  };

  const calculateTotalPrice = (): number => {
    return state.items.reduce((total, item) => {
      return total + calculateItemPrice(item);
    }, 0);
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };
  return (
    <CartContext.Provider value={{ 
      state, 
      addItem, 
      removeItem, 
      updateSeasons, 
      clearCart, 
      isInCart, 
      getItemSeasons,
      calculateItemPrice,
      calculateTotalPrice
    }}>
      {children}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}