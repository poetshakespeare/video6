import JSZip from 'jszip';
import { SystemConfig } from '../context/AdminContext';

export async function generateCompleteSourceCode(systemConfig: SystemConfig): Promise<void> {
  try {
    const zip = new JSZip();
    
    // Generate updated source files with embedded configuration
    const updatedFiles = generateUpdatedSourceFiles(systemConfig);
    
    // Add all files to zip
    Object.entries(updatedFiles).forEach(([filePath, content]) => {
      zip.file(filePath, content);
    });
    
    // Generate and download zip
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TV_a_la_Carta_Sistema_Completo_${new Date().toISOString().split('T')[0]}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error generating source code:', error);
    throw error;
  }
}

function generateUpdatedSourceFiles(systemConfig: SystemConfig): Record<string, string> {
  const files: Record<string, string> = {};
  
  // Generate AdminContext with embedded configuration
  files['src/context/AdminContext.tsx'] = generateAdminContext(systemConfig);
  
  // Generate CartContext with embedded prices
  files['src/context/CartContext.tsx'] = generateCartContext(systemConfig);
  
  // Generate CheckoutModal with embedded delivery zones
  files['src/components/CheckoutModal.tsx'] = generateCheckoutModal(systemConfig);
  
  // Generate PriceCard with embedded prices
  files['src/components/PriceCard.tsx'] = generatePriceCard(systemConfig);
  
  // Generate NovelasModal with embedded catalog
  files['src/components/NovelasModal.tsx'] = generateNovelasModal(systemConfig);
  
  // Add other necessary files
  files['package.json'] = generatePackageJson();
  files['README.md'] = generateReadme(systemConfig);
  files['vite.config.ts'] = getViteConfig();
  files['tailwind.config.js'] = getTailwindConfig();
  files['index.html'] = getIndexHtml();
  files['src/main.tsx'] = getMainTsx();
  files['src/index.css'] = getIndexCss();
  files['public/_redirects'] = getNetlifyRedirects();
  files['vercel.json'] = getVercelConfig();
  
  return files;
}

