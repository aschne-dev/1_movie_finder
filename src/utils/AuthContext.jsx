import { ID } from "appwrite";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Spinner from "../components/Spinner";
import {
  account,
  addNewFavorite,
  loadUserFavorites,
  removeAFavorite,
} from "./appwrite";

// Central auth context exposes session state and helpers
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // STATE
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // COMPORTEMENTS
  const checkUserStatus = useCallback(async () => {
    try {
      // Check if a valid session cookie already exists
      const session = await account.getSession({ sessionId: "current" });

      if (session) {
        // Session is valid, hydrate user with full account details
        const accountDetails = await account.get();
        setUser(accountDetails);

        // Hydrate favorites
        const userFavorites = await loadUserFavorites(accountDetails.$id);
        setFavorites(
          userFavorites
            .map((favorite) => String(favorite.movie_id))
            .filter(Boolean)
        );
      } else {
        setUser(null);
        setFavorites([]);
      }
    } catch (error) {
      if (error?.code !== 401) {
        console.log(error);
      }
      setUser(null);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Ensure we restore any existing session on mount
    checkUserStatus();
  }, [checkUserStatus]);

  useEffect(() => {
    // Ensure we restore any existing session on mount

    console.log("favorites=", favorites);
  }, [favorites]);

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

  const logoutUser = () => {
    // Remove the active session on the server and clear local state
    account
      .deleteSession({ sessionId: "current" })
      .catch((error) => console.log(error))
      .finally(() => {
        setUser(null);
        setFavorites([]);
      });
  };

  const addFavorite = async (movieId) => {
    if (!user) return;

    await addNewFavorite(user.$id, movieId);
    setFavorites((prev) => {
      const normalizedId = String(movieId);
      if (prev.includes(normalizedId)) {
        return prev;
      }
      return [...prev, normalizedId];
    });
  };

  const removeFavorite = async (movieId) => {
    if (!user) return;

    const normalizedId = String(movieId);

    try {
      await removeAFavorite(user.$id, normalizedId);

      setFavorites((prev) => prev.filter((id) => id !== normalizedId));
    } catch (error) {
      console.log(error);
    }
  };

  const contextData = {
    user,
    registerUser,
    loginUser,
    logoutUser,
    checkUserStatus,
    addFavorite,
    removeFavorite,
    favorites,
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
