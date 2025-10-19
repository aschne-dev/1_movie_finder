import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../utils/AuthContext";

export default function LoginPage() {
  // STATE
  const { user, loginUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Redirect away if a session already exists
    if (user) {
      navigate("/");
    }
  }, []);

  // COMPORTEMENTS
  const handleSubmit = (e) => {
    e.preventDefault();

    // Pass collected credentials to the auth context
    const userInfo = { email, password };
    loginUser(userInfo);
  };

  // RENDER
  return (
    <div>
      <div className="pattern" />

      <div className="wrapper">
        <div className="flex justify-center">
          {/* Centered login form that forwards submission to context */}
          <form className="login-page" onSubmit={handleSubmit}>
            <label className="">Email :</label>
            <input
              required
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
            />

            <label className="">Password :</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
            />

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
