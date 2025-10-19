import { ID } from "appwrite";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { account } from "./appwrite";

// Central auth context exposes session state and helpers
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // STATE
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // COMPORTEMENTS
  const checkUserStatus = useCallback(async () => {
    try {
      // Check if a valid session cookie already exists
      const session = await account.getSession({ sessionId: "current" });

      if (session) {
        // Session is valid, hydrate user with full account details
        const accountDetails = await account.get();
        setUser(accountDetails);
      } else {
        setUser(null);
      }
    } catch (error) {
      if (error?.code !== 401) {
        console.log(error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Ensure we restore any existing session on mount
    checkUserStatus();
  }, [checkUserStatus]);

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
      .finally(() => setUser(null));
  };

  const contextData = {
    user,
    registerUser,
    loginUser,
    logoutUser,
    checkUserStatus,
    loading,
  };

  // RENDER
  return (
    <AuthContext.Provider value={contextData}>
      {loading && <p className="text-gray-100">Loading...</p>}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