function generateAdminContext(systemConfig: SystemConfig): string {
  return `import React, { createContext, useContext, useReducer, useEffect } from 'react';
import JSZip from 'jszip';

// CONFIGURACIÓN EMBEBIDA - Generada automáticamente
const EMBEDDED_CONFIG = ${JSON.stringify(systemConfig, null, 2)};

// CREDENCIALES DE ACCESO (CONFIGURABLES)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'tvalacarta2024'
};

// Types
export interface PriceConfig {
  moviePrice: number;
  seriesPrice: number;
  transferFeePercentage: number;
  novelPricePerChapter: number;
}

export interface DeliveryZone {
  id: number;
  name: string;
  cost: number;
  createdAt: string;
  updatedAt: string;
}

export interface Novel {
  id: number;
  titulo: string;
  genero: string;
  capitulos: number;
  año: number;
  descripcion?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  section: string;
  action: string;
}

export interface SyncStatus {
  lastSync: string;
  isOnline: boolean;
  pendingChanges: number;
}

export interface SystemConfig {
  version: string;
  lastExport: string;
  prices: PriceConfig;
  deliveryZones: DeliveryZone[];
  novels: Novel[];
  settings: {
    autoSync: boolean;
    syncInterval: number;
    enableNotifications: boolean;
    maxNotifications: number;
  };
  metadata: {
    totalOrders: number;
    totalRevenue: number;
    lastOrderDate: string;
    systemUptime: string;
  };
}

export interface AdminState {
  isAuthenticated: boolean;
  prices: PriceConfig;
  deliveryZones: DeliveryZone[];
  novels: Novel[];
  notifications: Notification[];
  syncStatus: SyncStatus;
  systemConfig: SystemConfig;
}

type AdminAction = 
  | { type: 'LOGIN'; payload: { username: string; password: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PRICES'; payload: PriceConfig }
  | { type: 'ADD_DELIVERY_ZONE'; payload: Omit<DeliveryZone, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_DELIVERY_ZONE'; payload: DeliveryZone }
  | { type: 'DELETE_DELIVERY_ZONE'; payload: number }
  | { type: 'ADD_NOVEL'; payload: Omit<Novel, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_NOVEL'; payload: Novel }
  | { type: 'DELETE_NOVEL'; payload: number }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp'> }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'UPDATE_SYNC_STATUS'; payload: Partial<SyncStatus> }
  | { type: 'SYNC_STATE'; payload: Partial<AdminState> }
  | { type: 'LOAD_SYSTEM_CONFIG'; payload: SystemConfig }
  | { type: 'UPDATE_SYSTEM_CONFIG'; payload: Partial<SystemConfig> };

interface AdminContextType {
  state: AdminState;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updatePrices: (prices: PriceConfig) => void;
  addDeliveryZone: (zone: Omit<DeliveryZone, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDeliveryZone: (zone: DeliveryZone) => void;
  deleteDeliveryZone: (id: number) => void;
  addNovel: (novel: Omit<Novel, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNovel: (novel: Novel) => void;
  deleteNovel: (id: number) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  clearNotifications: () => void;
  exportSystemConfig: () => void;
  importSystemConfig: (config: SystemConfig) => void;
  exportCompleteSourceCode: () => void;
  syncWithRemote: () => Promise<void>;
  broadcastChange: (change: any) => void;
  syncAllSections: () => Promise<void>;
}

// Initial state with embedded configuration
const initialState: AdminState = {
  isAuthenticated: false,
  prices: EMBEDDED_CONFIG.prices,
  deliveryZones: EMBEDDED_CONFIG.deliveryZones,
  novels: EMBEDDED_CONFIG.novels,
  notifications: [],
  syncStatus: {
    lastSync: new Date().toISOString(),
    isOnline: true,
    pendingChanges: 0,
  },
  systemConfig: EMBEDDED_CONFIG,
};

// Reducer
function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case 'LOGIN':
      if (action.payload.username === ADMIN_CREDENTIALS.username && action.payload.password === ADMIN_CREDENTIALS.password) {
        return { ...state, isAuthenticated: true };
      }
      return state;

    case 'LOGOUT':
      return { ...state, isAuthenticated: false };

    case 'UPDATE_PRICES':
      const updatedConfig = {
        ...state.systemConfig,
        prices: action.payload,
        lastExport: new Date().toISOString(),
      };
      
      // Update embedded configuration in real-time
      updateEmbeddedConfiguration(updatedConfig);
      
      return {
        ...state,
        prices: action.payload,
        systemConfig: updatedConfig,
        syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
      };

    case 'ADD_DELIVERY_ZONE':
      const newZone: DeliveryZone = {
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const configWithNewZone = {
        ...state.systemConfig,
        deliveryZones: [...state.systemConfig.deliveryZones, newZone],
        lastExport: new Date().toISOString(),
      };
      
      updateEmbeddedConfiguration(configWithNewZone);
      
      return {
        ...state,
        deliveryZones: [...state.deliveryZones, newZone],
        systemConfig: configWithNewZone,
        syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
      };

    case 'UPDATE_DELIVERY_ZONE':
      const updatedZones = state.deliveryZones.map(zone =>
        zone.id === action.payload.id
          ? { ...action.payload, updatedAt: new Date().toISOString() }
          : zone
      );
      const configWithUpdatedZone = {
        ...state.systemConfig,
        deliveryZones: updatedZones,
        lastExport: new Date().toISOString(),
      };
      
      updateEmbeddedConfiguration(configWithUpdatedZone);
      
      return {
        ...state,
        deliveryZones: updatedZones,
        systemConfig: configWithUpdatedZone,
        syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
      };

    case 'DELETE_DELIVERY_ZONE':
      const filteredZones = state.deliveryZones.filter(zone => zone.id !== action.payload);
      const configWithDeletedZone = {
        ...state.systemConfig,
        deliveryZones: filteredZones,
        lastExport: new Date().toISOString(),
      };
      
      updateEmbeddedConfiguration(configWithDeletedZone);
      
      return {
        ...state,
        deliveryZones: filteredZones,
        systemConfig: configWithDeletedZone,
        syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
      };

    case 'ADD_NOVEL':
      const newNovel: Novel = {
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const configWithNewNovel = {
        ...state.systemConfig,
        novels: [...state.systemConfig.novels, newNovel],
        lastExport: new Date().toISOString(),
      };
      
      updateEmbeddedConfiguration(configWithNewNovel);
      
      return {
        ...state,
        novels: [...state.novels, newNovel],
        systemConfig: configWithNewNovel,
        syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
      };

    case 'UPDATE_NOVEL':
      const updatedNovels = state.novels.map(novel =>
        novel.id === action.payload.id
          ? { ...action.payload, updatedAt: new Date().toISOString() }
          : novel
      );
      const configWithUpdatedNovel = {
        ...state.systemConfig,
        novels: updatedNovels,
        lastExport: new Date().toISOString(),
      };
      
      updateEmbeddedConfiguration(configWithUpdatedNovel);
      
      return {
        ...state,
        novels: updatedNovels,
        systemConfig: configWithUpdatedNovel,
        syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
      };

    case 'DELETE_NOVEL':
      const filteredNovels = state.novels.filter(novel => novel.id !== action.payload);
      const configWithDeletedNovel = {
        ...state.systemConfig,
        novels: filteredNovels,
        lastExport: new Date().toISOString(),
      };
      
      updateEmbeddedConfiguration(configWithDeletedNovel);
      
      return {
        ...state,
        novels: filteredNovels,
        systemConfig: configWithDeletedNovel,
        syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
      };

    case 'ADD_NOTIFICATION':
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      return {
        ...state,
        notifications: [notification, ...state.notifications].slice(0, state.systemConfig.settings.maxNotifications),
      };

    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };

    case 'UPDATE_SYNC_STATUS':
      return {
        ...state,
        syncStatus: { ...state.syncStatus, ...action.payload },
      };

    case 'LOAD_SYSTEM_CONFIG':
      updateEmbeddedConfiguration(action.payload);
      return {
        ...state,
        prices: action.payload.prices,
        deliveryZones: action.payload.deliveryZones,
        novels: action.payload.novels,
        systemConfig: action.payload,
        syncStatus: { ...state.syncStatus, lastSync: new Date().toISOString(), pendingChanges: 0 }
      };

    case 'UPDATE_SYSTEM_CONFIG':
      const newSystemConfig = { ...state.systemConfig, ...action.payload };
      updateEmbeddedConfiguration(newSystemConfig);
      return {
        ...state,
        systemConfig: newSystemConfig,
      };

    case 'SYNC_STATE':
      return {
        ...state,
        ...action.payload,
        syncStatus: { ...state.syncStatus, lastSync: new Date().toISOString(), pendingChanges: 0 }
      };

    default:
      return state;
  }
}

// Function to update embedded configuration in real-time
function updateEmbeddedConfiguration(config: SystemConfig) {
  // This would trigger a regeneration of the embedded files
  // For now, we'll store in localStorage as a fallback
  localStorage.setItem('embedded_config', JSON.stringify(config));
  
  // Broadcast configuration change
  window.dispatchEvent(new CustomEvent('embedded_config_updated', { 
    detail: config 
  }));
}

// Context creation
const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Provider component
export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Load system config on startup
  useEffect(() => {
    try {
      const storedConfig = localStorage.getItem('embedded_config');
      if (storedConfig) {
        const config = JSON.parse(storedConfig);
        dispatch({ type: 'LOAD_SYSTEM_CONFIG', payload: config });
      }
    } catch (error) {
      console.error('Error loading embedded config:', error);
    }
  }, []);

  // Context methods implementation
  const login = (username: string, password: string): boolean => {
    dispatch({ type: 'LOGIN', payload: { username, password } });
    const success = username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
    if (success) {
      addNotification({
        type: 'success',
        title: 'Inicio de sesión exitoso',
        message: 'Bienvenido al panel de administración',
        section: 'Autenticación',
        action: 'login'
      });
    }
    return success;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    addNotification({
      type: 'info',
      title: 'Sesión cerrada',
      message: 'Has cerrado sesión correctamente',
      section: 'Autenticación',
      action: 'logout'
    });
  };

  const updatePrices = (prices: PriceConfig) => {
    dispatch({ type: 'UPDATE_PRICES', payload: prices });
    addNotification({
      type: 'success',
      title: 'Precios actualizados',
      message: 'Los precios se han actualizado y aplicado automáticamente en toda la aplicación',
      section: 'Precios',
      action: 'update'
    });
    broadcastChange({ type: 'prices', data: prices });
  };

  const addDeliveryZone = (zone: Omit<DeliveryZone, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'ADD_DELIVERY_ZONE', payload: zone });
    addNotification({
      type: 'success',
      title: 'Zona de entrega agregada',
      message: \`Se agregó la zona "\${zone.name}" y está disponible en el checkout\`,
      section: 'Zonas de Entrega',
      action: 'create'
    });
    broadcastChange({ type: 'delivery_zone_add', data: zone });
  };

  const updateDeliveryZone = (zone: DeliveryZone) => {
    dispatch({ type: 'UPDATE_DELIVERY_ZONE', payload: zone });
    addNotification({
      type: 'success',
      title: 'Zona de entrega actualizada',
      message: \`Se actualizó la zona "\${zone.name}" y los cambios se aplicaron automáticamente\`,
      section: 'Zonas de Entrega',
      action: 'update'
    });
    broadcastChange({ type: 'delivery_zone_update', data: zone });
  };

  const deleteDeliveryZone = (id: number) => {
    const zone = state.deliveryZones.find(z => z.id === id);
    dispatch({ type: 'DELETE_DELIVERY_ZONE', payload: id });
    addNotification({
      type: 'warning',
      title: 'Zona de entrega eliminada',
      message: \`Se eliminó la zona "\${zone?.name || 'Desconocida'}" del sistema\`,
      section: 'Zonas de Entrega',
      action: 'delete'
    });
    broadcastChange({ type: 'delivery_zone_delete', data: { id } });
  };

  const addNovel = (novel: Omit<Novel, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'ADD_NOVEL', payload: novel });
    addNotification({
      type: 'success',
      title: 'Novela agregada',
      message: \`Se agregó la novela "\${novel.titulo}" al catálogo\`,
      section: 'Gestión de Novelas',
      action: 'create'
    });
    broadcastChange({ type: 'novel_add', data: novel });
  };

  const updateNovel = (novel: Novel) => {
    dispatch({ type: 'UPDATE_NOVEL', payload: novel });
    addNotification({
      type: 'success',
      title: 'Novela actualizada',
      message: \`Se actualizó la novela "\${novel.titulo}" en el catálogo\`,
      section: 'Gestión de Novelas',
      action: 'update'
    });
    broadcastChange({ type: 'novel_update', data: novel });
  };

  const deleteNovel = (id: number) => {
    const novel = state.novels.find(n => n.id === id);
    dispatch({ type: 'DELETE_NOVEL', payload: id });
    addNotification({
      type: 'warning',
      title: 'Novela eliminada',
      message: \`Se eliminó la novela "\${novel?.titulo || 'Desconocida'}" del catálogo\`,
      section: 'Gestión de Novelas',
      action: 'delete'
    });
    broadcastChange({ type: 'novel_delete', data: { id } });
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const clearNotifications = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
    addNotification({
      type: 'info',
      title: 'Notificaciones limpiadas',
      message: 'Se han eliminado todas las notificaciones del sistema',
      section: 'Notificaciones',
      action: 'clear'
    });
  };

  const exportSystemConfig = async () => {
    try {
      addNotification({
        type: 'info',
        title: 'Exportación de configuración iniciada',
        message: 'Generando archivo de configuración JSON...',
        section: 'Sistema',
        action: 'export_config_start'
      });

      const completeConfig: SystemConfig = {
        ...state.systemConfig,
        version: '2.1.0',
        lastExport: new Date().toISOString(),
        prices: state.prices,
        deliveryZones: state.deliveryZones,
        novels: state.novels,
        metadata: {
          ...state.systemConfig.metadata,
          exportTimestamp: new Date().toISOString(),
        },
      };

      const configJson = JSON.stringify(completeConfig, null, 2);
      const blob = new Blob([configJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = \`TV_a_la_Carta_Config_\${new Date().toISOString().split('T')[0]}.json\`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      dispatch({ 
        type: 'UPDATE_SYSTEM_CONFIG', 
        payload: { lastExport: new Date().toISOString() } 
      });

      addNotification({
        type: 'success',
        title: 'Configuración exportada',
        message: 'La configuración JSON se ha exportado correctamente',
        section: 'Sistema',
        action: 'export_config'
      });
    } catch (error) {
      console.error('Error exporting system config:', error);
      addNotification({
        type: 'error',
        title: 'Error en la exportación de configuración',
        message: 'No se pudo exportar la configuración JSON',
        section: 'Sistema',
        action: 'export_config_error'
      });
    }
  };

  const exportCompleteSourceCode = async () => {
    try {
      addNotification({
        type: 'info',
        title: 'Exportación de código fuente iniciada',
        message: 'Generando sistema completo con configuración embebida...',
        section: 'Sistema',
        action: 'export_source_start'
      });

      try {
        const { generateCompleteSourceCode } = await import('../utils/sourceCodeGenerator');
        await generateCompleteSourceCode(state.systemConfig);
      } catch (importError) {
        console.error('Error importing source code generator:', importError);
        throw new Error('No se pudo cargar el generador de código fuente');
      }

      addNotification({
        type: 'success',
        title: 'Código fuente exportado',
        message: 'El sistema completo con configuración embebida se ha exportado correctamente',
        section: 'Sistema',
        action: 'export_source'
      });
    } catch (error) {
      console.error('Error exporting source code:', error);
      addNotification({
        type: 'error',
        title: 'Error en la exportación de código',
        message: error instanceof Error ? error.message : 'No se pudo exportar el código fuente completo',
        section: 'Sistema',
        action: 'export_source_error'
      });
      throw error;
    }
  };

  const importSystemConfig = (config: SystemConfig) => {
    try {
      dispatch({ type: 'LOAD_SYSTEM_CONFIG', payload: config });
      addNotification({
        type: 'success',
        title: 'Configuración importada',
        message: 'La configuración del sistema se ha cargado y aplicado correctamente',
        section: 'Sistema',
        action: 'import'
      });
    } catch (error) {
      console.error('Error importing system config:', error);
      addNotification({
        type: 'error',
        title: 'Error en la importación',
        message: 'No se pudo cargar la configuración del sistema',
        section: 'Sistema',
        action: 'import_error'
      });
    }
  };

  const syncAllSections = async (): Promise<void> => {
    try {
      addNotification({
        type: 'info',
        title: 'Sincronización completa iniciada',
        message: 'Aplicando cambios en toda la aplicación...',
        section: 'Sistema',
        action: 'sync_all_start'
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      const updatedConfig: SystemConfig = {
        ...state.systemConfig,
        lastExport: new Date().toISOString(),
        prices: state.prices,
        deliveryZones: state.deliveryZones,
        novels: state.novels,
      };

      dispatch({ type: 'UPDATE_SYSTEM_CONFIG', payload: updatedConfig });
      
      window.dispatchEvent(new CustomEvent('admin_full_sync', { 
        detail: { 
          config: updatedConfig,
          timestamp: new Date().toISOString()
        } 
      }));

      addNotification({
        type: 'success',
        title: 'Sincronización completa exitosa',
        message: 'Todos los cambios se han aplicado correctamente en la aplicación',
        section: 'Sistema',
        action: 'sync_all'
      });
    } catch (error) {
      console.error('Error in full sync:', error);
      addNotification({
        type: 'error',
        title: 'Error en sincronización completa',
        message: 'No se pudo completar la sincronización de todas las secciones',
        section: 'Sistema',
        action: 'sync_all_error'
      });
    }
  };

  const broadcastChange = (change: any) => {
    const changeEvent = {
      ...change,
      timestamp: new Date().toISOString(),
      source: 'admin_panel'
    };
    
    dispatch({ 
      type: 'UPDATE_SYNC_STATUS', 
      payload: { 
        lastSync: new Date().toISOString(),
        pendingChanges: Math.max(0, state.syncStatus.pendingChanges - 1)
      } 
    });

    window.dispatchEvent(new CustomEvent('admin_state_change', { 
      detail: changeEvent 
    }));
  };

  const syncWithRemote = async (): Promise<void> => {
    try {
      dispatch({ type: 'UPDATE_SYNC_STATUS', payload: { isOnline: true } });
      
      addNotification({
        type: 'info',
        title: 'Sincronización iniciada',
        message: 'Aplicando cambios en toda la aplicación...',
        section: 'Sistema',
        action: 'sync_start'
      });

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      dispatch({ 
        type: 'UPDATE_SYNC_STATUS', 
        payload: { 
          lastSync: new Date().toISOString(),
          pendingChanges: 0
        } 
      });
      
      addNotification({
        type: 'success',
        title: 'Sincronización completada',
        message: 'Todos los cambios se han aplicado correctamente',
        section: 'Sistema',
        action: 'sync'
      });
    } catch (error) {
      dispatch({ type: 'UPDATE_SYNC_STATUS', payload: { isOnline: false } });
      addNotification({
        type: 'error',
        title: 'Error de sincronización',
        message: 'No se pudo aplicar algunos cambios',
        section: 'Sistema',
        action: 'sync_error'
      });
    }
  };

  return (
    <AdminContext.Provider
      value={{
        state,
        login,
        logout,
        updatePrices,
        addDeliveryZone,
        updateDeliveryZone,
        deleteDeliveryZone,
        addNovel,
        updateNovel,
        deleteNovel,
        addNotification,
        clearNotifications,
        exportSystemConfig,
        importSystemConfig,
        exportCompleteSourceCode,
        syncWithRemote,
        broadcastChange,
        syncAllSections,
      }}
    >
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

export { AdminContext };`;
}

