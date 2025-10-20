import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Spinner from "../components/Spinner";
import { getMovieDetail } from "../utils/tmdb";

export default function MovieDetailsPage() {
  // STATE
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // COMPORTEMENTS
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

  useEffect(() => {
    loadMovieDetails();
  }, [id]);

  // RENDER
  return (
    <div>
      <div className="pattern" />

      <div className="wrapper">
        <div className="movie-card">
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : movie ? (
            <div>
              {/* Titre */}
              <h1>{movie.title}</h1>

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
                    {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
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
      </div>
    </div>
  );
}
