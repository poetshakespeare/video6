import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface Novel {
  id: number;
  titulo: string;
  genero: string;
  capitulos: number;
  año: number;
  descripcion?: string;
  pais?: string;
  imagen?: string;
  estado?: 'transmision' | 'finalizada';
  createdAt: string;
  updatedAt: string;
}

interface DeliveryZone {
  id: number;
  name: string;
  cost: number;
  createdAt: string;
  updatedAt: string;
}

interface Prices {
  moviePrice: number;
  seriesPrice: number;
  transferFeePercentage: number;
  novelPricePerChapter: number;
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: Date;
  read: boolean;
}

interface SystemConfig {
  version: string;
  lastBackup?: string;
  autoSync: boolean;
  syncInterval: number;
  enableNotifications: boolean;
  maxNotifications: number;
  settings?: any;
  metadata?: {
    totalOrders: number;
    totalRevenue: number;
    lastOrderDate: string;
    systemUptime: string;
  };
}

interface SyncStatus {
  lastSync: string;
  isOnline: boolean;
  pendingChanges: number;
}

interface AdminState {
  isAuthenticated: boolean;
  novels: Novel[];
  deliveryZones: DeliveryZone[];
  prices: Prices;
  notifications: Notification[];
  systemConfig: SystemConfig;
  syncStatus: SyncStatus;
}

type AdminAction = 
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' }
  | { type: 'ADD_NOVEL'; payload: Novel }
  | { type: 'UPDATE_NOVEL'; payload: Novel }
  | { type: 'DELETE_NOVEL'; payload: number }
  | { type: 'ADD_DELIVERY_ZONE'; payload: DeliveryZone }
  | { type: 'UPDATE_DELIVERY_ZONE'; payload: DeliveryZone }
  | { type: 'DELETE_DELIVERY_ZONE'; payload: number }
  | { type: 'UPDATE_PRICES'; payload: Prices }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'UPDATE_SYSTEM_CONFIG'; payload: Partial<SystemConfig> }
  | { type: 'LOAD_STATE'; payload: Partial<AdminState> }
  | { type: 'UPDATE_SYNC_STATUS'; payload: Partial<SyncStatus> };