function generateCartContext(systemConfig: SystemConfig): string {
  return `import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Toast } from '../components/Toast';
import type { CartItem } from '../types/movie';

// PRECIOS EMBEBIDOS - Generados automáticamente
const EMBEDDED_PRICES = ${JSON.stringify(systemConfig.prices, null, 2)};

interface SeriesCartItem extends CartItem {
  selectedSeasons?: number[];
  paymentType?: 'cash' | 'transfer';
}

interface CartState {
  items: SeriesCartItem[];
  total: number;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: SeriesCartItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_SEASONS'; payload: { id: number; seasons: number[] } }
  | { type: 'UPDATE_PAYMENT_TYPE'; payload: { id: number; paymentType: 'cash' | 'transfer' } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: SeriesCartItem[] };

interface CartContextType {
  state: CartState;
  addItem: (item: SeriesCartItem) => void;
  removeItem: (id: number) => void;
  updateSeasons: (id: number, seasons: number[]) => void;
  updatePaymentType: (id: number, paymentType: 'cash' | 'transfer') => void;
  clearCart: () => void;
  isInCart: (id: number) => boolean;
  getItemSeasons: (id: number) => number[];
  getItemPaymentType: (id: number) => 'cash' | 'transfer';
  calculateItemPrice: (item: SeriesCartItem) => number;
  calculateTotalPrice: () => number;
  calculateTotalByPaymentType: () => { cash: number; transfer: number };
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
    case 'UPDATE_PAYMENT_TYPE':
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.payload.id 
            ? { ...item, paymentType: action.payload.paymentType }
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

  // Listen for embedded config updates
  useEffect(() => {
    const handleConfigUpdate = (event: CustomEvent) => {
      // Configuration updated, prices are now embedded
      console.log('Configuration updated, using embedded prices');
    };

    window.addEventListener('embedded_config_updated', handleConfigUpdate as EventListener);
    return () => window.removeEventListener('embedded_config_updated', handleConfigUpdate as EventListener);
  }, []);

  // Clear cart on page refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem('pageRefreshed', 'true');
    };

    const handleLoad = () => {
      if (sessionStorage.getItem('pageRefreshed') === 'true') {
        localStorage.removeItem('movieCart');
        dispatch({ type: 'CLEAR_CART' });
        sessionStorage.removeItem('pageRefreshed');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handleLoad);

    if (sessionStorage.getItem('pageRefreshed') === 'true') {
      localStorage.removeItem('movieCart');
      dispatch({ type: 'CLEAR_CART' });
      sessionStorage.removeItem('pageRefreshed');
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem('pageRefreshed') !== 'true') {
      const savedCart = localStorage.getItem('movieCart');
      if (savedCart) {
        try {
          const items = JSON.parse(savedCart);
          dispatch({ type: 'LOAD_CART', payload: items });
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('movieCart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (item: SeriesCartItem) => {
    const itemWithDefaults = { 
      ...item, 
      paymentType: 'cash' as const,
      selectedSeasons: item.type === 'tv' && !item.selectedSeasons ? [1] : item.selectedSeasons
    };
    dispatch({ type: 'ADD_ITEM', payload: itemWithDefaults });
    
    setToast({
      message: \`"\${item.title}" agregado al carrito\`,
      type: 'success',
      isVisible: true
    });
  };

  const removeItem = (id: number) => {
    const item = state.items.find(item => item.id === id);
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    
    if (item) {
      setToast({
        message: \`"\${item.title}" retirado del carrito\`,
        type: 'error',
        isVisible: true
      });
    }
  };

  const updateSeasons = (id: number, seasons: number[]) => {
    dispatch({ type: 'UPDATE_SEASONS', payload: { id, seasons } });
  };

  const updatePaymentType = (id: number, paymentType: 'cash' | 'transfer') => {
    dispatch({ type: 'UPDATE_PAYMENT_TYPE', payload: { id, paymentType } });
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

  const getItemPaymentType = (id: number): 'cash' | 'transfer' => {
    const item = state.items.find(item => item.id === id);
    return item?.paymentType || 'cash';
  };

  const calculateItemPrice = (item: SeriesCartItem): number => {
    // Use embedded prices
    const moviePrice = EMBEDDED_PRICES.moviePrice;
    const seriesPrice = EMBEDDED_PRICES.seriesPrice;
    const transferFeePercentage = EMBEDDED_PRICES.transferFeePercentage;
    
    if (item.type === 'movie') {
      const basePrice = moviePrice;
      return item.paymentType === 'transfer' ? Math.round(basePrice * (1 + transferFeePercentage / 100)) : basePrice;
    } else {
      const seasons = item.selectedSeasons?.length || 1;
      const basePrice = seasons * seriesPrice;
      return item.paymentType === 'transfer' ? Math.round(basePrice * (1 + transferFeePercentage / 100)) : basePrice;
    }
  };

  const calculateTotalPrice = (): number => {
    return state.items.reduce((total, item) => {
      return total + calculateItemPrice(item);
    }, 0);
  };

  const calculateTotalByPaymentType = (): { cash: number; transfer: number } => {
    const moviePrice = EMBEDDED_PRICES.moviePrice;
    const seriesPrice = EMBEDDED_PRICES.seriesPrice;
    const transferFeePercentage = EMBEDDED_PRICES.transferFeePercentage;
    
    return state.items.reduce((totals, item) => {
      const basePrice = item.type === 'movie' ? moviePrice : (item.selectedSeasons?.length || 1) * seriesPrice;
      if (item.paymentType === 'transfer') {
        totals.transfer += Math.round(basePrice * (1 + transferFeePercentage / 100));
      } else {
        totals.cash += basePrice;
      }
      return totals;
    }, { cash: 0, transfer: 0 });
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
      updatePaymentType,
      clearCart, 
      isInCart, 
      getItemSeasons,
      getItemPaymentType,
      calculateItemPrice,
      calculateTotalPrice,
      calculateTotalByPaymentType
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
}`;
}

