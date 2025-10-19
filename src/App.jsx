import { Route, Routes } from "react-router";
import Header from "./components/Header";
import HomePage from "./components/pages/HomePage";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
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

          {/* Guarded routes require an authenticated user */}
          <Route element={<PrivateRoutes />}>
            <Route path="/profile" element={<HomePage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}
