import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getMovieDetail } from "../../utils/tmdb";
import Spinner from "../Spinner";

export default function MovieDetails() {
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
    }
  };

  useEffect(() => {
    loadMovieDetails();
  }, [id]);

  // RENDER
  return (
    <div>
      <div className="pattern" />

      <div className="wrapper pt-20">
        {isLoading ? (
          <Spinner />
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : movie ? (
          <div className="text-white">{movie.original_language}</div>
        ) : null}
      </div>
    </div>
  );
}