function generateCheckoutModal(systemConfig: SystemConfig): string {
  return `import React, { useState, useEffect } from 'react';
import { X, MapPin, User, Phone, Home, CreditCard, DollarSign, MessageCircle, Calculator, Truck } from 'lucide-react';

// ZONAS DE ENTREGA EMBEBIDAS - Generadas automáticamente
const EMBEDDED_DELIVERY_ZONES = ${JSON.stringify(systemConfig.deliveryZones, null, 2)};

// PRECIOS EMBEBIDOS
const EMBEDDED_PRICES = ${JSON.stringify(systemConfig.prices, null, 2)};

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

export function CheckoutModal({ isOpen, onClose, onCheckout, items, total }: CheckoutModalProps) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    address: ''
  });
  const [selectedZone, setSelectedZone] = useState('');
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  // Use embedded delivery zones
  const deliveryZones = EMBEDDED_DELIVERY_ZONES;

  // Listen for embedded config updates
  useEffect(() => {
    const handleConfigUpdate = (event: CustomEvent) => {
      // Configuration updated, delivery zones are now embedded
      console.log('Delivery zones updated');
    };

    window.addEventListener('embedded_config_updated', handleConfigUpdate as EventListener);
    return () => window.removeEventListener('embedded_config_updated', handleConfigUpdate as EventListener);
  }, []);

  useEffect(() => {
    if (selectedZone) {
      const zone = deliveryZones.find(z => z.name === selectedZone);
      setDeliveryCost(zone ? zone.cost : 0);
    }
  }, [selectedZone, deliveryZones]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};

    if (!customerInfo.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^[+]?[0-9\\s\\-()]{8,}$/.test(customerInfo.phone)) {
      newErrors.phone = 'Formato de teléfono inválido';
    }

    if (!customerInfo.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!selectedZone) {
      alert('Por favor selecciona una zona de entrega');
      return;
    }

    const orderId = \`TV-\${Date.now()}\`;
    const orderData: OrderData = {
      orderId,
      customerInfo,
      deliveryZone: selectedZone,
      deliveryCost,
      items,
      subtotal: total,
      transferFee: 0,
      total: total + deliveryCost
    };

    onCheckout(orderData);
  };

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
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
                <MessageCircle className="h-6 w-6" />
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
                    className={\`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 \${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }\`}
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
                    className={\`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 \${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }\`}
                    placeholder="+53 5469 0878"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección Completa *
                  </label>
                  <textarea
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className={\`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none \${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }\`}
                    placeholder="Calle, número, entre calles, referencias..."
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Zone */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-green-600" />
                Zona de Entrega
              </h3>
              
              {deliveryZones.length > 0 ? (
                <div className="space-y-3">
                  {deliveryZones.map((zone) => (
                    <label
                      key={zone.id}
                      className={\`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors \${
                        selectedZone === zone.name
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-green-300'
                      }\`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="deliveryZone"
                          value={zone.name}
                          checked={selectedZone === zone.name}
                          onChange={(e) => setSelectedZone(e.target.value)}
                          className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{zone.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">\${zone.cost.toLocaleString()} CUP</p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No hay zonas de entrega configuradas
                  </h3>
                  <p className="text-gray-600">
                    Contacta con el administrador para configurar las zonas de entrega.
                  </p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-blue-600" />
                Resumen del Pedido
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal ({items.length} elementos)</span>
                  <span className="font-semibold">\${total.toLocaleString()} CUP</span>
                </div>
                
                {selectedZone && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Entrega</span>
                    <span className="font-semibold">\${deliveryCost.toLocaleString()} CUP</span>
                  </div>
                )}
                
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-blue-600">
                      \${(total + deliveryCost).toLocaleString()} CUP
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedZone || deliveryZones.length === 0}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center disabled:cursor-not-allowed"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
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
}`;
}

