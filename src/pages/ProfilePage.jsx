import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import Spinner from "../components/Spinner";
import { useAuth } from "../utils/AuthContext";

export default function ProfilePage() {
  // STATE
  // Local loading handles the fetchFavorites lifecycle separately from auth loading
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { user, favoriteMovies, fetchFavorites, loading } = useAuth();

  // COMPORTEMENTS
  /**
   * Pull the latest favorites from Appwrite/TMDB, displaying errors inline when needed.
   */
  const loadFavorites = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      await fetchFavorites();
    } catch (error) {
      console.log(`Error fetching favorites: ${error}`);
      const message =
        error instanceof Error
          ? error.message
          : "Error fetching favorites. Please try again later.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Wait for auth status to resolve before fetching favorites
    if (loading) {
      return;
    }

    if (user) {
      loadFavorites();
    }
  }, [user, loading]);

  // RENDER
  if (loading) {
    return (
      <div>
        <div className="pattern" />
        <div className="wrapper pt-20 text-white flex items-center justify-center">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <div className="pattern" />
      <div className="wrapper pt-20 text-white flex items-center">
        <section name="Profile">
          <h2 className="text-gradient">Your Profile</h2>
          <div className="mt-10 px-10">
            <ul className="space-y-4">
              <li>
                <p className="text-gray-400">Your Name :</p> {user.name}
              </li>
              <li>
                <p className="text-gray-400">Your Email Address:</p>{" "}
                {user.email}
              </li>
            </ul>
          </div>
        </section>

        <section className="all-movies mt-20">
          <h2 className="text-gradient">Your Favorites Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : favoriteMovies.length > 0 ? (
            <ul>
              {favoriteMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-center">No favorites yet.</p>
          )}

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </section>
      </div>
    </div>
  );
}
