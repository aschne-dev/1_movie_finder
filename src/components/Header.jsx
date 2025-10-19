import { Link } from "react-router";
import { useAuth } from "../utils/AuthContext";

const Header = () => {
  // STATE
  // Pull current session state and auth actions for nav controls
  const { user, logoutUser } = useAuth();

  // RENDER
  return (
    <header className="app-header bg-amber-300">
      <div className="app-header__content">
        <Link to="/" className="text-gray-100">
          LOGO
        </Link>

        {/* Switch the navigation links based on auth state */}
        <div>
          {user ? (
            <>
              <Link to="/">Home</Link>
              <Link to="/profile">Profile</Link>

              <button onClick={logoutUser}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