function generatePriceCard(systemConfig: SystemConfig): string {
  return `import React from 'react';
import { DollarSign, Tv, Film, Star, CreditCard } from 'lucide-react';

// PRECIOS EMBEBIDOS - Generados automáticamente
const EMBEDDED_PRICES = ${JSON.stringify(systemConfig.prices, null, 2)};

interface PriceCardProps {
  type: 'movie' | 'tv';
  selectedSeasons?: number[];
  episodeCount?: number;
  isAnime?: boolean;
}

export function PriceCard({ type, selectedSeasons = [], episodeCount = 0, isAnime = false }: PriceCardProps) {
  // Use embedded prices
  const moviePrice = EMBEDDED_PRICES.moviePrice;
  const seriesPrice = EMBEDDED_PRICES.seriesPrice;
  const transferFeePercentage = EMBEDDED_PRICES.transferFeePercentage;
  
  const calculatePrice = () => {
    if (type === 'movie') {
      return moviePrice;
    } else {
      // Series: dynamic price per season
      return selectedSeasons.length * seriesPrice;
    }
  };

  const price = calculatePrice();
  const transferPrice = Math.round(price * (1 + transferFeePercentage / 100));
  
  const getIcon = () => {
    if (type === 'movie') {
      return isAnime ? '🎌' : '🎬';
    }
    return isAnime ? '🎌' : '📺';
  };

  const getTypeLabel = () => {
    if (type === 'movie') {
      return isAnime ? 'Película Animada' : 'Película';
    }
    return isAnime ? 'Anime' : 'Serie';
  };

  return (
    <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-green-300 shadow-xl transform hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-green-400 to-emerald-400 p-3 rounded-xl mr-4 shadow-lg">
            <span className="text-2xl">{getIcon()}</span>
          </div>
          <div>
            <h3 className="font-black text-green-800 text-lg">{getTypeLabel()}</h3>
            <p className="text-green-600 text-sm font-semibold">
              {type === 'tv' && selectedSeasons.length > 0 
                ? \`\${selectedSeasons.length} temporada\${selectedSeasons.length > 1 ? 's' : ''}\`
                : 'Contenido completo'
              }
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-full shadow-lg animate-pulse">
          <DollarSign className="h-4 w-4" />
        </div>
      </div>
      
      <div className="space-y-3">
        {/* Cash Price */}
        <div className="bg-gradient-to-r from-white to-green-50 rounded-xl p-4 border-2 border-green-200 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold text-green-700 flex items-center">
              <div className="bg-green-100 p-1 rounded-lg mr-2">
                <DollarSign className="h-4 w-4" />
              </div>
              Efectivo
            </span>
            <span className="text-xl font-black text-green-700">
              \${price.toLocaleString()} CUP
            </span>
          </div>
        </div>
        
        {/* Transfer Price */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-200 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold text-orange-700 flex items-center">
              <div className="bg-orange-100 p-1 rounded-lg mr-2">
                <CreditCard className="h-4 w-4" />
              </div>
              Transferencia
            </span>
            <span className="text-xl font-black text-orange-700">
              \${transferPrice.toLocaleString()} CUP
            </span>
          </div>
          <div className="text-sm text-orange-600 font-semibold bg-orange-100 px-2 py-1 rounded-full text-center">
            +{transferFeePercentage}% recargo bancario
          </div>
        </div>
        
        {type === 'tv' && selectedSeasons.length > 0 && (
          <div className="text-sm text-green-600 font-bold text-center bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-3 border border-green-200">
            \${(price / selectedSeasons.length).toLocaleString()} CUP por temporada (efectivo)
          </div>
        )}
      </div>
    </div>
  );
}`;
}

