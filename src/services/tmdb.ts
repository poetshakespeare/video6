import { BASE_URL, API_OPTIONS } from '../config/api';
import type { Movie, TVShow, MovieDetails, TVShowDetails, Video, APIResponse, Genre } from '../types/movie';

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
}

export const tmdbService = new TMDBService();