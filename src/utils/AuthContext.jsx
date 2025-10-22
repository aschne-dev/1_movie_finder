import { ID } from "appwrite";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Spinner from "../components/Spinner";
import {
  account,
  addAppwriteFavorite,
  fetchAppwriteFavorite,
  loadUserFavorites,
  removeAppwriteFavorite,
} from "./appwrite";
import { getMovieDetail } from "./tmdb";

// Central auth context exposes session state and helpers
// Top-level React context exposing auth session and favorite movie state
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // STATE
  const [loading, setLoading] = useState(true); // Tracks session restoration and mutations
  const [user, setUser] = useState(null); // Appwrite account details when logged in
  const [favoriteMovies, setFavoriteMovies] = useState([]); // Favorite movies hydrated with TMDB data
  const favoriteIds = useMemo(
    () => favoriteMovies.map((movie) => String(movie.id)),
    [favoriteMovies]
  );

  // COMPORTEMENTS
  /**
   * Query Appwrite to restore the current session and preload favorites.
   * Called on mount and after auth mutations to keep state consistent.
   */
  const checkUserStatus = async () => {
    try {
      // Check if a valid session cookie already exists
      const session = await account.getSession({ sessionId: "current" });

      if (session) {
        // Session is valid, hydrate user with full account details
        const accountDetails = await account.get();
        setUser(accountDetails);

        // Hydrate favorites by pulling IDs from Appwrite, then fetching TMDB details
        const userFavorites = await loadUserFavorites(accountDetails.$id);
        const movieIds = (userFavorites ?? [])
          .map((favorite) => String(favorite.movie_id))
          .filter(Boolean);

        if (movieIds.length === 0) {
          setFavoriteMovies([]);
        } else {
          try {
            const movies = await fetchAppwriteFavorite(movieIds);
            setFavoriteMovies(movies);
          } catch (favoritesError) {
            console.log(favoritesError);
            setFavoriteMovies([]);
          }
        }
      } else {
        setUser(null);
        setFavoriteMovies([]);
      }
    } catch (error) {
      if (error?.code !== 401) {
        console.log(error);
      }
      setUser(null);
      setFavoriteMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Ensure we restore any existing session on mount
    checkUserStatus();
  }, []);

  /**
   * Create an Appwrite account, log the user in, then refresh local state.
   */
  const registerUser = async (userInfo) => {
    setLoading(true);
    try {
      await account.create({
        userId: ID.unique(),
        email: userInfo.email,
        password: userInfo.password,
        name: userInfo.name,
      });

      await account.createEmailPasswordSession({
        email: userInfo.email,
        password: userInfo.password,
      });

      await checkUserStatus();
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  /**
   * Authenticate with email/password and refresh session context.
   */
  const loginUser = async (userInfo) => {
    setLoading(true);

    try {
      // Create a session then fetch the account profile for context
      await account.createEmailPasswordSession({
        email: userInfo.email,
        password: userInfo.password,
      });

      await checkUserStatus();
    } catch (error) {
      console.log(error);
      setLoading(false);
      throw error;
    }
  };

  /**
   * Destroy the Appwrite session and clear local caches.
   */
  const logoutUser = () => {
    // Remove the active session on the server and clear local state
    account
      .deleteSession({ sessionId: "current" })
      .catch((error) => console.log(error))
      .finally(() => {
        setUser(null);
        setFavoriteMovies([]);
      });
  };

  /**
   * Persist a movie ID to Appwrite favorites and append its TMDB details locally.
   */
  const addFavorite = async (movieId) => {
    if (!user) return;

    const normalizedId = String(movieId);

    try {
      await addAppwriteFavorite(user.$id, normalizedId);

      const exists = favoriteMovies.some(
        (movie) => String(movie.id) === normalizedId
      );
      if (exists) {
        return;
      }

      const movieDetail = await getMovieDetail(normalizedId);
      setFavoriteMovies((prev) => [...prev, movieDetail]);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Remove a favorite movie both remotely (Appwrite) and locally.
   */
  const removeFavorite = async (movieId) => {
    if (!user) return;

    const normalizedId = String(movieId);

    try {
      await removeAppwriteFavorite(user.$id, normalizedId);
      setFavoriteMovies((prev) =>
        prev.filter((movie) => String(movie.id) !== normalizedId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Refresh the favorite movie list from Appwrite and TMDB.
   */
  const fetchFavorites = async () => {
    if (!user) return [];

    try {
      const userFavorites = await loadUserFavorites(user.$id);
      const movieIds = (userFavorites ?? [])
        .map((favorite) => String(favorite.movie_id))
        .filter(Boolean);

      if (movieIds.length === 0) {
        setFavoriteMovies([]);
        return [];
      }

      const movies = await fetchAppwriteFavorite(movieIds);
      setFavoriteMovies(movies);
      return movies;
    } catch (error) {
      console.log(error);
      setFavoriteMovies([]);
      throw error;
    }
  };

  const contextData = {
    user,
    registerUser,
    loginUser,
    logoutUser,
    checkUserStatus,
    favorites: favoriteIds,
    favoriteMovies,
    addFavorite,
    removeFavorite,
    fetchFavorites,
    loading,
  };

  // RENDER
  return (
    <AuthContext.Provider value={contextData}>
      {loading && (
        <div className="absolute mt-32">
          <Spinner />
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
