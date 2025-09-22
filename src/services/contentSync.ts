import { tmdbService } from './tmdb';
import { contentFilterService } from '../services/contentFilter';
import type { Movie, TVShow } from '../types/movie';

class ContentSyncService {
  private lastDailyUpdate: Date | null = null;
  private lastWeeklyUpdate: Date | null = null;
  private syncInProgress = false;
  private syncInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeRealTimeSync();
  }

  private initializeRealTimeSync() {
    // Sincronización cada 30 minutos para contenido fresco
    this.syncInterval = setInterval(() => {
      this.performRealTimeSync();
    }, 30 * 60 * 1000); // 30 minutos

    // Sincronización inicial
    this.performRealTimeSync();

    // Escuchar eventos de visibilidad para sincronizar cuando la página vuelve a estar activa
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.performRealTimeSync();
      }
    });

    // Escuchar eventos de conexión
    window.addEventListener('online', () => {
      console.log('🌐 Conexión restaurada, sincronizando contenido...');
      this.performRealTimeSync();
    });
  }

  private async performRealTimeSync() {
    if (this.syncInProgress || !navigator.onLine) return;

    try {
      this.syncInProgress = true;
      console.log('🔄 Iniciando sincronización en tiempo real...');

      // Sincronizar contenido crítico en tiempo real
      await Promise.all([
        this.syncTrendingContentRealTime('day'),
        this.syncTrendingContentRealTime('week'),
        this.syncPopularContentRealTime(),
        this.syncCurrentReleasesRealTime(),
        this.syncAnimeContentRealTime()
      ]);

      this.lastDailyUpdate = new Date();
      console.log('✅ Sincronización en tiempo real completada');

      // Notificar a la aplicación
      window.dispatchEvent(new CustomEvent('content_sync_completed', {
        detail: { timestamp: new Date().toISOString(), type: 'realtime' }
      }));

    } catch (error) {
      console.error('❌ Error en sincronización en tiempo real:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Sincronizar trending en tiempo real
  private async syncTrendingContentRealTime(timeWindow: 'day' | 'week') {
    try {
      const response = await tmdbService.getTrendingAll(timeWindow, 1);
      const filteredContent = contentFilterService.filterContent(response.results);
      
      localStorage.setItem(`trending_${timeWindow}_realtime`, JSON.stringify({
        content: filteredContent.slice(0, 20),
        lastUpdate: new Date().toISOString(),
        source: 'realtime_sync'
      }));
      
      return filteredContent;
    } catch (error) {
      console.error(`Error sincronizando trending ${timeWindow} en tiempo real:`, error);
      return [];
    }
  }

  // Sincronizar contenido popular en tiempo real
  private async syncPopularContentRealTime() {
    try {
      const [movies, tvShows] = await Promise.all([
        tmdbService.getPopularMovies(1),
        tmdbService.getPopularTVShows(1)
      ]);

      const filteredMovies = contentFilterService.filterContent(movies.results);
      const filteredTVShows = contentFilterService.filterContent(tvShows.results);

      localStorage.setItem('popular_movies_realtime', JSON.stringify({
        content: filteredMovies.slice(0, 20),
        lastUpdate: new Date().toISOString()
      }));

      localStorage.setItem('popular_tv_realtime', JSON.stringify({
        content: filteredTVShows.slice(0, 20),
        lastUpdate: new Date().toISOString()
      }));

      return { movies: filteredMovies, tvShows: filteredTVShows };
    } catch (error) {
      console.error('Error sincronizando contenido popular en tiempo real:', error);
      return { movies: [], tvShows: [] };
    }
  }

  // Sincronizar estrenos actuales en tiempo real
  private async syncCurrentReleasesRealTime() {
    try {
      const [nowPlayingMovies, airingTodayTV, onTheAirTV] = await Promise.all([
        tmdbService.getNowPlayingMovies(1),
        tmdbService.getAiringTodayTVShows(1),
        tmdbService.getOnTheAirTVShows(1)
      ]);

      localStorage.setItem('now_playing_realtime', JSON.stringify({
        content: contentFilterService.filterContent(nowPlayingMovies.results).slice(0, 20),
        lastUpdate: new Date().toISOString()
      }));

      localStorage.setItem('airing_today_realtime', JSON.stringify({
        content: contentFilterService.filterContent(airingTodayTV.results).slice(0, 20),
        lastUpdate: new Date().toISOString()
      }));

      localStorage.setItem('on_the_air_realtime', JSON.stringify({
        content: contentFilterService.filterContent(onTheAirTV.results).slice(0, 20),
        lastUpdate: new Date().toISOString()
      }));

      return { 
        nowPlayingMovies: nowPlayingMovies.results, 
        airingTodayTV: airingTodayTV.results, 
        onTheAirTV: onTheAirTV.results 
      };
    } catch (error) {
      console.error('Error sincronizando estrenos actuales en tiempo real:', error);
      return { nowPlayingMovies: [], airingTodayTV: [], onTheAirTV: [] };
    }
  }

  // Sincronizar anime en tiempo real
  private async syncAnimeContentRealTime() {
    try {
      const anime = await tmdbService.getAnimeFromMultipleSources(1);
      const filteredAnime = contentFilterService.filterContent(anime.results);
      
      localStorage.setItem('anime_content_realtime', JSON.stringify({
        content: filteredAnime.slice(0, 20),
        lastUpdate: new Date().toISOString()
      }));

      return filteredAnime;
    } catch (error) {
      console.error('Error sincronizando anime en tiempo real:', error);
      return [];
    }
  }

  // Métodos públicos para componentes
  async getTrendingContent(timeWindow: 'day' | 'week'): Promise<(Movie | TVShow)[]> {
    // Intentar caché en tiempo real primero
    const realtimeCache = localStorage.getItem(`trending_${timeWindow}_realtime`);
    if (realtimeCache) {
      try {
        const { content, lastUpdate } = JSON.parse(realtimeCache);
        const age = Date.now() - new Date(lastUpdate).getTime();
        if (age < 15 * 60 * 1000) { // 15 minutos
          return content;
        }
      } catch (error) {
        console.error('Error parseando caché en tiempo real:', error);
      }
    }

    // Fallback a caché normal
    const cached = localStorage.getItem(`trending_${timeWindow}_fresh`);
    if (cached) {
      try {
        const { content, lastUpdate } = JSON.parse(cached);
        const age = Date.now() - new Date(lastUpdate).getTime();
        if (age < 60 * 60 * 1000) { // 1 hora
          return content;
        }
      } catch (error) {
        console.error('Error parseando caché:', error);
      }
    }

    // Obtener contenido fresco
    const response = await tmdbService.getTrendingAll(timeWindow, 1);
    return contentFilterService.filterContent(response.results);
  }

  async getPopularContent(): Promise<{ movies: Movie[]; tvShows: TVShow[]; anime: TVShow[] }> {
    const [movies, tvShows, anime] = await Promise.all([
      this.getCachedOrFreshRealTime('popular_movies', () => tmdbService.getPopularMovies(1)),
      this.getCachedOrFreshRealTime('popular_tv', () => tmdbService.getPopularTVShows(1)),
      this.getCachedOrFreshRealTime('anime_content', () => tmdbService.getAnimeFromMultipleSources(1))
    ]);

    return {
      movies: movies.results || movies,
      tvShows: tvShows.results || tvShows,
      anime: anime.results || anime
    };
  }

  // Obtener videos cacheados para contenido
  getCachedVideos(id: number, type: 'movie' | 'tv'): any[] {
    try {
      const cached = localStorage.getItem('content_videos_fresh');
      if (cached) {
        const { videos } = JSON.parse(cached);
        const key = `${type}-${id}`;
        return videos[key] || [];
      }
    } catch (error) {
      console.error('Error obteniendo videos cacheados:', error);
    }
    return [];
  }

  private async getCachedOrFreshRealTime(key: string, fetchFn: () => Promise<any>) {
    // Intentar caché en tiempo real primero
    const realtimeCache = localStorage.getItem(`${key}_realtime`);
    if (realtimeCache) {
      try {
        const { content, lastUpdate } = JSON.parse(realtimeCache);
        const age = Date.now() - new Date(lastUpdate).getTime();
        if (age < 15 * 60 * 1000) { // 15 minutos
          return content;
        }
      } catch (error) {
        console.error(`Error parseando caché en tiempo real ${key}:`, error);
      }
    }

    // Intentar caché normal
    const cached = localStorage.getItem(`${key}_fresh`);
    if (cached) {
      try {
        const { content, lastUpdate } = JSON.parse(cached);
        const age = Date.now() - new Date(lastUpdate).getTime();
        if (age < 60 * 60 * 1000) { // 1 hora
          return content;
        }
      } catch (error) {
        console.error(`Error parseando caché ${key}:`, error);
      }
    }

    // Obtener contenido fresco
    const fresh = await fetchFn();
    localStorage.setItem(`${key}_fresh`, JSON.stringify({
      content: fresh.results || fresh,
      lastUpdate: new Date().toISOString()
    }));

    return fresh.results || fresh;
  }

  // Forzar actualización completa
  async forceRefresh(): Promise<void> {
    this.lastDailyUpdate = null;
    this.lastWeeklyUpdate = null;
    
    // Limpiar todos los cachés
    await tmdbService.forceRefreshAllContent();
    
    // Limpiar cachés de videos
    localStorage.removeItem('content_videos_fresh');
    localStorage.removeItem('content_videos_realtime');
    
    // Limpiar todos los cachés de contenido
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('trending') || key.includes('popular') || key.includes('now_playing') || 
          key.includes('airing') || key.includes('anime') || key.includes('realtime') || 
          key.includes('fresh')) {
        localStorage.removeItem(key);
      }
    });
    
    await this.performRealTimeSync();
  }

  // Obtener estado de sincronización
  getSyncStatus(): { lastDaily: Date | null; lastWeekly: Date | null; inProgress: boolean; nextSync: Date | null } {
    const nextSync = this.lastDailyUpdate 
      ? new Date(this.lastDailyUpdate.getTime() + 30 * 60 * 1000) // Próxima sincronización en 30 minutos
      : new Date();

    return {
      lastDaily: this.lastDailyUpdate,
      lastWeekly: this.lastWeeklyUpdate,
      inProgress: this.syncInProgress,
      nextSync
    };
  }

  // Destructor
  destroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    
    document.removeEventListener('visibilitychange', this.performRealTimeSync);
    window.removeEventListener('online', this.performRealTimeSync);
  }
}

export const contentSyncService = new ContentSyncService();