interface AdminContextType {
  state: AdminState;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addNovel: (novel: Omit<Novel, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNovel: (novel: Novel) => void;
  deleteNovel: (id: number) => void;
  addDeliveryZone: (zone: Omit<DeliveryZone, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDeliveryZone: (zone: DeliveryZone) => void;
  deleteDeliveryZone: (id: number) => void;
  updatePrices: (prices: Prices) => void;
  addNotification: (message: string, type: Notification['type']) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  updateSystemConfig: (config: Partial<SystemConfig>) => void;
  exportSystemConfig: () => string;
  importSystemConfig: (configJson: string) => boolean;
  getAvailableCountries: () => string[];
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const initialState: AdminState = {
  isAuthenticated: false,
  novels: [],
  deliveryZones: [],
  prices: {
    moviePrice: 80,
    seriesPrice: 300,
    transferFeePercentage: 10,
    novelPricePerChapter: 5,
  },
  notifications: [],
  systemConfig: {
    version: '2.1.0',
    autoSync: true,
    syncInterval: 300000,
    enableNotifications: true,
    maxNotifications: 100,
    metadata: {
      totalOrders: 0,
      totalRevenue: 0,
      lastOrderDate: '',
      systemUptime: new Date().toISOString(),
    }
  },
  syncStatus: {
    lastSync: new Date().toISOString(),
    isOnline: true,
    pendingChanges: 0,
  }
};

function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false };
    case 'ADD_NOVEL':
      return {
        ...state,
        novels: [...state.novels, action.payload],
        syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
      };
    case 'UPDATE_NOVEL':
      return {
        ...state,
        novels: state.novels.map(novel => 
          novel.id === action.payload.id ? action.payload : novel
        ),
        syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
      };
    case 'DELETE_NOVEL':
      return {
        ...state,
        novels: state.novels.filter(novel => novel.id !== action.payload),
        syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
      };
    case 'ADD_DELIVERY_ZONE':
      return {
        ...state,
        deliveryZones: [...state.deliveryZones, action.payload],
        syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
      };
    case 'UPDATE_DELIVERY_ZONE':
      return {
        ...state,
        deliveryZones: state.deliveryZones.map(zone => 
          zone.id === action.payload.id ? action.payload : zone
        ),
        syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
      };
    case 'DELETE_DELIVERY_ZONE':
      return {
        ...state,
        deliveryZones: state.deliveryZones.filter(zone => zone.id !== action.payload),
        syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
      };
    case 'UPDATE_PRICES':
      return {
        ...state,
        prices: action.payload,
        syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
      };
    case 'ADD_NOTIFICATION':
      const newNotifications = [action.payload, ...state.notifications];
      return {
        ...state,
        notifications: newNotifications.slice(0, state.systemConfig.maxNotifications)
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload 
            ? { ...notification, read: true }
            : notification
        )
      };
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: []
      };
    case 'UPDATE_SYSTEM_CONFIG':
      return {
        ...state,
        systemConfig: { ...state.systemConfig, ...action.payload }
      };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    case 'UPDATE_SYNC_STATUS':
      return {
        ...state,
        syncStatus: { ...state.syncStatus, ...action.payload }
      };
    default:
      return state;
  }
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Países disponibles con Cuba incluido
  const availableCountries = [
    'Cuba',
    'Turquía',
    'México',
    'Brasil',
    'Colombia',
    'Argentina',
    'España',
    'Estados Unidos',
    'Corea del Sur',
    'India',
    'Reino Unido',
    'Francia',
    'Italia',
    'Alemania',
    'Japón',
    'China',
    'Rusia'
  ];

  // Load state from localStorage on mount
  useEffect(() => {
    const loadState = () => {
      try {
        const savedState = localStorage.getItem('admin_system_state');
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          dispatch({ type: 'LOAD_STATE', payload: parsedState });
        }
      } catch (error) {
        console.error('Error loading admin state:', error);
      }
    };

    loadState();
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('admin_system_state', JSON.stringify(state));
      
      // Also save to system_config for compatibility
      const systemConfig = {
        version: state.systemConfig.version,
        lastExport: new Date().toISOString(),
        prices: state.prices,
        deliveryZones: state.deliveryZones,
        novels: state.novels,
        settings: state.systemConfig,
        notifications: state.notifications,
        syncStatus: state.syncStatus
      };
      localStorage.setItem('system_config', JSON.stringify(systemConfig));

      // Emit events for real-time synchronization
      const event = new CustomEvent('admin_state_change', {
        detail: { 
          state: state,
          timestamp: new Date().toISOString()
        }
      });
      window.dispatchEvent(event);

    } catch (error) {
      console.error('Error saving admin state:', error);
    }
  }, [state]);

  // Real-time sync with other components
  useEffect(() => {
    const syncInterval = setInterval(() => {
      if (state.syncStatus.pendingChanges > 0) {
        dispatch({ 
          type: 'UPDATE_SYNC_STATUS', 
          payload: { 
            lastSync: new Date().toISOString(),
            pendingChanges: 0
          }
        });
      }
    }, 5000); // Sync every 5 seconds

    return () => clearInterval(syncInterval);
  }, [state.syncStatus.pendingChanges]);

  const login = (username: string, password: string): boolean => {
    const validUsername = btoa('admin');
    const validPassword = btoa('admin123');

    if (btoa(username) === validUsername && btoa(password) === validPassword) {
      dispatch({ type: 'LOGIN' });
      addNotification('Sesión iniciada correctamente', 'success');
      return true;
    }
    return false;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    addNotification('Sesión cerrada', 'info');
  };

  const addNovel = (novelData: Omit<Novel, 'id' | 'createdAt' | 'updatedAt'>) => {
    const novel: Novel = {
      ...novelData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_NOVEL', payload: novel });
    addNotification(`Novela "${novel.titulo}" agregada correctamente`, 'success');
    
    // Emit specific event for novel addition
    const event = new CustomEvent('admin_state_change', {
      detail: { 
        type: 'novel_add',
        data: novel,
        timestamp: new Date().toISOString()
      }
    });
    window.dispatchEvent(event);
  };

  const updateNovel = (novel: Novel) => {
    const updatedNovel = {
      ...novel,
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'UPDATE_NOVEL', payload: updatedNovel });
    addNotification(`Novela "${novel.titulo}" actualizada correctamente`, 'success');
    
    // Emit specific event for novel update
    const event = new CustomEvent('admin_state_change', {
      detail: { 
        type: 'novel_update',
        data: updatedNovel,
        timestamp: new Date().toISOString()
      }
    });
    window.dispatchEvent(event);
  };

  const deleteNovel = (id: number) => {
    const novel = state.novels.find(n => n.id === id);
    dispatch({ type: 'DELETE_NOVEL', payload: id });
    if (novel) {
      addNotification(`Novela "${novel.titulo}" eliminada`, 'info');
    }
    
    // Emit specific event for novel deletion
    const event = new CustomEvent('admin_state_change', {
      detail: { 
        type: 'novel_delete',
        data: { id },
        timestamp: new Date().toISOString()
      }
    });
    window.dispatchEvent(event);
  };

  const addDeliveryZone = (zoneData: Omit<DeliveryZone, 'id' | 'createdAt' | 'updatedAt'>) => {
    const zone: DeliveryZone = {
      ...zoneData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_DELIVERY_ZONE', payload: zone });
    addNotification(`Zona de entrega "${zone.name}" agregada`, 'success');
    
    // Emit specific event for delivery zone addition
    const event = new CustomEvent('admin_state_change', {
      detail: { 
        type: 'delivery_zone_add',
        data: zone,
        timestamp: new Date().toISOString()
      }
    });
    window.dispatchEvent(event);
  };

  const updateDeliveryZone = (zone: DeliveryZone) => {
    const updatedZone = {
      ...zone,
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'UPDATE_DELIVERY_ZONE', payload: updatedZone });
    addNotification(`Zona de entrega "${zone.name}" actualizada`, 'success');
    
    // Emit specific event for delivery zone update
    const event = new CustomEvent('admin_state_change', {
      detail: { 
        type: 'delivery_zone_update',
        data: updatedZone,
        timestamp: new Date().toISOString()
      }
    });
    window.dispatchEvent(event);
  };

  const deleteDeliveryZone = (id: number) => {
    const zone = state.deliveryZones.find(z => z.id === id);
    dispatch({ type: 'DELETE_DELIVERY_ZONE', payload: id });
    if (zone) {
      addNotification(`Zona de entrega "${zone.name}" eliminada`, 'info');
    }
    
    // Emit specific event for delivery zone deletion
    const event = new CustomEvent('admin_state_change', {
      detail: { 
        type: 'delivery_zone_delete',
        data: { id },
        timestamp: new Date().toISOString()
      }
    });
    window.dispatchEvent(event);
  };

  const updatePrices = (prices: Prices) => {
    dispatch({ type: 'UPDATE_PRICES', payload: prices });
    addNotification('Precios actualizados correctamente', 'success');
    
    // Emit specific event for price update
    const event = new CustomEvent('admin_state_change', {
      detail: { 
        type: 'prices',
        data: prices,
        timestamp: new Date().toISOString()
      }
    });
    window.dispatchEvent(event);
  };

  const addNotification = (message: string, type: Notification['type']) => {
    if (!state.systemConfig.enableNotifications) return;
    
    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message,
      type,
      timestamp: new Date(),
      read: false,
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const markNotificationRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  const clearNotifications = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  };

  const updateSystemConfig = (config: Partial<SystemConfig>) => {
    dispatch({ type: 'UPDATE_SYSTEM_CONFIG', payload: config });
    addNotification('Configuración del sistema actualizada', 'success');
  };

  const exportSystemConfig = (): string => {
    const exportData = {
      version: state.systemConfig.version,
      exportDate: new Date().toISOString(),
      prices: state.prices,
      deliveryZones: state.deliveryZones,
      novels: state.novels,
      systemConfig: state.systemConfig,
      notifications: state.notifications,
      syncStatus: state.syncStatus
    };
    return JSON.stringify(exportData, null, 2);
  };

  const importSystemConfig = (configJson: string): boolean => {
    try {
      const config = JSON.parse(configJson);
      
      // Validate config structure
      if (!config.prices || !config.deliveryZones || !config.novels) {
        throw new Error('Configuración inválida');
      }
      
      dispatch({ 
        type: 'LOAD_STATE', 
        payload: {
          prices: config.prices,
          deliveryZones: config.deliveryZones,
          novels: config.novels,
          systemConfig: config.systemConfig || state.systemConfig,
          notifications: config.notifications || [],
          syncStatus: config.syncStatus || state.syncStatus
        }
      });
      
      addNotification('Configuración importada correctamente', 'success');
      
      // Emit full sync event
      const event = new CustomEvent('admin_full_sync', {
        detail: { 
          config: config,
          timestamp: new Date().toISOString()
        }
      });
      window.dispatchEvent(event);
      
      return true;
    } catch (error) {
      addNotification('Error al importar configuración', 'error');
      return false;
    }
  };

  const getAvailableCountries = (): string[] => {
    return availableCountries;
  };

  return (
    <AdminContext.Provider value={{
      state,
      login,
      logout,
      addNovel,
      updateNovel,
      deleteNovel,
      addDeliveryZone,
      updateDeliveryZone,
      deleteDeliveryZone,
      updatePrices,
      addNotification,
      markNotificationRead,
      clearNotifications,
      updateSystemConfig,
      exportSystemConfig,
      importSystemConfig,
      getAvailableCountries
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

export { AdminContext };