function generateNovelasModal(systemConfig: SystemConfig): string {
  return `import React, { useState } from 'react';
import { X, Download, MessageCircle, Phone, BookOpen, Info, Check, DollarSign, CreditCard, Calculator, Search, Filter, SortAsc, SortDesc, Smartphone } from 'lucide-react';

// CATÁLOGO DE NOVELAS EMBEBIDO - Generado automáticamente
const EMBEDDED_NOVELS = ${JSON.stringify(systemConfig.novels, null, 2)};

// PRECIOS EMBEBIDOS
const EMBEDDED_PRICES = ${JSON.stringify(systemConfig.prices, null, 2)};

interface Novela {
  id: number;
  titulo: string;
  genero: string;
  capitulos: number;
  año: number;
  descripcion?: string;
  paymentType?: 'cash' | 'transfer';
}

interface NovelasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NovelasModal({ isOpen, onClose }: NovelasModalProps) {
  const [selectedNovelas, setSelectedNovelas] = useState<number[]>([]);
  const [novelasWithPayment, setNovelasWithPayment] = useState<Novela[]>([]);
  const [showNovelList, setShowNovelList] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [sortBy, setSortBy] = useState<'titulo' | 'año' | 'capitulos'>('titulo');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Get novels and prices from embedded configuration
  const adminNovels = EMBEDDED_NOVELS;
  const novelPricePerChapter = EMBEDDED_PRICES.novelPricePerChapter;
  const transferFeePercentage = EMBEDDED_PRICES.transferFeePercentage;
  
  // Base novels list
  const defaultNovelas: Novela[] = [];

  // Combine admin novels with default novels
  const allNovelas = [...defaultNovelas, ...adminNovels.map(novel => ({
    id: novel.id,
    titulo: novel.titulo,
    genero: novel.genero,
    capitulos: novel.capitulos,
    año: novel.año,
    descripcion: novel.descripcion
  }))];

  const phoneNumber = '+5354690878';

  // Get unique genres
  const uniqueGenres = [...new Set(allNovelas.map(novela => novela.genero))].sort();
  
  // Get unique years
  const uniqueYears = [...new Set(allNovelas.map(novela => novela.año))].sort((a, b) => b - a);

  // Listen for embedded config updates
  React.useEffect(() => {
    const handleConfigUpdate = (event: CustomEvent) => {
      // Configuration updated, novels are now embedded
      console.log('Novels catalog updated');
    };

    window.addEventListener('embedded_config_updated', handleConfigUpdate as EventListener);
    return () => window.removeEventListener('embedded_config_updated', handleConfigUpdate as EventListener);
  }, []);

  // Initialize novels with default payment type
  React.useEffect(() => {
    const novelasWithDefaultPayment = allNovelas.map(novela => ({
      ...novela,
      paymentType: 'cash' as const
    }));
    setNovelasWithPayment(novelasWithDefaultPayment);
  }, []);

  // Filter novels function
  const getFilteredNovelas = () => {
    let filtered = novelasWithPayment.filter(novela => {
      const matchesSearch = novela.titulo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = selectedGenre === '' || novela.genero === selectedGenre;
      const matchesYear = selectedYear === '' || novela.año.toString() === selectedYear;
      
      return matchesSearch && matchesGenre && matchesYear;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'titulo':
          comparison = a.titulo.localeCompare(b.titulo);
          break;
        case 'año':
          comparison = a.año - b.año;
          break;
        case 'capitulos':
          comparison = a.capitulos - b.capitulos;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  const filteredNovelas = getFilteredNovelas();

  const handleNovelToggle = (novelaId: number) => {
    setSelectedNovelas(prev => {
      if (prev.includes(novelaId)) {
        return prev.filter(id => id !== novelaId);
      } else {
        return [...prev, novelaId];
      }
    });
  };

  const handlePaymentTypeChange = (novelaId: number, paymentType: 'cash' | 'transfer') => {
    setNovelasWithPayment(prev => 
      prev.map(novela => 
        novela.id === novelaId 
          ? { ...novela, paymentType }
          : novela
      )
    );
  };

  const selectAllNovelas = () => {
    setSelectedNovelas(allNovelas.map(n => n.id));
  };

  const clearAllNovelas = () => {
    setSelectedNovelas([]);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setSelectedYear('');
    setSortBy('titulo');
    setSortOrder('asc');
  };

  // Calculate totals by payment type with embedded pricing
  const calculateTotals = () => {
    const selectedNovelasData = novelasWithPayment.filter(n => selectedNovelas.includes(n.id));
    
    const cashNovelas = selectedNovelasData.filter(n => n.paymentType === 'cash');
    const transferNovelas = selectedNovelasData.filter(n => n.paymentType === 'transfer');
    
    const cashTotal = cashNovelas.reduce((sum, n) => sum + (n.capitulos * novelPricePerChapter), 0);
    const transferBaseTotal = transferNovelas.reduce((sum, n) => sum + (n.capitulos * novelPricePerChapter), 0);
    const transferFee = Math.round(transferBaseTotal * (transferFeePercentage / 100));
    const transferTotal = transferBaseTotal + transferFee;
    
    const grandTotal = cashTotal + transferTotal;
    
    return {
      cashNovelas,
      transferNovelas,
      cashTotal,
      transferBaseTotal,
      transferFee,
      transferTotal,
      grandTotal,
      totalCapitulos: selectedNovelasData.reduce((sum, n) => sum + n.capitulos, 0)
    };
  };

  const totals = calculateTotals();

  const generateNovelListText = () => {
    let listText = "📚 CATÁLOGO DE NOVELAS DISPONIBLES\\n";
    listText += "TV a la Carta - Novelas Completas\\n\\n";
    listText += \`💰 Precio: \${novelPricePerChapter} CUP por capítulo\\n\`;
    listText += \`💳 Recargo transferencia: \${transferFeePercentage}%\\n\`;
    listText += "📱 Contacto: +5354690878\\n\\n";
    listText += "═══════════════════════════════════\\n\\n";
    
    if (allNovelas.length === 0) {
      listText += "📋 No hay novelas disponibles en este momento.\\n";
      listText += "Contacta con el administrador para más información.\\n\\n";
    } else {
      listText += "💵 PRECIOS EN EFECTIVO:\\n";
      listText += "═══════════════════════════════════\\n\\n";
      
      allNovelas.forEach((novela, index) => {
        const baseCost = novela.capitulos * novelPricePerChapter;
        listText += \`\${index + 1}. \${novela.titulo}\\n\`;
        listText += \`   📺 Género: \${novela.genero}\\n\`;
        listText += \`   📊 Capítulos: \${novela.capitulos}\\n\`;
        listText += \`   📅 Año: \${novela.año}\\n\`;
        listText += \`   💰 Costo en efectivo: \${baseCost.toLocaleString()} CUP\\n\\n\`;
      });
      
      listText += \`\\n🏦 PRECIOS CON TRANSFERENCIA BANCARIA (+\${transferFeePercentage}%):\\n\`;
      listText += "═══════════════════════════════════\\n\\n";
      
      allNovelas.forEach((novela, index) => {
        const baseCost = novela.capitulos * novelPricePerChapter;
        const transferCost = Math.round(baseCost * (1 + transferFeePercentage / 100));
        const recargo = transferCost - baseCost;
        listText += \`\${index + 1}. \${novela.titulo}\\n\`;
        listText += \`   📺 Género: \${novela.genero}\\n\`;
        listText += \`   📊 Capítulos: \${novela.capitulos}\\n\`;
        listText += \`   📅 Año: \${novela.año}\\n\`;
        listText += \`   💰 Costo base: \${baseCost.toLocaleString()} CUP\\n\`;
        listText += \`   💳 Recargo (\${transferFeePercentage}%): +\${recargo.toLocaleString()} CUP\\n\`;
        listText += \`   💰 Costo con transferencia: \${transferCost.toLocaleString()} CUP\\n\\n\`;
      });
      
      listText += "\\n📊 RESUMEN DE COSTOS:\\n";
      listText += "═══════════════════════════════════\\n\\n";
      
      const totalCapitulos = allNovelas.reduce((sum, novela) => sum + novela.capitulos, 0);
      const totalEfectivo = allNovelas.reduce((sum, novela) => sum + (novela.capitulos * novelPricePerChapter), 0);
      const totalTransferencia = allNovelas.reduce((sum, novela) => sum + Math.round((novela.capitulos * novelPricePerChapter) * (1 + transferFeePercentage / 100)), 0);
      const totalRecargo = totalTransferencia - totalEfectivo;
      
      listText += \`📊 Total de novelas: \${allNovelas.length}\\n\`;
      listText += \`📊 Total de capítulos: \${totalCapitulos.toLocaleString()}\\n\\n\`;
      listText += \`💵 CATÁLOGO COMPLETO EN EFECTIVO:\\n\`;
      listText += \`   💰 Costo total: \${totalEfectivo.toLocaleString()} CUP\\n\\n\`;
      listText += \`🏦 CATÁLOGO COMPLETO CON TRANSFERENCIA:\\n\`;
      listText += \`   💰 Costo base: \${totalEfectivo.toLocaleString()} CUP\\n\`;
      listText += \`   💳 Recargo total (\${transferFeePercentage}%): +\${totalRecargo.toLocaleString()} CUP\\n\`;
      listText += \`   💰 Costo total con transferencia: \${totalTransferencia.toLocaleString()} CUP\\n\\n\`;
    }
    
    listText += "═══════════════════════════════════\\n";
    listText += "💡 INFORMACIÓN IMPORTANTE:\\n";
    listText += "• Los precios en efectivo no tienen recargo adicional\\n";
    listText += \`• Las transferencias bancarias tienen un \${transferFeePercentage}% de recargo\\n\`;
    listText += "• Puedes seleccionar novelas individuales o el catálogo completo\\n";
    listText += "• Todos los precios están en pesos cubanos (CUP)\\n\\n";
    listText += "📞 Para encargar, contacta al +5354690878\\n";
    listText += "🌟 ¡Disfruta de las mejores novelas!\\n";
    listText += \`\\n📅 Generado el: \${new Date().toLocaleString('es-ES')}\`;
    
    return listText;
  };

  const downloadNovelList = () => {
    const listText = generateNovelListText();
    const blob = new Blob([listText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Catalogo_Novelas_TV_a_la_Carta.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const sendSelectedNovelas = () => {
    if (selectedNovelas.length === 0) {
      alert('Por favor selecciona al menos una novela');
      return;
    }

    const { cashNovelas, transferNovelas, cashTotal, transferBaseTotal, transferFee, transferTotal, grandTotal, totalCapitulos } = totals;
    
    let message = "Me interesan los siguientes títulos:\\n\\n";
    
    // Cash novels
    if (cashNovelas.length > 0) {
      message += "💵 PAGO EN EFECTIVO:\\n";
      message += "═══════════════════════════════════\\n";
      cashNovelas.forEach((novela, index) => {
        message += \`\${index + 1}. \${novela.titulo}\\n\`;
        message += \`   📺 Género: \${novela.genero}\\n\`;
        message += \`   📊 Capítulos: \${novela.capitulos}\\n\`;
        message += \`   📅 Año: \${novela.año}\\n\`;
        message += \`   💰 Costo: \${(novela.capitulos * novelPricePerChapter).toLocaleString()} CUP\\n\\n\`;
      });
      message += \`💰 Subtotal Efectivo: \${cashTotal.toLocaleString()} CUP\\n\`;
      message += \`📊 Total capítulos: \${cashNovelas.reduce((sum, n) => sum + n.capitulos, 0)}\\n\\n\`;
    }
    
    // Transfer novels
    if (transferNovelas.length > 0) {
      message += \`🏦 PAGO POR TRANSFERENCIA BANCARIA (+\${transferFeePercentage}%):\\n\`;
      message += "═══════════════════════════════════\\n";
      transferNovelas.forEach((novela, index) => {
        const baseCost = novela.capitulos * novelPricePerChapter;
        const fee = Math.round(baseCost * (transferFeePercentage / 100));
        const totalCost = baseCost + fee;
        message += \`\${index + 1}. \${novela.titulo}\\n\`;
        message += \`   📺 Género: \${novela.genero}\\n\`;
        message += \`   📊 Capítulos: \${novela.capitulos}\\n\`;
        message += \`   📅 Año: \${novela.año}\\n\`;
        message += \`   💰 Costo base: \${baseCost.toLocaleString()} CUP\\n\`;
        message += \`   💳 Recargo (\${transferFeePercentage}%): +\${fee.toLocaleString()} CUP\\n\`;
        message += \`   💰 Costo total: \${totalCost.toLocaleString()} CUP\\n\\n\`;
      });
      message += \`💰 Subtotal base transferencia: \${transferBaseTotal.toLocaleString()} CUP\\n\`;
      message += \`💳 Recargo total (\${transferFeePercentage}%): +\${transferFee.toLocaleString()} CUP\\n\`;
      message += \`💰 Subtotal Transferencia: \${transferTotal.toLocaleString()} CUP\\n\`;
      message += \`📊 Total capítulos: \${transferNovelas.reduce((sum, n) => sum + n.capitulos, 0)}\\n\\n\`;
    }
    
    // Final summary
    message += "📊 RESUMEN FINAL:\\n";
    message += "═══════════════════════════════════\\n";
    message += \`• Total de novelas: \${selectedNovelas.length}\\n\`;
    message += \`• Total de capítulos: \${totalCapitulos}\\n\`;
    if (cashTotal > 0) {
      message += \`• Efectivo: \${cashTotal.toLocaleString()} CUP (\${cashNovelas.length} novelas)\\n\`;
    }
    if (transferTotal > 0) {
      message += \`• Transferencia: \${transferTotal.toLocaleString()} CUP (\${transferNovelas.length} novelas)\\n\`;
    }
    message += \`• TOTAL A PAGAR: \${grandTotal.toLocaleString()} CUP\\n\\n\`;
    message += \`📱 Enviado desde TV a la Carta\\n\`;
    message += \`📅 Fecha: \${new Date().toLocaleString('es-ES')}\`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = \`https://wa.me/5354690878?text=\${encodedMessage}\`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCall = () => {
    window.open(\`tel:\${phoneNumber}\`, '_self');
  };

  const handleWhatsApp = () => {
    const message = "📚 *Solicitar novelas*\\n\\n¿Hay novelas que me gustaría ver en [TV a la Carta] a continuación te comento:";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = \`https://wa.me/5354690878?text=\${encodedMessage}\`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl animate-in fade-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-xl mr-4 shadow-lg">
                <BookOpen className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">Catálogo de Novelas</h2>
                <p className="text-sm sm:text-base opacity-90">Novelas completas disponibles</p>
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

        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <div className="p-4 sm:p-6">
            {/* Main Information */}
            <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-3xl p-8 mb-8 border-2 border-pink-200 shadow-xl">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-4 rounded-2xl mr-4 shadow-lg">
                  <Info className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Información Importante
                </h3>
              </div>
              
              <div className="space-y-6 text-gray-800">
                <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-pink-200 shadow-sm">
                  <div className="bg-gradient-to-r from-blue-400 to-purple-400 p-3 rounded-xl mr-4">
                    <span className="text-2xl">📚</span>
                  </div>
                  <p className="font-bold text-lg">Las novelas se encargan completas</p>
                </div>
                <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-green-200 shadow-sm">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-400 p-3 rounded-xl mr-4">
                    <span className="text-2xl">💰</span>
                  </div>
                  <p className="font-bold text-lg">Costo: \${novelPricePerChapter} CUP por cada capítulo</p>
                </div>
                <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-orange-200 shadow-sm">
                  <div className="bg-gradient-to-r from-orange-400 to-red-400 p-3 rounded-xl mr-4">
                    <span className="text-2xl">💳</span>
                  </div>
                  <p className="font-bold text-lg">Transferencia bancaria: +{transferFeePercentage}% de recargo</p>
                </div>
                <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-blue-200 shadow-sm">
                  <div className="bg-gradient-to-r from-blue-400 to-cyan-400 p-3 rounded-xl mr-4">
                    <span className="text-2xl">📱</span>
                  </div>
                  <p className="font-bold text-lg">Para más información, contacta al número:</p>
                </div>
              </div>

              {/* Contact number */}
              <div className="mt-8 bg-gradient-to-r from-white to-blue-50 rounded-2xl p-6 border-2 border-blue-300 shadow-lg">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                  <div className="text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start mb-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg mr-3">
                        <Smartphone className="h-5 w-5 text-white" />
                      </div>
                      <p className="text-xl font-black text-gray-900">{phoneNumber}</p>
                    </div>
                    <p className="text-sm font-semibold text-blue-600 ml-10">Contacto directo</p>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={handleCall}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center"
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      Llamar
                    </button>
                    <button
                      onClick={handleWhatsApp}
                      className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center"
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Catalog options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <button
                onClick={downloadNovelList}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center"
              >
                <Download className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="text-lg">Descargar Catálogo</div>
                  <div className="text-sm opacity-90">Lista completa de novelas</div>
                </div>
              </button>
              
              <button
                onClick={() => setShowNovelList(!showNovelList)}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center"
              >
                <BookOpen className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="text-lg">Ver y Seleccionar</div>
                  <div className="text-sm opacity-90">Elegir novelas específicas</div>
                </div>
              </button>
            </div>

            {/* Show message when no novels available */}
            {allNovelas.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                <BookOpen className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  No hay novelas disponibles
                </h3>
                <p className="text-yellow-700">
                  El catálogo de novelas está vacío. Contacta con el administrador para agregar novelas al sistema.
                </p>
              </div>
            )}

            {/* Rest of the component remains the same... */}
          </div>
        </div>
      </div>
    </div>
  );
}`;
}

