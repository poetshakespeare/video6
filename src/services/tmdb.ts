import { BASE_URL, API_OPTIONS } from '../config/api';
import type { Movie, TVShow, MovieDetails, TVShowDetails, Video, APIResponse, Genre, Cast, CastMember } from '../types/movie';

class TMDBService {
  private async fetchData<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, API_OPTIONS);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Movies
  async getPopularMovies(page: number = 1): Promise<APIResponse<Movie>> {
    return this.fetchData(`/movie/popular?language=es-ES&page=${page}`);
  }

  async getTopRatedMovies(page: number = 1): Promise<APIResponse<Movie>> {
    return this.fetchData(`/movie/top_rated?language=es-ES&page=${page}`);
  }

  async getUpcomingMovies(page: number = 1): Promise<APIResponse<Movie>> {
    return this.fetchData(`/movie/upcoming?language=es-ES&page=${page}`);
  }

  async searchMovies(query: string, page: number = 1): Promise<APIResponse<Movie>> {
    const encodedQuery = encodeURIComponent(query);
    return this.fetchData(`/search/movie?query=${encodedQuery}&language=es-ES&page=${page}`);
  }

  async getMovieDetails(id: number): Promise<MovieDetails> {
    return this.fetchData(`/movie/${id}?language=es-ES`);
  }

  async getMovieVideos(id: number): Promise<{ results: Video[] }> {
    return this.fetchData(`/movie/${id}/videos?language=es-ES`);
  }

  async getMovieCredits(id: number): Promise<Cast> {
    return this.fetchData(`/movie/${id}/credits?language=es-ES`);
  }

  // TV Shows
  async getPopularTVShows(page: number = 1): Promise<APIResponse<TVShow>> {
    return this.fetchData(`/tv/popular?language=es-ES&page=${page}`);
  }

  async getTopRatedTVShows(page: number = 1): Promise<APIResponse<TVShow>> {
    return this.fetchData(`/tv/top_rated?language=es-ES&page=${page}`);
  }

  async searchTVShows(query: string, page: number = 1): Promise<APIResponse<TVShow>> {
    const encodedQuery = encodeURIComponent(query);
    return this.fetchData(`/search/tv?query=${encodedQuery}&language=es-ES&page=${page}`);
  }

  async getTVShowDetails(id: number): Promise<TVShowDetails> {
    return this.fetchData(`/tv/${id}?language=es-ES`);
  }

  async getTVShowVideos(id: number): Promise<{ results: Video[] }> {
    return this.fetchData(`/tv/${id}/videos?language=es-ES`);
  }

  async getTVShowCredits(id: number): Promise<Cast> {
    return this.fetchData(`/tv/${id}/credits?language=es-ES`);
  }

  // Anime (using discover with Japanese origin)
  async getPopularAnime(page: number = 1): Promise<APIResponse<TVShow>> {
    return this.fetchData(`/discover/tv?with_origin_country=JP&with_genres=16&language=es-ES&page=${page}&sort_by=popularity.desc&include_adult=false`);
  }

  async getTopRatedAnime(page: number = 1): Promise<APIResponse<TVShow>> {
    return this.fetchData(`/discover/tv?with_origin_country=JP&with_genres=16&language=es-ES&page=${page}&sort_by=vote_average.desc&vote_count.gte=100&include_adult=false`);
  }

  async searchAnime(query: string, page: number = 1): Promise<APIResponse<TVShow>> {
    const encodedQuery = encodeURIComponent(query);
    return this.fetchData(`/search/tv?query=${encodedQuery}&language=es-ES&page=${page}&with_genres=16&with_origin_country=JP`);
  }

  // Genres
  async getMovieGenres(): Promise<{ genres: Genre[] }> {
    return this.fetchData('/genre/movie/list?language=es-ES');
  }

  async getTVGenres(): Promise<{ genres: Genre[] }> {
    return this.fetchData('/genre/tv/list?language=es-ES');
  }

  // Multi search
  async searchMulti(query: string, page: number = 1): Promise<APIResponse<Movie | TVShow>> {
    const encodedQuery = encodeURIComponent(query);
    return this.fetchData(`/search/multi?query=${encodedQuery}&language=es-ES&page=${page}`);
  }

  // Trending content - synchronized with TMDB
  async getTrendingAll(timeWindow: 'day' | 'week' = 'day', page: number = 1): Promise<APIResponse<Movie | TVShow>> {
    return this.fetchData(`/trending/all/${timeWindow}?language=es-ES&page=${page}`);
  }

  async getTrendingMovies(timeWindow: 'day' | 'week' = 'day', page: number = 1): Promise<APIResponse<Movie>> {
    return this.fetchData(`/trending/movie/${timeWindow}?language=es-ES&page=${page}`);
  }

  async getTrendingTV(timeWindow: 'day' | 'week' = 'day', page: number = 1): Promise<APIResponse<TVShow>> {
    return this.fetchData(`/trending/tv/${timeWindow}?language=es-ES&page=${page}`);
  }

  // Utility method to remove duplicates from combined results
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

  // Get fresh trending content for hero carousel (no duplicates)
  async getHeroContent(): Promise<(Movie | TVShow)[]> {
    try {
      const [trendingDay, trendingWeek, popularMovies, popularTV] = await Promise.all([
        this.getTrendingAll('day', 1),
        this.getTrendingAll('week', 1),
        this.getPopularMovies(1),
        this.getPopularTVShows(1)
      ]);

      // Combine and prioritize trending content
      const combinedItems = [
        ...trendingDay.results.slice(0, 8),
        ...trendingWeek.results.slice(0, 4),
        ...popularMovies.results.slice(0, 3),
        ...popularTV.results.slice(0, 3)
      ];

      // Remove duplicates and return top items
      return this.removeDuplicates(combinedItems).slice(0, 10);
    } catch (error) {
      console.error('Error fetching hero content:', error);
      return [];
    }
  }
}

export const tmdbService = new TMDBService();