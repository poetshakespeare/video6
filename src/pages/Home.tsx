import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, TrendingUp, Star, Tv } from 'lucide-react';
import { tmdbService } from '../services/tmdb';
import { MovieCard } from '../components/MovieCard';
import { HeroCarousel } from '../components/HeroCarousel';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import type { Movie, TVShow } from '../types/movie';

export function Home() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<TVShow[]>([]);
  const [popularAnime, setPopularAnime] = useState<TVShow[]>([]);
  const [heroItems, setHeroItems] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [moviesRes, tvRes, animeRes] = await Promise.all([
          tmdbService.getPopularMovies(1),
          tmdbService.getPopularTVShows(1),
          tmdbService.getPopularAnime(1)
        ]);

        setPopularMovies(moviesRes.results.slice(0, 8));
        setPopularTVShows(tvRes.results.slice(0, 8));
        setPopularAnime(animeRes.results.slice(0, 8));
        
        // Combinar los mejores elementos para el carrusel
        const topMovies = moviesRes.results.slice(0, 3);
        const topTVShows = tvRes.results.slice(0, 3);
        const topAnime = animeRes.results.slice(0, 2);
        setHeroItems([...topMovies, ...topTVShows, ...topAnime]);
      } catch (err) {
        setError('Error al cargar el contenido. Por favor, intenta de nuevo.');
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel */}
      <HeroCarousel items={heroItems} />
      
      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-blue-900 via-purple-900 to-pink-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Descubre el Mundo del
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400">
              {' '}Entretenimiento
            </span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Explora miles de películas, series y anime. Encuentra tus favoritos y agrégalos a tu carrito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/movies"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Explorar Películas
            </Link>
            <Link
              to="/tv"
              className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center"
            >
              <Tv className="mr-2 h-5 w-5" />
              Ver Series
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Popular Movies */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Star className="mr-2 h-6 w-6 text-yellow-500" />
              Películas Populares
            </h2>
            <Link
              to="/movies"
              className="text-blue-600 hover:text-blue-800 flex items-center font-medium"
            >
              Ver todas
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularMovies.map((movie) => (
              <MovieCard key={movie.id} item={movie} type="movie" />
            ))}
          </div>
        </section>

        {/* Popular TV Shows */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Tv className="mr-2 h-6 w-6 text-blue-500" />
              Series Populares
            </h2>
            <Link
              to="/tv"
              className="text-blue-600 hover:text-blue-800 flex items-center font-medium"
            >
              Ver todas
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularTVShows.map((show) => (
              <MovieCard key={show.id} item={show} type="tv" />
            ))}
          </div>
        </section>

        {/* Popular Anime */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="mr-2 text-2xl">🎌</span>
              Anime Popular
            </h2>
            <Link
              to="/anime"
              className="text-blue-600 hover:text-blue-800 flex items-center font-medium"
            >
              Ver todos
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularAnime.map((anime) => (
              <MovieCard key={anime.id} item={anime} type="tv" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}