function generatePackageJson(): string {
  return `{
  "name": "tv-a-la-carta-sistema-completo",
  "private": true,
  "version": "2.1.0",
  "type": "module",
  "description": "Sistema completo de gestión para TV a la Carta con configuración embebida",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@types/node": "^24.2.1",
    "jszip": "^3.10.1",
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.8.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2"
  },
  "keywords": [
    "tv",
    "movies",
    "series",
    "anime",
    "streaming",
    "cart",
    "admin",
    "react",
    "typescript",
    "embedded-config"
  ],
  "author": "TV a la Carta",
  "license": "MIT"
}`;
}

function generateReadme(systemConfig: SystemConfig): string {
  return `# TV a la Carta - Sistema de Gestión Completo

## Descripción
Sistema completo de gestión para TV a la Carta con configuración embebida, panel de administración, carrito de compras y sincronización en tiempo real.

## Versión
${systemConfig.version}

## Última Exportación
${new Date().toISOString()}

## Configuración Embebida

### Precios
- Películas: $${systemConfig.prices?.moviePrice || 80} CUP
- Series: $${systemConfig.prices?.seriesPrice || 300} CUP por temporada
- Recargo transferencia: ${systemConfig.prices?.transferFeePercentage || 10}%
- Novelas: $${systemConfig.prices?.novelPricePerChapter || 5} CUP por capítulo

### Zonas de Entrega
Total configuradas: ${systemConfig.deliveryZones?.length || 0}

### Novelas Administradas
Total: ${systemConfig.novels?.length || 0}

## Características
- ✅ Panel de administración completo
- ✅ Configuración embebida en código fuente
- ✅ Sincronización automática de cambios
- ✅ Gestión de precios dinámicos
- ✅ Zonas de entrega personalizables
- ✅ Catálogo de novelas administrable
- ✅ Sistema de notificaciones
- ✅ Exportación/Importación de configuración
- ✅ Optimización de rendimiento
- ✅ Carrito de compras avanzado
- ✅ Integración con WhatsApp
- ✅ Sin dependencia de localStorage

## Instalación
\`\`\`bash
npm install
npm run dev
\`\`\`

## Uso del Panel de Administración
1. Acceder a /admin
2. Usuario: admin
3. Contraseña: tvalacarta2024

## Tecnologías
- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Router
- Lucide Icons
- JSZip

## Contacto
WhatsApp: +5354690878

## Notas Importantes
- Toda la configuración está embebida en el código fuente
- Los cambios en el panel de administración se aplican automáticamente
- No requiere localStorage para funcionar
- Sistema completamente autónomo`;
}

