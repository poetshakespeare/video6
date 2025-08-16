import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AdminConfig, AdminState, NovelasConfig } from '../types/admin';

interface AdminContextType {
  state: AdminState;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updatePricing: (pricing: AdminConfig['pricing']) => void;
  addNovela: (novela: Omit<NovelasConfig, 'id'>) => void;
  updateNovela: (id: number, novela: Partial<NovelasConfig>) => void;
  deleteNovela: (id: number) => void;
  exportConfig: () => string;
  importConfig: (configJson: string) => boolean;
  resetToDefaults: () => void;
}

type AdminAction = 
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PRICING'; payload: AdminConfig['pricing'] }
  | { type: 'ADD_NOVELA'; payload: NovelasConfig }
  | { type: 'UPDATE_NOVELA'; payload: { id: number; novela: Partial<NovelasConfig> } }
  | { type: 'DELETE_NOVELA'; payload: number }
  | { type: 'LOAD_CONFIG'; payload: AdminConfig }
  | { type: 'RESET_CONFIG' };

const defaultConfig: AdminConfig = {
  pricing: {
    moviePrice: 80,
    seriesPrice: 300,
    transferFeePercentage: 10
  },
  novelas: [
    { id: 1, titulo: "Corazón Salvaje", genero: "Drama/Romance", capitulos: 185, año: 2009, costoEfectivo: 925, costoTransferencia: 1018 },
    { id: 2, titulo: "La Usurpadora", genero: "Drama/Melodrama", capitulos: 98, año: 1998, costoEfectivo: 490, costoTransferencia: 539 },
    { id: 3, titulo: "María la del Barrio", genero: "Drama/Romance", capitulos: 73, año: 1995, costoEfectivo: 365, costoTransferencia: 402 },
    { id: 4, titulo: "Marimar", genero: "Drama/Romance", capitulos: 63, año: 1994, costoEfectivo: 315, costoTransferencia: 347 },
    { id: 5, titulo: "Rosalinda", genero: "Drama/Romance", capitulos: 80, año: 1999, costoEfectivo: 400, costoTransferencia: 440 },
    { id: 6, titulo: "La Madrastra", genero: "Drama/Suspenso", capitulos: 135, año: 2005, costoEfectivo: 675, costoTransferencia: 743 },
    { id: 7, titulo: "Rubí", genero: "Drama/Melodrama", capitulos: 115, año: 2004, costoEfectivo: 575, costoTransferencia: 633 },
    { id: 8, titulo: "Pasión de Gavilanes", genero: "Drama/Romance", capitulos: 188, año: 2003, costoEfectivo: 940, costoTransferencia: 1034 },
    { id: 9, titulo: "Yo Soy Betty, la Fea", genero: "Comedia/Romance", capitulos: 335, año: 1999, costoEfectivo: 1675, costoTransferencia: 1843 },
    { id: 10, titulo: "El Cuerpo del Deseo", genero: "Drama/Fantasía", capitulos: 178, año: 2005, costoEfectivo: 890, costoTransferencia: 979 }
  ]
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false };
    case 'UPDATE_PRICING':
      const newConfig = { ...state.config, pricing: action.payload };
      localStorage.setItem('adminConfig', JSON.stringify(newConfig));
      return { ...state, config: newConfig };
    case 'ADD_NOVELA':
      const configWithNewNovela = {
        ...state.config,
        novelas: [...state.config.novelas, action.payload]
      };
      localStorage.setItem('adminConfig', JSON.stringify(configWithNewNovela));
      return { ...state, config: configWithNewNovela };
    case 'UPDATE_NOVELA':
      const updatedNovelas = state.config.novelas.map(novela =>
        novela.id === action.payload.id
          ? { ...novela, ...action.payload.novela }
          : novela
      );
      const configWithUpdatedNovela = { ...state.config, novelas: updatedNovelas };
      localStorage.setItem('adminConfig', JSON.stringify(configWithUpdatedNovela));
      return { ...state, config: configWithUpdatedNovela };
    case 'DELETE_NOVELA':
      const filteredNovelas = state.config.novelas.filter(novela => novela.id !== action.payload);
      const configWithDeletedNovela = { ...state.config, novelas: filteredNovelas };
      localStorage.setItem('adminConfig', JSON.stringify(configWithDeletedNovela));
      return { ...state, config: configWithDeletedNovela };
    case 'LOAD_CONFIG':
      return { ...state, config: action.payload };
    case 'RESET_CONFIG':
      localStorage.setItem('adminConfig', JSON.stringify(defaultConfig));
      return { ...state, config: defaultConfig };
    default:
      return state;
  }
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, {
    isAuthenticated: false,
    config: defaultConfig
  });

  useEffect(() => {
    const savedConfig = localStorage.getItem('adminConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        dispatch({ type: 'LOAD_CONFIG', payload: config });
      } catch (error) {
        console.error('Error loading admin config:', error);
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === 'administrador' && password === 'root') {
      dispatch({ type: 'LOGIN' });
      return true;
    }
    return false;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updatePricing = (pricing: AdminConfig['pricing']) => {
    dispatch({ type: 'UPDATE_PRICING', payload: pricing });
  };

  const addNovela = (novela: Omit<NovelasConfig, 'id'>) => {
    const newId = Math.max(...state.config.novelas.map(n => n.id), 0) + 1;
    const novelaWithId = { ...novela, id: newId };
    dispatch({ type: 'ADD_NOVELA', payload: novelaWithId });
  };

  const updateNovela = (id: number, novela: Partial<NovelasConfig>) => {
    dispatch({ type: 'UPDATE_NOVELA', payload: { id, novela } });
  };

  const deleteNovela = (id: number) => {
    dispatch({ type: 'DELETE_NOVELA', payload: id });
  };

  const exportConfig = (): string => {
    const exportData = {
      config: state.config,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(exportData, null, 2);
  };

  const importConfig = (configJson: string): boolean => {
    try {
      const importData = JSON.parse(configJson);
      if (importData.config && importData.config.pricing && importData.config.novelas) {
        dispatch({ type: 'LOAD_CONFIG', payload: importData.config });
        localStorage.setItem('adminConfig', JSON.stringify(importData.config));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing config:', error);
      return false;
    }
  };

  const resetToDefaults = () => {
    dispatch({ type: 'RESET_CONFIG' });
  };

  return (
    <AdminContext.Provider value={{
      state,
      login,
      logout,
      updatePricing,
      addNovela,
      updateNovela,
      deleteNovela,
      exportConfig,
      importConfig,
      resetToDefaults
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