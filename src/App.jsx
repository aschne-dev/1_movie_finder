import { Route, Routes } from "react-router";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./utils/AuthContext";
import PrivateRoutes from "./utils/PrivateRoutes";

export default function App() {
  return (
    <div>
      {/* Share authentication state with the full route tree */}
      <AuthProvider>
        {/* Global navigation stays visible regardless of route */}
        <Header />
        {/* Public and private routes for the application */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />

          {/* Guarded routes require an authenticated user */}
          <Route element={<PrivateRoutes />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Catch-all route for unknown paths */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}
