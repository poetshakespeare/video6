// Centralized API service for better error handling and caching
import { BASE_URL, API_OPTIONS } from '../config/api';

export class APIService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutos para contenido regular
  private readonly FRESH_CACHE_DURATION = 10 * 60 * 1000; // 10 minutos para contenido trending/actual
  private readonly REALTIME_CACHE_DURATION = 5 * 60 * 1000; // 5 minutos para contenido en tiempo real
  private retryAttempts = 3;
  private retryDelay = 1000;

  async fetchWithCache<T>(endpoint: string, useCache: boolean = true): Promise<T> {
    const cacheKey = endpoint;
    const cacheDuration = this.getCacheDuration(endpoint);
    
    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      const isExpired = Date.now() - cached.timestamp > cacheDuration;
      
      if (!isExpired) {
        return cached.data;
      }
    }

    return this.fetchWithRetry<T>(endpoint, useCache, 0);
  }

  private async fetchWithRetry<T>(endpoint: string, useCache: boolean, attempt: number): Promise<T> {
    const cacheKey = endpoint;
    
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...API_OPTIONS,
        // Agregar headers adicionales para mejor compatibilidad
        headers: {
          ...API_OPTIONS.headers,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        // Manejar errores 404 graciosamente para endpoints de videos
        if (response.status === 404 && endpoint.includes('/videos')) {
          console.warn(`Videos no encontrados para endpoint: ${endpoint}`);
          return { results: [] } as T;
        }
        // Manejar errores 404 graciosamente para endpoints de detalles y créditos
        if (response.status === 404 && (endpoint.includes('/movie/') || endpoint.includes('/tv/'))) {
          console.warn(`Contenido no encontrado para endpoint: ${endpoint}`);
          return null as T;
        }
        
        // Reintentar para errores temporales
        if (response.status >= 500 && attempt < this.retryAttempts) {
          console.warn(`Error ${response.status} para ${endpoint}, reintentando... (${attempt + 1}/${this.retryAttempts})`);
          await this.delay(this.retryDelay * (attempt + 1));
          return this.fetchWithRetry<T>(endpoint, useCache, attempt + 1);
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (useCache) {
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
        
        // También guardar en localStorage para persistencia entre sesiones
        try {
          localStorage.setItem(`api_cache_${cacheKey}`, JSON.stringify({
            data,
            timestamp: Date.now()
          }));
        } catch (storageError) {
          console.warn('Error guardando en localStorage:', storageError);
        }
      }
      
      return data;
    } catch (error) {
      console.error(`Error de API para ${endpoint} (intento ${attempt + 1}):`, error);
      
      // Reintentar para errores de red
      if (attempt < this.retryAttempts && (error instanceof TypeError || error.message.includes('fetch'))) {
        console.warn(`Error de red para ${endpoint}, reintentando... (${attempt + 1}/${this.retryAttempts})`);
        await this.delay(this.retryDelay * (attempt + 1));
        return this.fetchWithRetry<T>(endpoint, useCache, attempt + 1);
      }
      
      // Manejar endpoints de videos específicamente
      if (endpoint.includes('/videos')) {
        console.warn(`Retornando videos vacíos para ${endpoint}`);
        return { results: [] } as T;
      }
      
      // Intentar usar datos cacheados si están disponibles, incluso si están expirados
      if (this.cache.has(cacheKey)) {
        console.warn(`Usando caché expirado para ${endpoint}`);
        return this.cache.get(cacheKey)!.data;
      }
      
      // Intentar cargar desde localStorage
      try {
        const localCache = localStorage.getItem(`api_cache_${cacheKey}`);
        if (localCache) {
          const { data } = JSON.parse(localCache);
          console.warn(`Usando caché de localStorage para ${endpoint}`);
          return data;
        }
      } catch (localError) {
        console.warn('Error cargando desde localStorage:', localError);
      }
      
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getCacheDuration(endpoint: string): number {
    // Usar caché más corto para contenido trending, popular y actual
    if (endpoint.includes('/trending') || 
        endpoint.includes('/now_playing') || 
        endpoint.includes('/airing_today') || 
        endpoint.includes('/on_the_air') ||
        endpoint.includes('/popular') ||
        endpoint.includes('/upcoming')) {
      return this.FRESH_CACHE_DURATION;
    }
    
    // Caché aún más corto para contenido en tiempo real
    if (endpoint.includes('realtime') || endpoint.includes('live')) {
      return this.REALTIME_CACHE_DURATION;
    }
    
    return this.CACHE_DURATION;
  }

  clearCache(): void {
    this.cache.clear();
    
    // También limpiar cachés de localStorage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('fresh_') || 
          key.startsWith('api_cache_') ||
          key.includes('realtime') ||
          key.includes('trending') || 
          key.includes('popular') || 
          key.includes('now_playing') || 
          key.includes('airing') ||
          key.includes('upcoming') ||
          key.includes('top_rated')) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('🗑️ Todos los cachés limpiados');
  }

  getCacheSize(): number {
    const memorySize = this.cache.size;
    const localStorageSize = Object.keys(localStorage).filter(key => 
      key.startsWith('api_cache_') || key.includes('fresh_') || key.includes('realtime')
    ).length;
    
    return memorySize + localStorageSize;
  }

  getCacheInfo(): { key: string; age: number }[] {
    const now = Date.now();
    const memoryCache = Array.from(this.cache.entries()).map(([key, { timestamp }]) => ({
      key,
      age: now - timestamp
    }));
    
    const localStorageCache = Object.keys(localStorage)
      .filter(key => key.startsWith('api_cache_'))
      .map(key => {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const { timestamp } = JSON.parse(cached);
            return { key: key.replace('api_cache_', ''), age: now - timestamp };
          }
        } catch (error) {
          return { key, age: Infinity };
        }
        return { key, age: Infinity };
      })
      .filter(item => item.age !== Infinity);
    
    return [...memoryCache, ...localStorageCache];
  }

  // Método para verificar conectividad
  async checkConnectivity(): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/configuration`, {
        ...API_OPTIONS,
        signal: AbortSignal.timeout(5000) // 5 segundos timeout
      });
      return response.ok;
    } catch (error) {
      console.warn('Error verificando conectividad:', error);
      return false;
    }
  }

  // Método para obtener estadísticas de rendimiento
  getPerformanceStats(): { 
    cacheHitRate: number; 
    averageResponseTime: number; 
    totalRequests: number;
    failedRequests: number;
  } {
    // Implementación básica - se puede expandir con métricas reales
    return {
      cacheHitRate: 0.85, // 85% estimado
      averageResponseTime: 250, // 250ms estimado
      totalRequests: this.cache.size * 2, // Estimación
      failedRequests: 0 // Se puede rastrear en implementación futura
    };
  }
}

export const apiService = new APIService();