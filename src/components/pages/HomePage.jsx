import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "../../utils/appwrite";
import { fetchMovies } from "../../utils/tmdb";
import MovieCard from "../MovieCard";
import Search from "../Search";
import Spinner from "../Spinner";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchItem, setDebouncedSearchItem] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Delay API calls until the user pauses typing
  useDebounce(() => setDebouncedSearchItem(searchTerm), 500, [searchTerm]);

  // Fetch the main movie list, optionally by search term
  const loadMovies = useCallback(async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const results = await fetchMovies(query);
      setMovieList(results);

      if (query && results.length > 0) {
        await updateSearchCount(query, results[0]);
      }
    } catch (error) {
      console.log(`Error fetching movies: ${error}`);
      const message =
        error instanceof Error
          ? error.message
          : "Error fetching movies. Please try again later.";
      setErrorMessage(message);
      setMovieList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Pull aggregated trending data from Appwrite
  const loadTrendingMovies = useCallback(async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies ?? []);
    } catch (error) {
      console.log(`Error fetching trending movies: ${error}`);
    }
  }, []);

  useEffect(() => {
    loadMovies(debouncedSearchItem);
  }, [debouncedSearchItem, loadMovies]);

  useEffect(() => {
    // Populate trending carousel as soon as the page mounts
    loadTrendingMovies();
  }, [loadTrendingMovies]);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without The Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </section>
      </div>
    </main>
  );
}
