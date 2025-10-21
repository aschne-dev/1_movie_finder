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
      <div className="wrapper pt-20 text-white flex items-center">
        <h1 className="text-gradient">Your Profile</h1>
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
      </div>
    </div>
  );
}
