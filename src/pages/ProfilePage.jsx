import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../utils/AuthContext";

export default function ProfilePage() {
  // STATE
  const { user } = useAuth();
  const navigate = useNavigate();

  // COMPORTEMENTS
  useEffect(() => {
    // Redirect away if a session already exists
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // RENDER
  return (
    <div>
      <div className="pattern" />
      <div className="wrapper pt-20 text-white">
        <ul>
          <li>Nom: {user.name}</li>
          <li>Email: {user.email}</li>
        </ul>
      </div>
    </div>
  );
}
