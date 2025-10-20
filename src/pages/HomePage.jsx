import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDebounce } from "react-use";
import MovieCard from "../components/MovieCard";
import Search from "../components/Search";
import Spinner from "../components/Spinner";
import { getTrendingMovies, updateSearchCount } from "../utils/appwrite";
import { fetchMovies } from "../utils/tmdb";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchItem, setDebouncedSearchItem] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Delay API calls until the user pauses typing
  useDebounce(() => setDebouncedSearchItem(searchTerm), 500, [searchTerm]);

  // Fetch the main movie list, optionally by search term
  const loadMovies = async (query = "") => {
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
  };

  const handleTrendingClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  // Pull aggregated trending data from Appwrite
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies ?? []);
    } catch (error) {
      console.log(`Error fetching trending movies: ${error}`);
    }
  };

  useEffect(() => {
    loadMovies(debouncedSearchItem);
  }, [debouncedSearchItem]);

  useEffect(() => {
    // Populate trending carousel as soon as the page mounts
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero2.png" className="w-[200px]" alt="Hero Banner" />
          <h1>Movie Finder</h1>
          <h2>
            Discover <span className="text-gradient">Stories</span> You’ll Love
            In Seconds
          </h2>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li
                  key={movie.$id}
                  onClick={() => {
                    handleTrendingClick(movie.movie_id);
                  }}
                  className="cursor-pointer"
                >
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
