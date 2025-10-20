import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../utils/AuthContext";

export default function LoginPage() {
  // STATE
  const { user, loginUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect away if a session already exists
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // COMPORTEMENTS
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Pass collected credentials to the auth context
    const userInfo = { email, password };
    setError(null);

    try {
      await loginUser(userInfo);
    } catch (loginError) {
      console.log("LOGINERROR" + loginError);
      if (loginError?.code === 401) {
        setError("Invalid credentials. Please check your email and password.");
      } else if (loginError?.code === 404) {
        setError("User not found. Please register first.");
      } else {
        setError("Unable to log in right now. Please try again shortly.");
      }
    }
  };

  // RENDER
  return (
    <div>
      <div className="pattern" />

      <div className="wrapper mt-10">
        <div className="flex justify-center">
          {/* Centered login form that forwards submission to context */}
          <form className="login-page" onSubmit={handleSubmit}>
            <label className="">Email :</label>
            <input
              required
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) {
                  setError(null);
                }
              }}
              placeholder="Enter Email"
            />

            <label className="">Password :</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) {
                  setError(null);
                }
              }}
              placeholder="Enter Password"
            />

            {error && (
              <p className="text-red-600 flex justify-start">{error}</p>
            )}
            <button>Login</button>
            <p>
              Don't have an account yet ?<Link to="/register">Register</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