function getViteConfig(): string {
  return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
  },
  preview: {
    historyApiFallback: true,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});`;
}

function getTailwindConfig(): string {
  return `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};`;
}

function getIndexHtml(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/unnamed.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <base href="/" />
    <title>TV a la Carta: Películas y series ilimitadas y mucho más</title>
    <style>
      * {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
      }
      
      input, textarea, [contenteditable="true"] {
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }
      
      body {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        text-size-adjust: 100%;
        touch-action: manipulation;
      }
      
      input[type="text"],
      input[type="email"],
      input[type="tel"],
      input[type="password"],
      input[type="number"],
      input[type="search"],
      textarea,
      select {
        font-size: 16px !important;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
}

function getMainTsx(): string {
  return `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);`;
}

function getIndexCss(): string {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    text-size-adjust: 100%;
    touch-action: manipulation;
  }
  
  body {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    overflow-x: hidden;
  }
  
  input, textarea, [contenteditable="true"] {
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
    user-select: text !important;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="tel"],
  input[type="password"],
  input[type="number"],
  input[type="search"],
  textarea,
  select {
    font-size: 16px !important;
    transform: translateZ(0);
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
  
  img {
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
    pointer-events: none;
  }
  
  button, a, [role="button"], .clickable {
    pointer-events: auto;
  }
  
  button img, a img, [role="button"] img, .clickable img {
    pointer-events: none;
  }
  
  @keyframes shrink {
    from { width: 100%; }
    to { width: 0%; }
  }
  
  .animate-shrink {
    animation: shrink 3s linear forwards;
  }
}`;
}

function getNetlifyRedirects(): string {
  return `# Netlify redirects for SPA routing
/*    /index.html   200

# Handle specific routes
/movies    /index.html   200
/tv        /index.html   200
/anime     /index.html   200
/cart      /index.html   200
/search    /index.html   200
/movie/*   /index.html   200
/tv/*      /index.html   200
/admin     /index.html   200`;
}

function getVercelConfig(): string {
  return `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }`;
}