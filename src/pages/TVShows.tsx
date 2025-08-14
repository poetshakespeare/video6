import React, { useState, useEffect } from 'react';
import { Tv, Filter } from 'lucide-react';
import { tmdbService } from '../services/tmdb';
import { MovieCard } from '../components/MovieCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import type { TVShow } from '../types/movie';

type TVCategory = 'popular' | 'top_rated';

export function TVShows() {
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<TVCategory>('popular');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const categoryTitles = {
    popular: 'Populares',
    top_rated: 'Mejor Valoradas'
  };

  const fetchTVShows = async (selectedCategory: TVCategory, pageNum: number, append: boolean = false) => {
    try {
      if (!append) setLoading(true);
      
      let response;
      switch (selectedCategory) {
        case 'top_rated':
          response = await tmdbService.getTopRatedTVShows(pageNum);
          break;
        default:
          response = await tmdbService.getPopularTVShows(pageNum);
      }

      if (append) {
        setTVShows(prev => [...prev, ...response.results]);
      } else {
        setTVShows(response.results);
      }
      
      setHasMore(pageNum < response.total_pages);
    } catch (err) {
      setError('Error al cargar las series. Por favor, intenta de nuevo.');
      console.error('Error fetching TV shows:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchTVShows(category, 1, false);
  }, [category]);

  const handleCategoryChange = (newCategory: TVCategory) => {
    setCategory(newCategory);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTVShows(category, nextPage, true);
  };

  if (loading && tvShows.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && tvShows.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Tv className="mr-3 h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Series {categoryTitles[category]}
            </h1>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-1 bg-white rounded-lg p-1 shadow-sm w-fit">
            <Filter className="h-4 w-4 text-gray-500 ml-2" />
            {Object.entries(categoryTitles).map(([key, title]) => (
              <button
                key={key}
                onClick={() => handleCategoryChange(key as TVCategory)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  category === key
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                {title}
              </button>
            ))}
          </div>
        </div>

        {/* TV Shows Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
          {tvShows.map((show) => (
            <MovieCard key={`${show.id}-${category}`} item={show} type="tv" />
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Cargando...' : 'Cargar más series'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}