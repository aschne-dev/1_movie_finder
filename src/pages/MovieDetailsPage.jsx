import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Spinner from "../components/Spinner";
import { getMovieDetail, getMovieRecommendations } from "../utils/tmdb";

export default function MovieDetailsPage() {
  // STATE
  const { id } = useParams();

  // Track detail payload, related titles, and request status indicators
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // COMPORTEMENTS
  // Request TMDB for the detailed record of the current movie id
  const loadMovieDetails = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const results = await getMovieDetail(id);
      setMovie(results);
      //console.log("results = " + results);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error fetching movie. Please try again later.";
      setErrorMessage(message);
      setMovie(null);
    } finally {
      setIsLoading(false);
      setErrorMessage("");
    }
  };

  // Fetch TMDB recommendations to populate the related section
  const loadMovieRecommendations = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const results = await getMovieRecommendations(id);
      setRecommendations(results);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error fetching recommendations. Please try again later.";
      setErrorMessage(message);
      setRecommendations([]);
    } finally {
      setIsLoading(false);
      setErrorMessage("");
    }
  };

  const handleTrendingClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  useEffect(() => {
    // Keep movie detail view in sync whenever the route parameter changes
    loadMovieDetails();
    loadMovieRecommendations();
  }, [id]);

  // RENDER
  return (
    <div>
      <div className="pattern" />

      <div className="wrapper movie-card pt-20">
        <section name="MovieDetail">
          <div>
            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : movie ? (
              <div>
                {/* Titre */}
                <h2 className="flex justify-center">{movie.title}</h2>

                {/* Backdrop */}
                <img
                  className="mt-5"
                  src={
                    movie.backdrop_path
                      ? `https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`
                      : "/no-movie.png"
                  }
                  alt={movie.title}
                />

                {/* Genres */}
                <ul className="rating justify-center mt-5">
                  {movie.genres.map((genre, index) => (
                    <li className="flex" key={index}>
                      {index > 0 && <span className="pe-1 text-white">•</span>}
                      <p>{genre.name}</p>
                    </li>
                  ))}
                </ul>

                {/* Production countries */}
                <ul className="rating justify-center mt-2">
                  {movie.production_countries.map((countrie, index) => (
                    <li className="flex" key={index}>
                      {index > 0 && <span className="pe-1 text-white">•</span>}
                      <p>{countrie.name}</p>
                    </li>
                  ))}
                </ul>

                {/* Vote, language, year*/}
                <div className="content justify-center">
                  <div className="rating">
                    <img src="../star.svg" alt="Star Icon" />

                    <p>
                      {movie.vote_average
                        ? movie.vote_average.toFixed(1)
                        : "N/A"}
                    </p>
                  </div>

                  {/* Language and release year stay visible even when rating is missing */}
                  <span>•</span>
                  <p className="lang">{movie.original_language}</p>

                  <span>•</span>
                  <p className="year">
                    {movie.release_date
                      ? movie.release_date.split("-")[0]
                      : "N/A"}
                  </p>
                </div>

                {/* Overview */}
                <div className="content text-white mt-10">{movie.overview}</div>
              </div>
            ) : null}
          </div>
        </section>

        {/* Recommendations */}
        {/* Reuse the trending layout so clicking pushes a new movie detail */}
        {recommendations.length > 0 && (
          <section className="trending">
            <h2 className="text-white">Recommendations</h2>
            <ul>
              {recommendations.map((movie, index) => (
                <li
                  key={movie.id}
                  onClick={() => {
                    handleTrendingClick(movie.id);
                  }}
                  className="cursor-pointer"
                >
                  <p>{index + 1}</p>
                  <img
                    className="mt-5"
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                        : "/no-movie.png"
                    }
                    alt={movie.title}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
