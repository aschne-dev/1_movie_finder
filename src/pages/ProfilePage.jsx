import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import MovieCard from "../components/MovieCard";
import Spinner from "../components/Spinner";
import { useAuth } from "../utils/AuthContext";

export default function ProfilePage() {
  // STATE
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [favoriteList, setFavoriteList] = useState([]);

  const { user, fetchFavorites } = useAuth();
  const navigate = useNavigate();

  const loadFavorites = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const movies = await fetchFavorites();
      setFavoriteList(movies);
    } catch (error) {
      console.log(`Error fetching favorites: ${error}`);
      const message =
        error instanceof Error
          ? error.message
          : "Error fetching favorites. Please try again later.";
      setErrorMessage(message);
      setFavoriteList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // COMPORTEMENTS
  useEffect(() => {
    // Redirect away if a session already exists
    if (!user) {
      navigate("/");
    } else {
      loadFavorites();
    }
  }, [user, navigate, fetchFavorites]);

  // RENDER
  return (
    <div>
      <div className="pattern" />
      <div className="wrapper pt-20 text-white flex items-center">
        <section name="Profile">
          <h2 className="text-gradient">Your Profile</h2>
          <div className="mt-10 px-10">
            <ul className="space-y-4">
              <li>
                <p>Your Name :</p> {user.name}
              </li>
              <li>
                <p>Your Email Address:</p> {user.email}
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
          ) : (
            <ul>
              {favoriteList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </section>
      </div>
    </div>
  );
}
