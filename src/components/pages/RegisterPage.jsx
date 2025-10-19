import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../utils/AuthContext";

export default function RegisterPage() {
  // STATE
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState(null);
  const { user, registerUser } = useAuth();

  const navigate = useNavigate();

  // COMPORTEMENTS
  useEffect(() => {
    // Redirect away if a session already exists
    if (user) {
      navigate("/");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== password2) {
      setError("Passwords do not match !");
      return;
    }

    setError(null);
    const userInfo = { name, email, password, password2 };
    registerUser(userInfo);
    console.log("submit");
  };

  // RENDER
  return (
    <div>
      <div className="pattern" />

      <div className="wrapper">
        <div className="flex justify-center">
          <form className="login-page" onSubmit={handleSubmit}>
            <label className="">Email :</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error === "Please enter a valid email address.") {
                  setError(null);
                }
              }}
              placeholder="Enter Email"
            />

            <label className="">Name :</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
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

            <label className="">Confirm Password :</label>
            <input
              required
              type="password"
              value={password2}
              onChange={(e) => {
                setPassword2(e.target.value);
                if (error) {
                  setError(null);
                }
              }}
              placeholder="Confirm Password"
            />

            {error && (
              <p className="text-red-600 flex justify-start">{error}</p>
            )}

            <button>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}
