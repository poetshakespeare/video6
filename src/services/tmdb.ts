import { BASE_URL, API_OPTIONS } from '../config/api';
import { apiService } from './api';
import { contentFilterService } from './contentFilter';
import type { Movie, TVShow, MovieDetails, TVShowDetails, Video, APIResponse, Genre, Cast, CastMember } from '../types/movie';

class TMDBService {
  private readonly FRESH_CONTENT_CACHE_DURATION = 15 * 60 * 1000; // 15 minutos para contenido fresco
  private readonly DETAILS_CACHE_DURATION = 60 * 60 * 1000; // 1 hora para detalles
  private readonly DAILY_REFRESH_INTERVAL = 24 * 60 * 60 * 1000; // 24 horas
  private readonly WEEKLY_REFRESH_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 días

  private lastDailySync: Date | null = null;
  private lastWeeklySync: Date | null = null;
  private autoSyncInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeAutoSync();
  }

  // Inicializar sincronización automática diaria
  private initializeAutoSync() {
    // Verificar y sincronizar cada hora
    this.autoSyncInterval = setInterval(() => {
      this.checkAndPerformAutoSync();
    }, 60 * 60 * 1000); // 1 hora

    // Sincronización inicial
    this.checkAndPerformAutoSync();
  }

  private async checkAndPerformAutoSync() {
    const now = new Date();
    const shouldDailySync = this.shouldPerformDailySync(now);
    const shouldWeeklySync = this.shouldPerformWeeklySync(now);

    if (shouldDailySync || shouldWeeklySync) {
      console.log('🔄 Iniciando sincronización automática de contenido TMDB...');
      await this.performAutoSync(shouldWeeklySync);
    }
  }

  private shouldPerformDailySync(now: Date): boolean {
    if (!this.lastDailySync) return true;
    return (now.getTime() - this.lastDailySync.getTime()) >= this.DAILY_REFRESH_INTERVAL;
  }

  private shouldPerformWeeklySync(now: Date): boolean {
    if (!this.lastWeeklySync) return true;
    return (now.getTime() - this.lastWeeklySync.getTime()) >= this.WEEKLY_REFRESH_INTERVAL;
  }

  private async performAutoSync(isWeeklySync: boolean = false) {
    try {
      console.log(`🔄 Realizando sincronización ${isWeeklySync ? 'semanal' : 'diaria'} con TMDB...`);

      // Limpiar cachés antiguos
      this.clearExpiredCaches();

      // Sincronizar todo el contenido en paralelo
      await Promise.all([
        this.syncTrendingContent('day'),
        this.syncTrendingContent('week'),
        this.syncPopularContent(),
        this.syncCurrentReleases(),
        this.syncTopRatedContent(),
        this.syncUpcomingContent(),
        this.syncAnimeContent(),
        this.syncDocumentariesAndAnimated(),
        this.syncInTheatersAndOnTV(),
        this.syncVideosForAllContent()
      ]);

      const now = new Date();
      this.lastDailySync = now;
      
      if (isWeeklySync) {
        this.lastWeeklySync = now;
      }

      console.log('✅ Sincronización de contenido TMDB completada exitosamente');
      
      // Notificar a la aplicación sobre la actualización
      window.dispatchEvent(new CustomEvent('tmdb_content_updated', {
        detail: { timestamp: now.toISOString(), type: isWeeklySync ? 'weekly' : 'daily' }
      }));

    } catch (error) {
      console.error('❌ Error durante la sincronización de contenido TMDB:', error);
    }
  }

  // Sincronizar contenido en tendencia
  private async syncTrendingContent(timeWindow: 'day' | 'week') {
    try {
      const [globalTrending, spanishTrending] = await Promise.all([
        this.fetchData(`/trending/all/${timeWindow}?page=1`, false),
        this.fetchData(`/trending/all/${timeWindow}?language=es-ES&page=1&region=ES`, false)
      ]);

      const combinedResults = this.removeDuplicates([
        ...globalTrending.results,
        ...spanishTrending.results
      ]);

      const filteredContent = contentFilterService.filterContent(combinedResults);
      
      localStorage.setItem(`trending_${timeWindow}_fresh`, JSON.stringify({
        content: filteredContent,
        lastUpdate: new Date().toISOString(),
        source: 'auto_sync'
      }));

      console.log(`✅ Sincronizado trending ${timeWindow}: ${filteredContent.length} elementos`);
    } catch (error) {
      console.error(`❌ Error sincronizando trending ${timeWindow}:`, error);
    }
  }

  // Sincronizar contenido popular
  private async syncPopularContent() {
    try {
      const [popularMovies, popularTV, popularMoviesES, popularTVES] = await Promise.all([
        this.fetchData('/movie/popular?page=1', false),
        this.fetchData('/tv/popular?page=1', false),
        this.fetchData('/movie/popular?language=es-ES&page=1&region=ES', false),
        this.fetchData('/tv/popular?language=es-ES&page=1&region=ES', false)
      ]);

      const movies = this.removeDuplicates([...popularMovies.results, ...popularMoviesES.results]);
      const tvShows = this.removeDuplicates([...popularTV.results, ...popularTVES.results]);

      localStorage.setItem('popular_movies_fresh', JSON.stringify({
        content: contentFilterService.filterContent(movies),
        lastUpdate: new Date().toISOString()
      }));

      localStorage.setItem('popular_tv_fresh', JSON.stringify({
        content: contentFilterService.filterContent(tvShows),
        lastUpdate: new Date().toISOString()
      }));

      console.log(`✅ Sincronizado contenido popular: ${movies.length} películas, ${tvShows.length} series`);
    } catch (error) {
      console.error('❌ Error sincronizando contenido popular:', error);
    }
  }

  // Sincronizar estrenos actuales y contenido en emisión
  private async syncCurrentReleases() {
    try {
      const [nowPlaying, airingToday, onTheAir] = await Promise.all([
        this.fetchData('/movie/now_playing?page=1', false),
        this.fetchData('/tv/airing_today?page=1', false),
        this.fetchData('/tv/on_the_air?page=1', false)
      ]);

      localStorage.setItem('now_playing_fresh', JSON.stringify({
        content: contentFilterService.filterContent(nowPlaying.results),
        lastUpdate: new Date().toISOString()
      }));

      localStorage.setItem('airing_today_fresh', JSON.stringify({
        content: contentFilterService.filterContent(airingToday.results),
        lastUpdate: new Date().toISOString()
      }));

      localStorage.setItem('on_the_air_fresh', JSON.stringify({
        content: contentFilterService.filterContent(onTheAir.results),
        lastUpdate: new Date().toISOString()
      }));

      console.log('✅ Sincronizado contenido actual: En cines, Al aire hoy, En emisión');
    } catch (error) {
      console.error('❌ Error sincronizando contenido actual:', error);
    }
  }

  // Sincronizar contenido mejor valorado
  private async syncTopRatedContent() {
    try {
      const [topRatedMovies, topRatedTV] = await Promise.all([
        this.fetchData('/movie/top_rated?page=1', false),
        this.fetchData('/tv/top_rated?page=1', false)
      ]);

      localStorage.setItem('top_rated_movies_fresh', JSON.stringify({
        content: contentFilterService.filterContent(topRatedMovies.results),
        lastUpdate: new Date().toISOString()
      }));

      localStorage.setItem('top_rated_tv_fresh', JSON.stringify({
        content: contentFilterService.filterContent(topRatedTV.results),
        lastUpdate: new Date().toISOString()
      }));

      console.log('✅ Sincronizado contenido mejor valorado');
    } catch (error) {
      console.error('❌ Error sincronizando contenido mejor valorado:', error);
    }
  }

  // Sincronizar próximos estrenos
  private async syncUpcomingContent() {
    try {
      const upcoming = await this.fetchData('/movie/upcoming?page=1', false);

      localStorage.setItem('upcoming_movies_fresh', JSON.stringify({
        content: contentFilterService.filterContent(upcoming.results),
        lastUpdate: new Date().toISOString()
      }));

      console.log('✅ Sincronizado próximos estrenos');
    } catch (error) {
      console.error('❌ Error sincronizando próximos estrenos:', error);
    }
  }

  // Sincronizar contenido de anime desde múltiples fuentes
  private async syncAnimeContent() {
    try {
      const [japaneseAnime, animationGenre, koreanAnimation, chineseAnimation] = await Promise.all([
        this.fetchData('/discover/tv?with_origin_country=JP&with_genres=16&language=es-ES&page=1&sort_by=popularity.desc', false),
        this.fetchData('/discover/tv?with_genres=16&language=es-ES&page=1&sort_by=popularity.desc', false),
        this.fetchData('/discover/tv?with_origin_country=KR&with_genres=16&language=es-ES&page=1&sort_by=popularity.desc', false),
        this.fetchData('/discover/tv?with_origin_country=CN&with_genres=16&language=es-ES&page=1&sort_by=popularity.desc', false)
      ]);

      const combinedAnime = this.removeDuplicates([
        ...japaneseAnime.results,
        ...animationGenre.results,
        ...koreanAnimation.results,
        ...chineseAnimation.results
      ]);

      localStorage.setItem('anime_content_fresh', JSON.stringify({
        content: contentFilterService.filterContent(combinedAnime),
        lastUpdate: new Date().toISOString()
      }));

      console.log(`✅ Sincronizado contenido de anime: ${combinedAnime.length} elementos`);
    } catch (error) {
      console.error('❌ Error sincronizando contenido de anime:', error);
    }
  }

  // Sincronizar documentales y contenido animado
  private async syncDocumentariesAndAnimated() {
    try {
      const [documentaries, animatedMovies, animatedTV] = await Promise.all([
        this.fetchData('/discover/movie?with_genres=99&language=es-ES&page=1&sort_by=popularity.desc', false),
        this.fetchData('/discover/movie?with_genres=16&language=es-ES&page=1&sort_by=popularity.desc', false),
        this.fetchData('/discover/tv?with_genres=16&language=es-ES&page=1&sort_by=popularity.desc', false)
      ]);

      localStorage.setItem('documentaries_fresh', JSON.stringify({
        content: contentFilterService.filterContent(documentaries.results),
        lastUpdate: new Date().toISOString()
      }));

      localStorage.setItem('animated_content_fresh', JSON.stringify({
        content: contentFilterService.filterContent([...animatedMovies.results, ...animatedTV.results]),
        lastUpdate: new Date().toISOString()
      }));

      console.log('✅ Sincronizado documentales y contenido animado');
    } catch (error) {
      console.error('❌ Error sincronizando documentales y animado:', error);
    }
  }

  // Sincronizar contenido en cines y en televisión
  private async syncInTheatersAndOnTV() {
    try {
      const [inTheaters, onTV, rentals] = await Promise.all([
        this.fetchData('/movie/now_playing?page=1', false),
        this.fetchData('/tv/on_the_air?page=1', false),
        this.fetchData('/discover/movie?with_release_type=3&language=es-ES&page=1&sort_by=popularity.desc', false)
      ]);

      localStorage.setItem('in_theaters_fresh', JSON.stringify({
        content: contentFilterService.filterContent(inTheaters.results),
        lastUpdate: new Date().toISOString()
      }));

      localStorage.setItem('on_tv_fresh', JSON.stringify({
        content: contentFilterService.filterContent(onTV.results),
        lastUpdate: new Date().toISOString()
      }));

      localStorage.setItem('rentals_fresh', JSON.stringify({
        content: contentFilterService.filterContent(rentals.results),
        lastUpdate: new Date().toISOString()
      }));

      console.log('✅ Sincronizado contenido en cines, TV y alquileres');
    } catch (error) {
      console.error('❌ Error sincronizando contenido en cines y TV:', error);
    }
  }

  // Sincronizar videos para todo el contenido popular
  private async syncVideosForAllContent() {
    try {
      // Obtener IDs de contenido popular para sincronizar videos
      const contentSources = [
        'trending_day_fresh',
        'trending_week_fresh',
        'popular_movies_fresh',
        'popular_tv_fresh',
        'now_playing_fresh',
        'airing_today_fresh',
        'anime_content_fresh'
      ];

      const allContentIds: { id: number; type: 'movie' | 'tv' }[] = [];

      contentSources.forEach(source => {
        try {
          const cached = localStorage.getItem(source);
          if (cached) {
            const { content } = JSON.parse(cached);
            content.slice(0, 10).forEach((item: any) => {
              const type = 'title' in item ? 'movie' : 'tv';
              allContentIds.push({ id: item.id, type });
            });
          }
        } catch (error) {
          console.warn(`Error loading content from ${source}:`, error);
        }
      });

      // Eliminar duplicados
      const uniqueContentIds = allContentIds.filter((item, index, self) => 
        index === self.findIndex(t => t.id === item.id && t.type === item.type)
      );

      // Obtener videos en lotes para mejor rendimiento
      const videoMap = await this.batchFetchVideos(uniqueContentIds.slice(0, 50));
      
      // Almacenar videos
      const videoData: { [key: string]: any[] } = {};
      videoMap.forEach((videos, key) => {
        videoData[key] = videos;
      });

      localStorage.setItem('content_videos_fresh', JSON.stringify({
        videos: videoData,
        lastUpdate: new Date().toISOString()
      }));

      console.log(`✅ Sincronizados videos para ${uniqueContentIds.length} elementos de contenido`);
    } catch (error) {
      console.error('❌ Error sincronizando videos:', error);
    }
  }

  // Limpiar cachés expirados
  private clearExpiredCaches() {
    const keys = Object.keys(localStorage);
    const now = Date.now();

    keys.forEach(key => {
      if (key.includes('_fresh') || key.includes('trending') || key.includes('popular')) {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const { lastUpdate } = JSON.parse(cached);
            const age = now - new Date(lastUpdate).getTime();
            
            // Limpiar cachés de más de 6 horas
            if (age > 6 * 60 * 60 * 1000) {
              localStorage.removeItem(key);
              console.log(`🗑️ Cache expirado eliminado: ${key}`);
            }
          }
        } catch (error) {
          // Si hay error parseando, eliminar el cache corrupto
          localStorage.removeItem(key);
        }
      }
    });
  }

  private async fetchData<T>(endpoint: string, useCache: boolean = true): Promise<T> {
    // Para contenido fresco, usar caché más corto
    if (endpoint.includes('/popular') || endpoint.includes('/trending') || endpoint.includes('/now_playing')) {
      return this.fetchWithFreshCache<T>(endpoint, useCache);
    }
    return apiService.fetchWithCache<T>(endpoint, useCache);
  }

  private async fetchWithFreshCache<T>(endpoint: string, useCache: boolean = true): Promise<T> {
    const cacheKey = `fresh_${endpoint}`;
    
    if (useCache) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          const isExpired = Date.now() - timestamp > this.FRESH_CONTENT_CACHE_DURATION;
          
          if (!isExpired) {
            return data;
          }
        } catch (error) {
          localStorage.removeItem(cacheKey);
        }
      }
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, API_OPTIONS);
      
      if (!response.ok) {
        if (response.status === 404 && endpoint.includes('/videos')) {
          console.warn(`Videos no encontrados para: ${endpoint}`);
          return { results: [] } as T;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (useCache) {
        localStorage.setItem(cacheKey, JSON.stringify({
          data,
          timestamp: Date.now()
        }));
      }
      
      return data;
    } catch (error) {
      console.error(`Error de API para ${endpoint}:`, error);
      
      if (endpoint.includes('/videos')) {
        return { results: [] } as T;
      }
      
      // Intentar usar caché expirado si está disponible
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const { data } = JSON.parse(cached);
          console.warn(`Usando caché expirado para ${endpoint}`);
          return data;
        } catch (parseError) {
          localStorage.removeItem(cacheKey);
        }
      }
      
      throw error;
    }
  }

  // Obtener videos con fallback mejorado
  private async getVideosWithFallback(endpoint: string): Promise<{ results: Video[] }> {
    try {
      // Intentar español primero
      try {
        const spanishVideos = await this.fetchData<{ results: Video[] }>(`${endpoint}?language=es-ES`);
        
        if (spanishVideos.results && spanishVideos.results.length > 0) {
          const spanishTrailers = spanishVideos.results.filter(
            video => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
          );
          
          if (spanishTrailers.length === 0) {
            // Si no hay trailers en español, combinar con inglés
            try {
              const englishVideos = await this.fetchData<{ results: Video[] }>(`${endpoint}?language=en-US`);
              const englishTrailers = englishVideos.results.filter(
                video => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
              );
              
              return {
                results: [...spanishVideos.results, ...englishTrailers]
              };
            } catch (englishError) {
              return spanishVideos;
            }
          }
          
          return spanishVideos;
        }
      } catch (spanishError) {
        console.warn('Videos en español no disponibles, intentando inglés');
      }
      
      // Fallback a inglés
      const englishVideos = await this.fetchData<{ results: Video[] }>(`${endpoint}?language=en-US`);
      return englishVideos;
    } catch (error) {
      console.error('Error obteniendo videos:', error);
      return { results: [] };
    }
  }

  // MÉTODOS PÚBLICOS PARA LA APLICACIÓN

  // Películas
  async getPopularMovies(page: number = 1): Promise<APIResponse<Movie>> {
    // Intentar usar contenido sincronizado primero
    if (page === 1) {
      const cached = localStorage.getItem('popular_movies_fresh');
      if (cached) {
        try {
          const { content, lastUpdate } = JSON.parse(cached);
          const age = Date.now() - new Date(lastUpdate).getTime();
          if (age < this.FRESH_CONTENT_CACHE_DURATION) {
            return {
              page: 1,
              results: content,
              total_pages: 100,
              total_results: content.length
            };
          }
        } catch (error) {
          console.error('Error usando caché de películas populares:', error);
        }
      }
    }

    // Fallback a API en tiempo real
    const [spanishResults, englishResults] = await Promise.all([
      this.fetchData(`/movie/popular?language=es-ES&page=${page}&region=ES`, page === 1),
      this.fetchData(`/movie/popular?language=en-US&page=${page}&region=US`, page === 1)
    ]);
    
    const combinedResults = [
      ...spanishResults.results,
      ...englishResults.results.filter(movie => 
        !spanishResults.results.some(spanishMovie => spanishMovie.id === movie.id)
      )
    ];
    
    return {
      ...spanishResults,
      results: contentFilterService.filterContent(this.removeDuplicates(combinedResults))
    };
  }

  async getTopRatedMovies(page: number = 1): Promise<APIResponse<Movie>> {
    if (page === 1) {
      const cached = localStorage.getItem('top_rated_movies_fresh');
      if (cached) {
        try {
          const { content, lastUpdate } = JSON.parse(cached);
          const age = Date.now() - new Date(lastUpdate).getTime();
          if (age < this.FRESH_CONTENT_CACHE_DURATION) {
            return {
              page: 1,
              results: content,
              total_pages: 100,
              total_results: content.length
            };
          }
        } catch (error) {
          console.error('Error usando caché de películas mejor valoradas:', error);
        }
      }
    }

    const [spanishResults, englishResults] = await Promise.all([
      this.fetchData(`/movie/top_rated?language=es-ES&page=${page}&region=ES`, page === 1),
      this.fetchData(`/movie/top_rated?language=en-US&page=${page}&region=US`, page === 1)
    ]);
    
    const combinedResults = [
      ...spanishResults.results,
      ...englishResults.results.filter(movie => 
        !spanishResults.results.some(spanishMovie => spanishMovie.id === movie.id)
      )
    ];
    
    return {
      ...spanishResults,
      results: contentFilterService.filterContent(this.removeDuplicates(combinedResults))
    };
  }

  async getUpcomingMovies(page: number = 1): Promise<APIResponse<Movie>> {
    if (page === 1) {
      const cached = localStorage.getItem('upcoming_movies_fresh');
      if (cached) {
        try {
          const { content, lastUpdate } = JSON.parse(cached);
          const age = Date.now() - new Date(lastUpdate).getTime();
          if (age < this.FRESH_CONTENT_CACHE_DURATION) {
            return {
              page: 1,
              results: content,
              total_pages: 100,
              total_results: content.length
            };
          }
        } catch (error) {
          console.error('Error usando caché de próximos estrenos:', error);
        }
      }
    }

    const [spanishResults, englishResults, nowPlayingResults] = await Promise.all([
      this.fetchData(`/movie/upcoming?language=es-ES&page=${page}&region=ES`, page === 1),
      this.fetchData(`/movie/upcoming?language=en-US&page=${page}&region=US`, page === 1),
      this.fetchData(`/movie/now_playing?language=es-ES&page=${page}&region=ES`, page === 1)
    ]);
    
    const combinedResults = [
      ...spanishResults.results,
      ...englishResults.results.filter(movie => 
        !spanishResults.results.some(spanishMovie => spanishMovie.id === movie.id)
      ),
      ...nowPlayingResults.results.filter(movie => 
        !spanishResults.results.some(spanishMovie => spanishMovie.id === movie.id) &&
        !englishResults.results.some(englishMovie => englishMovie.id === movie.id)
      )
    ];
    
    return {
      ...spanishResults,
      results: contentFilterService.filterContent(this.removeDuplicates(combinedResults))
    };
  }

  async getNowPlayingMovies(page: number = 1): Promise<APIResponse<Movie>> {
    if (page === 1) {
      const cached = localStorage.getItem('now_playing_fresh');
      if (cached) {
        try {
          const { content, lastUpdate } = JSON.parse(cached);
          const age = Date.now() - new Date(lastUpdate).getTime();
          if (age < this.FRESH_CONTENT_CACHE_DURATION) {
            return {
              page: 1,
              results: content,
              total_pages: 100,
              total_results: content.length
            };
          }
        } catch (error) {
          console.error('Error usando caché de películas en cartelera:', error);
        }
      }
    }

    const [spanishResults, englishResults] = await Promise.all([
      this.fetchData(`/movie/now_playing?language=es-ES&page=${page}&region=ES`, page === 1),
      this.fetchData(`/movie/now_playing?language=en-US&page=${page}&region=US`, page === 1)
    ]);
    
    const combinedResults = [
      ...spanishResults.results,
      ...englishResults.results.filter(movie => 
        !spanishResults.results.some(spanishMovie => spanishMovie.id === movie.id)
      )
    ];
    
    return {
      ...spanishResults,
      results: contentFilterService.filterContent(this.removeDuplicates(combinedResults))
    };
  }

  // Series de TV
  async getPopularTVShows(page: number = 1): Promise<APIResponse<TVShow>> {
    if (page === 1) {
      const cached = localStorage.getItem('popular_tv_fresh');
      if (cached) {
        try {
          const { content, lastUpdate } = JSON.parse(cached);
          const age = Date.now() - new Date(lastUpdate).getTime();
          if (age < this.FRESH_CONTENT_CACHE_DURATION) {
            return {
              page: 1,
              results: content,
              total_pages: 100,
              total_results: content.length
            };
          }
        } catch (error) {
          console.error('Error usando caché de series populares:', error);
        }
      }
    }

    const [spanishResults, englishResults, airingTodayResults] = await Promise.all([
      this.fetchData(`/tv/popular?language=es-ES&page=${page}&region=ES`, page === 1),
      this.fetchData(`/tv/popular?language=en-US&page=${page}&region=US`, page === 1),
      this.fetchData(`/tv/airing_today?language=es-ES&page=${page}&region=ES`, page === 1)
    ]);
    
    const combinedResults = [
      ...spanishResults.results,
      ...englishResults.results.filter(show => 
        !spanishResults.results.some(spanishShow => spanishShow.id === show.id)
      ),
      ...airingTodayResults.results.filter(show => 
        !spanishResults.results.some(spanishShow => spanishShow.id === show.id) &&
        !englishResults.results.some(englishShow => englishShow.id === show.id)
      )
    ];
    
    return {
      ...spanishResults,
      results: contentFilterService.filterContent(this.removeDuplicates(combinedResults))
    };
  }

  async getTopRatedTVShows(page: number = 1): Promise<APIResponse<TVShow>> {
    const [spanishResults, englishResults] = await Promise.all([
      this.fetchData(`/tv/top_rated?language=es-ES&page=${page}&region=ES`, page === 1),
      this.fetchData(`/tv/top_rated?language=en-US&page=${page}&region=US`, page === 1)
    ]);
    
    const combinedResults = [
      ...spanishResults.results,
      ...englishResults.results.filter(show => 
        !spanishResults.results.some(spanishShow => spanishShow.id === show.id)
      )
    ];
    
    return {
      ...spanishResults,
      results: contentFilterService.filterContent(this.removeDuplicates(combinedResults))
    };
  }

  async getAiringTodayTVShows(page: number = 1): Promise<APIResponse<TVShow>> {
    if (page === 1) {
      const cached = localStorage.getItem('airing_today_fresh');
      if (cached) {
        try {
          const { content, lastUpdate } = JSON.parse(cached);
          const age = Date.now() - new Date(lastUpdate).getTime();
          if (age < this.FRESH_CONTENT_CACHE_DURATION) {
            return {
              page: 1,
              results: content,
              total_pages: 100,
              total_results: content.length
            };
          }
        } catch (error) {
          console.error('Error usando caché de series al aire hoy:', error);
        }
      }
    }

    const [spanishResults, englishResults] = await Promise.all([
      this.fetchData(`/tv/airing_today?language=es-ES&page=${page}&region=ES`, page === 1),
      this.fetchData(`/tv/airing_today?language=en-US&page=${page}&region=US`, page === 1)
    ]);
    
    const combinedResults = [
      ...spanishResults.results,
      ...englishResults.results.filter(show => 
        !spanishResults.results.some(spanishShow => spanishShow.id === show.id)
      )
    ];
    
    return {
      ...spanishResults,
      results: contentFilterService.filterContent(this.removeDuplicates(combinedResults))
    };
  }

  async getOnTheAirTVShows(page: number = 1): Promise<APIResponse<TVShow>> {
    if (page === 1) {
      const cached = localStorage.getItem('on_the_air_fresh');
      if (cached) {
        try {
          const { content, lastUpdate } = JSON.parse(cached);
          const age = Date.now() - new Date(lastUpdate).getTime();
          if (age < this.FRESH_CONTENT_CACHE_DURATION) {
            return {
              page: 1,
              results: content,
              total_pages: 100,
              total_results: content.length
            };
          }
        } catch (error) {
          console.error('Error usando caché de series en emisión:', error);
        }
      }
    }

    const [spanishResults, englishResults] = await Promise.all([
      this.fetchData(`/tv/on_the_air?language=es-ES&page=${page}&region=ES`, page === 1),
      this.fetchData(`/tv/on_the_air?language=en-US&page=${page}&region=US`, page === 1)
    ]);
    
    const combinedResults = [
      ...spanishResults.results,
      ...englishResults.results.filter(show => 
        !spanishResults.results.some(spanishShow => spanishShow.id === show.id)
      )
    ];
    
    return {
      ...spanishResults,
      results: contentFilterService.filterContent(this.removeDuplicates(combinedResults))
    };
  }

  // Anime mejorado con múltiples fuentes
  async getAnimeFromMultipleSources(page: number = 1): Promise<APIResponse<TVShow>> {
    if (page === 1) {
      const cached = localStorage.getItem('anime_content_fresh');
      if (cached) {
        try {
          const { content, lastUpdate } = JSON.parse(cached);
          const age = Date.now() - new Date(lastUpdate).getTime();
          if (age < this.FRESH_CONTENT_CACHE_DURATION) {
            return {
              page: 1,
              results: content,
              total_pages: 100,
              total_results: content.length
            };
          }
        } catch (error) {
          console.error('Error usando caché de anime:', error);
        }
      }
    }

    try {
      const [japaneseAnime, animationGenre, koreanAnimation, chineseAnimation] = await Promise.all([
        this.fetchData(`/discover/tv?with_origin_country=JP&with_genres=16&language=es-ES&page=${page}&sort_by=popularity.desc&include_adult=false`, page === 1),
        this.fetchData(`/discover/tv?with_genres=16&language=es-ES&page=${page}&sort_by=popularity.desc&include_adult=false`, page === 1),
        this.fetchData(`/discover/tv?with_origin_country=KR&with_genres=16&language=es-ES&page=${page}&sort_by=popularity.desc&include_adult=false`, page === 1),
        this.fetchData(`/discover/tv?with_origin_country=CN&with_genres=16&language=es-ES&page=${page}&sort_by=popularity.desc&include_adult=false`, page === 1)
      ]);

      const combinedResults = [
        ...japaneseAnime.results,
        ...animationGenre.results.filter(item => 
          !japaneseAnime.results.some(jp => jp.id === item.id)
        ),
        ...koreanAnimation.results.filter(item => 
          !japaneseAnime.results.some(jp => jp.id === item.id) &&
          !animationGenre.results.some(an => an.id === item.id)
        ),
        ...chineseAnimation.results.filter(item => 
          !japaneseAnime.results.some(jp => jp.id === item.id) &&
          !animationGenre.results.some(an => an.id === item.id) &&
          !koreanAnimation.results.some(kr => kr.id === item.id)
        )
      ];

      return {
        ...japaneseAnime,
        results: contentFilterService.filterContent(this.removeDuplicates(combinedResults))
      };
    } catch (error) {
      console.error('Error obteniendo anime desde múltiples fuentes:', error);
      return this.getPopularAnime(page);
    }
  }

  async getPopularAnime(page: number = 1): Promise<APIResponse<TVShow>> {
    return this.fetchData(`/discover/tv?with_origin_country=JP&with_genres=16&language=es-ES&page=${page}&sort_by=popularity.desc&include_adult=false`, page === 1);
  }

  async getTopRatedAnime(page: number = 1): Promise<APIResponse<TVShow>> {
    return this.fetchData(`/discover/tv?with_origin_country=JP&with_genres=16&language=es-ES&page=${page}&sort_by=vote_average.desc&vote_count.gte=100&include_adult=false`, page === 1);
  }

  // Contenido en tendencia con sincronización automática
  async getTrendingAll(timeWindow: 'day' | 'week' = 'day', page: number = 1): Promise<APIResponse<Movie | TVShow>> {
    if (page === 1) {
      const cached = localStorage.getItem(`trending_${timeWindow}_fresh`);
      if (cached) {
        try {
          const { content, lastUpdate } = JSON.parse(cached);
          const age = Date.now() - new Date(lastUpdate).getTime();
          if (age < this.FRESH_CONTENT_CACHE_DURATION) {
            return {
              page: 1,
              results: content,
              total_pages: 100,
              total_results: content.length
            };
          }
        } catch (error) {
          console.error(`Error usando caché de trending ${timeWindow}:`, error);
        }
      }
    }

    const [globalTrending, spanishTrending, usTrending] = await Promise.all([
      this.fetchData(`/trending/all/${timeWindow}?page=${page}`, page === 1),
      this.fetchData(`/trending/all/${timeWindow}?language=es-ES&page=${page}&region=ES`, page === 1),
      this.fetchData(`/trending/all/${timeWindow}?language=en-US&page=${page}&region=US`, page === 1)
    ]);
    
    const combinedResults = [
      ...globalTrending.results,
      ...spanishTrending.results.filter(item => 
        !globalTrending.results.some(globalItem => globalItem.id === item.id)
      ),
      ...usTrending.results.filter(item => 
        !globalTrending.results.some(globalItem => globalItem.id === item.id) &&
        !spanishTrending.results.some(spanishItem => spanishItem.id === item.id)
      )
    ];
    
    return {
      ...globalTrending,
      results: contentFilterService.filterContent(this.removeDuplicates(combinedResults))
    };
  }

  // Búsqueda mejorada
  async searchMovies(query: string, page: number = 1): Promise<APIResponse<Movie>> {
    const encodedQuery = encodeURIComponent(query);
    const [spanishResults, englishResults] = await Promise.all([
      this.fetchData(`/search/movie?query=${encodedQuery}&language=es-ES&page=${page}&include_adult=false`),
      this.fetchData(`/search/movie?query=${encodedQuery}&language=en-US&page=${page}&include_adult=false`)
    ]);
    
    const combinedResults = [
      ...spanishResults.results,
      ...englishResults.results.filter(movie => 
        !spanishResults.results.some(spanishMovie => spanishMovie.id === movie.id)
      )
    ];
    
    return {
      ...spanishResults,
      results: contentFilterService.filterContent(this.removeDuplicates(combinedResults))
    };
  }

  async searchTVShows(query: string, page: number = 1): Promise<APIResponse<TVShow>> {
    const encodedQuery = encodeURIComponent(query);
    const [spanishResults, englishResults] = await Promise.all([
      this.fetchData(`/search/tv?query=${encodedQuery}&language=es-ES&page=${page}&include_adult=false`),
      this.fetchData(`/search/tv?query=${encodedQuery}&language=en-US&page=${page}&include_adult=false`)
    ]);
    
    const combinedResults = [
      ...spanishResults.results,
      ...englishResults.results.filter(show => 
        !spanishResults.results.some(spanishShow => spanishShow.id === show.id)
      )
    ];
    
    return {
      ...spanishResults,
      results: contentFilterService.filterContent(this.removeDuplicates(combinedResults))
    };
  }

  async searchAnime(query: string, page: number = 1): Promise<APIResponse<TVShow>> {
    const encodedQuery = encodeURIComponent(query);
    return this.fetchData(`/search/tv?query=${encodedQuery}&language=es-ES&page=${page}&with_genres=16&with_origin_country=JP`);
  }

  async searchMulti(query: string, page: number = 1): Promise<APIResponse<Movie | TVShow>> {
    const encodedQuery = encodeURIComponent(query);
    const [spanishResults, englishResults, personResults] = await Promise.all([
      this.fetchData(`/search/multi?query=${encodedQuery}&language=es-ES&page=${page}&include_adult=false`),
      this.fetchData(`/search/multi?query=${encodedQuery}&language=en-US&page=${page}&include_adult=false`),
      this.fetchData(`/search/person?query=${encodedQuery}&language=es-ES&page=${page}&include_adult=false`)
    ]);
    
    let personContent: (Movie | TVShow)[] = [];
    if (personResults.results.length > 0) {
      personContent = personResults.results.flatMap(person => 
        person.known_for || []
      );
    }
    
    const combinedResults = [
      ...spanishResults.results,
      ...englishResults.results.filter(item => 
        !spanishResults.results.some(spanishItem => spanishItem.id === item.id)
      ),
      ...personContent.filter(item => 
        !spanishResults.results.some(spanishItem => spanishItem.id === item.id) &&
        !englishResults.results.some(englishItem => englishItem.id === item.id)
      )
    ];
    
    return {
      ...spanishResults,
      results: contentFilterService.filterContent(this.removeDuplicates(combinedResults))
    };
  }

  // Detalles de contenido
  async getMovieDetails(id: number): Promise<MovieDetails | null> {
    try {
      const spanishDetails = await this.fetchData<MovieDetails | null>(`/movie/${id}?language=es-ES&append_to_response=credits,videos,images`, true);
      if (spanishDetails) {
        return spanishDetails;
      }
    } catch (error) {
      console.warn(`Detalles en español no disponibles para película ${id}, intentando inglés`);
    }
    
    const englishDetails = await this.fetchData<MovieDetails | null>(`/movie/${id}?language=en-US&append_to_response=credits,videos,images`, true);
    return englishDetails;
  }

  async getTVShowDetails(id: number): Promise<TVShowDetails | null> {
    try {
      const spanishDetails = await this.fetchData<TVShowDetails | null>(`/tv/${id}?language=es-ES&append_to_response=credits,videos,images`, true);
      if (spanishDetails) {
        return spanishDetails;
      }
    } catch (error) {
      console.warn(`Detalles en español no disponibles para serie ${id}, intentando inglés`);
    }
    
    const englishDetails = await this.fetchData<TVShowDetails | null>(`/tv/${id}?language=en-US&append_to_response=credits,videos,images`, true);
    return englishDetails;
  }

  // Videos
  async getMovieVideos(id: number): Promise<{ results: Video[] }> {
    return this.getVideosWithFallback(`/movie/${id}/videos`);
  }

  async getTVShowVideos(id: number): Promise<{ results: Video[] }> {
    return this.getVideosWithFallback(`/tv/${id}/videos`);
  }

  // Créditos
  async getMovieCredits(id: number): Promise<Cast> {
    const credits = await this.fetchData<Cast | null>(`/movie/${id}/credits?language=es-ES`, true);
    return credits || { cast: [], crew: [] };
  }

  async getTVShowCredits(id: number): Promise<Cast> {
    const credits = await this.fetchData<Cast | null>(`/tv/${id}/credits?language=es-ES`, true);
    return credits || { cast: [], crew: [] };
  }

  // Géneros
  async getMovieGenres(): Promise<{ genres: Genre[] }> {
    return this.fetchData('/genre/movie/list?language=es-ES', true);
  }

  async getTVGenres(): Promise<{ genres: Genre[] }> {
    return this.fetchData('/genre/tv/list?language=es-ES', true);
  }

  // Contenido para hero carousel con sincronización automática
  async getHeroContent(): Promise<(Movie | TVShow)[]> {
    try {
      // Intentar usar contenido sincronizado primero
      const sources = ['trending_day_fresh', 'trending_week_fresh', 'popular_movies_fresh', 'popular_tv_fresh'];
      const cachedContent: (Movie | TVShow)[] = [];

      sources.forEach(source => {
        try {
          const cached = localStorage.getItem(source);
          if (cached) {
            const { content, lastUpdate } = JSON.parse(cached);
            const age = Date.now() - new Date(lastUpdate).getTime();
            if (age < this.FRESH_CONTENT_CACHE_DURATION) {
              cachedContent.push(...content.slice(0, 3));
            }
          }
        } catch (error) {
          console.warn(`Error cargando ${source}:`, error);
        }
      });

      if (cachedContent.length >= 8) {
        return this.removeDuplicates(cachedContent).slice(0, 12);
      }

      // Fallback a API en tiempo real
      const [trendingDay, trendingWeek, popularMovies, popularTV, nowPlayingMovies, airingTodayTV] = await Promise.all([
        this.getTrendingAll('day', 1),
        this.getTrendingAll('week', 1),
        this.getPopularMovies(1),
        this.getPopularTVShows(1),
        this.getNowPlayingMovies(1),
        this.getAiringTodayTVShows(1)
      ]);

      const combinedItems = [
        ...trendingDay.results.slice(0, 6),
        ...trendingWeek.results.slice(0, 4),
        ...nowPlayingMovies.results.slice(0, 3),
        ...airingTodayTV.results.slice(0, 3),
        ...popularMovies.results.slice(0, 2),
        ...popularTV.results.slice(0, 2)
      ];

      return contentFilterService.filterContent(this.removeDuplicates(combinedItems)).slice(0, 12);
    } catch (error) {
      console.error('Error obteniendo contenido hero:', error);
      return [];
    }
  }

  // Obtener videos en lotes para mejor rendimiento
  async batchFetchVideos(items: { id: number; type: 'movie' | 'tv' }[]): Promise<Map<string, Video[]>> {
    const videoMap = new Map<string, Video[]>();
    
    try {
      const videoPromises = items.map(async (item) => {
        const key = `${item.type}-${item.id}`;
        try {
          const videos = item.type === 'movie' 
            ? await this.getMovieVideos(item.id)
            : await this.getTVShowVideos(item.id);
          
          const trailers = videos.results.filter(
            video => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
          );
          
          return { key, videos: trailers };
        } catch (error) {
          console.warn(`Videos no disponibles para ${key}`);
          return { key, videos: [] };
        }
      });

      const results = await Promise.allSettled(videoPromises);
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          const { key, videos } = result.value;
          videoMap.set(key, videos);
        }
      });
    } catch (error) {
      console.error('Error en obtención de videos en lotes:', error);
    }
    
    return videoMap;
  }

  // Utilidades
  removeDuplicates<T extends { id: number }>(items: T[]): T[] {
    const seen = new Set<number>();
    return items.filter(item => {
      if (seen.has(item.id)) {
        return false;
      }
      seen.add(item.id);
      return true;
    });
  }

  // Forzar actualización completa de todo el contenido
  async forceRefreshAllContent(): Promise<void> {
    console.log('🔄 Forzando actualización completa de contenido...');
    
    // Limpiar todos los cachés
    this.clearCache();
    this.clearExpiredCaches();
    
    // Resetear timestamps de sincronización
    this.lastDailySync = null;
    this.lastWeeklySync = null;
    
    // Realizar sincronización completa
    await this.performAutoSync(true);
    
    console.log('✅ Actualización completa de contenido finalizada');
  }

  // Limpiar caché de API
  clearCache(): void {
    apiService.clearCache();
    
    // Limpiar cachés locales
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('fresh_') || key.includes('trending') || key.includes('popular')) {
        localStorage.removeItem(key);
      }
    });
  }

  // Obtener estadísticas de caché
  getCacheStats(): { size: number; items: { key: string; age: number }[] } {
    return {
      size: apiService.getCacheSize(),
      items: apiService.getCacheInfo()
    };
  }

  // Obtener estado de sincronización
  getSyncStatus(): { lastDaily: Date | null; lastWeekly: Date | null; nextSync: Date | null } {
    const nextSync = this.lastDailySync 
      ? new Date(this.lastDailySync.getTime() + this.DAILY_REFRESH_INTERVAL)
      : new Date();

    return {
      lastDaily: this.lastDailySync,
      lastWeekly: this.lastWeeklySync,
      nextSync
    };
  }

  // Destructor para limpiar intervalos
  destroy() {
    if (this.autoSyncInterval) {
      clearInterval(this.autoSyncInterval);
      this.autoSyncInterval = null;
    }
  }
}

export const tmdbService = new TMDBService();